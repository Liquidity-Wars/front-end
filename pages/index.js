import styles from "../styles/Home.module.css";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import CountdownTimer from "../components/Timer/CountdownTimer";
import { useMoralis, useWeb3Contract } from "react-moralis";
import LiquidityPool from '../components/LiquidityPool';
import networkMapping from '../constants/networkMapping.json'
import LiquidityVaultAbi from '../constants/LiquidityVault.json'
import ERC20Abi from '../constants/ERC20.json'
import UniswapV2PairAbi from '../constants/UniswapV2Pair.json'
import LiquidityWarsConfigAbi from "../constants/LiquidityWarsConfig.json";
import LiquidityWarsAbi from "../constants/LiquidityWars.json";
import SendMeDemoLps from "../constants/SendMeDemoLps.json";
import { useEffect, useState } from "react";
import ConnectToWallet from "../components/Misc/ConnectToWallet";
import TopNav from "../components/TopNav";
import Selector from "../components/Misc/Selector";

export default function Home() {

  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const [dateTime , setDateTime] = useState(0);
  const [ gameState, setGameState ] = useState();
  const chainId = parseInt(chainIdHex)
  const LiquidityVaultAddress = chainId in networkMapping ? networkMapping[chainId]['LiquidityVault'][0] : null
  const LiquidityVaultConfigAddress = chainId in networkMapping ? networkMapping[chainId]['LiquidityWarsConfig'][0] : null
  const LiquidityWars = chainId in networkMapping ? networkMapping[chainId]['LiquidityWars'][0] : null
  const SushiSwapAddress = chainId in networkMapping ? networkMapping[chainId]['SushiSwap'][0] : null
  const SendMeDemoLpsAddress = chainId in networkMapping ? networkMapping[chainId]['SendMeDemoLps'][0] : null
  const [allowedLPTokens , setAllowedLPTokens] = useState([]);
  const [allowedLPAddresses , setAllowedLPAddresses] = useState([]);
  
  // get time getTimeToStartOrEndGame
  const {runContractFunction: getTimeToStartOrEndGame} = useWeb3Contract({
    abi: LiquidityVaultAbi,
    contractAddress: LiquidityVaultAddress,
    functionName:"getTimeToStartOrEndGame",
    params:{}
  })

  // getGameState 
  const {runContractFunction: getGameState} = useWeb3Contract({
    abi: LiquidityVaultAbi,
    contractAddress: LiquidityVaultAddress,
    functionName:"getGameState",
    params:{}
  })

  // Keep track and update all UI state
  async function updateUI(){

    // const getTime = (await getTimeToStartOrEndGame()).toString();
    const gameStatus = (await getGameState()).toString();
    setDateTime(450)
    setGameState(gameStatus)

  }

  const handleSuccess = async (tx) => {
    try {
        await tx.wait(1)
        updateUI()
        // handleNewNotification(tx)
    } catch (error) {
        console.log(error)
    }
  }

  // const handleNewNotification = (tx) =>{

  // }

  const getAllowedTokens = async () => {
    if(LiquidityVaultConfigAddress && LiquidityWarsConfigAbi) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const liquidityWarsConfigContract = new ethers.Contract(LiquidityVaultConfigAddress, LiquidityWarsConfigAbi, provider);
      const addresses = await liquidityWarsConfigContract.getAllowedTokens();
      setAllowedLPAddresses(addresses);
    }
  } 

  const getTokenPairAddresses = async (lpTokenAddress) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const uniswapPairContract = new ethers.Contract(lpTokenAddress, UniswapV2PairAbi, provider);
    const token0 = uniswapPairContract.token0();
    const token1 = uniswapPairContract.token1();
    const result = await Promise.all([token0, token1])
    return result;
  };

  const getTokenSymbol = async (tokenAddress) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const erc20TokenContract = new ethers.Contract(tokenAddress, ERC20Abi, provider);
    const symbol = erc20TokenContract.symbol();
    return symbol;
  }

  const getLPTokenSymbol = async (lpTokenAddress) => {
    const [token0, token1] = await getTokenPairAddresses(lpTokenAddress);
    const symbol0 = getTokenSymbol(token0);
    const symbol1 = getTokenSymbol(token1);
    const result = await Promise.all([symbol0, symbol1]);
    const lpTokenSymbol = result.join('-');
    const newAllowedLPTokens = allowedLPTokens.concat([lpTokenSymbol]);
    setAllowedLPTokens([...new Set(newAllowedLPTokens)]);
  }

  useEffect(() => {
    getAllowedTokens();
  }, [LiquidityVaultAddress])
  
  useEffect(() => {
    //console.log("allowedLPAddresses: ", allowedLPAddresses);
    for (let i = 0; i < allowedLPAddresses.length; i++) {
      getLPTokenSymbol(allowedLPAddresses[i]);
    }
  }, [allowedLPAddresses])

  useEffect(() =>{
    if(allowedLPTokens.length > 0) {
      console.log("allowedLPTokens: ", allowedLPTokens);
    }
  }, [allowedLPTokens])

  useEffect(() =>{
    if(isWeb3Enabled){
      updateUI();
    }
  }, [isWeb3Enabled])

  return (
    <>
    <TopNav />
      <div className={styles.container}>
        <div className="flex flex-col justify-center items-center pt-4">
          <motion.div
            initial={{
              y: 0,
            }}
            animate={{
              y: [30, 0, 30],
              transition: {
                duration: 1.6,
                ease: "linear",
                repeat: Infinity,
              },
            }}
            className="flex"
          >
            <img
              className="h-64"
              src="/assets/images/sample-logo.png"
              alt="logo"
            />
          </motion.div>

          <div className="flex flex-col mt-12">

            {isWeb3Enabled ? ( 
              <>
              <div className="bg-transparent p-4 ">
                <div className="bg-[url('/assets/images/valley-canvas.png')] justify-center w-[700px] h-auto bg-cover bg-no-repeat">
                    <div className="flex flex-col  justify-center text-lg items-center text-center px-6 py-6">
                      <h2 className="font-['Nabana-bold'] text-4xl text-[#CF3810]">Next Game In</h2>
                      <div className="bg-[url('/assets/images/scroll.png')] justify-center w-24 bg-cover bg-no-repeat">
                        <p className="font-['Nabana-bold']">{gameState == 0 ? 'Ready' : 'Running'}</p>
                      </div>
                      <CountdownTimer targetDate={dateTime} />
                      <Selector />
                      <LiquidityPool 
                      LiquidityVaultAddress={LiquidityVaultAddress}
                      LiquidityVaultConfigAddress={LiquidityVaultConfigAddress}
                      SushiSwapAddress={SushiSwapAddress}
                      allowedLPTokens={allowedLPTokens}
                      SendMeDemoLpsAddress={SendMeDemoLpsAddress}
                      />

                    </div>
                  </div>
              </div>
              
              </>
            ) :
            (
              <ConnectToWallet />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

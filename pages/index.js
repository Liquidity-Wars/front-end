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
import { useEffect, useState } from "react";
import ConnectToWallet from "../components/Misc/ConnectToWallet";
import TopNav from "../components/TopNav";
import Multiplayer from "../components/MusicPlayer/Multiplayer";
import { useRouter } from "next/router";
import { useNotification } from "web3uikit";

export default function Home() {
  const router = useRouter();
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const [dateTime , setDateTime] = useState(0);
  const [ gameState, setGameState ] = useState();
  const chainId = parseInt(chainIdHex)
  const LiquidityVaultAddress = chainId in networkMapping ? networkMapping[chainId]['LiquidityVault'][0] : null
  const LiquidityVaultConfigAddress = chainId in networkMapping ? networkMapping[chainId]['LiquidityWarsConfig'][0] : null
  const SendMeDemoLpsAddress = chainId in networkMapping ? networkMapping[chainId]['SendMeDemoLps'][0] : null
  const [allowedLPTokens , setAllowedLPTokens] = useState([]);
  const [allowedLPAddresses , setAllowedLPAddresses] = useState([]);
  const [playerExist, setPlayerExist] = useState(false);
  const minNumberPlayers = 2;
  const [pendingPlayers, setPendingPlayers] = useState(minNumberPlayers);
  const dispatch = useNotification();

  var pluralize = require('pluralize');

  const {runContractFunction: getTimeToStartOrEndGame} = useWeb3Contract({
    abi: LiquidityVaultAbi,
    contractAddress: LiquidityVaultAddress,
    functionName:"getTimeToStartOrEndGame",
    params:{}
  })

  const {runContractFunction: getGameState} = useWeb3Contract({
    abi: LiquidityVaultAbi,
    contractAddress: LiquidityVaultAddress,
    functionName:"getGameState",
    params:{}
  })

  const {runContractFunction: getNumberOfPlayers} = useWeb3Contract({
    abi: LiquidityVaultAbi,
    contractAddress: LiquidityVaultAddress,
    functionName:"getNumberOfPlayers",
    params:{}
  })

  const {runContractFunction: getPlayerInfo} = useWeb3Contract({
    abi: LiquidityVaultAbi,
    contractAddress: LiquidityVaultAddress,
    functionName:"getPlayerInfo",
    params:{ _playerAddress: account }
  })

  // Keep track and update all UI state
  async function updateUI(){

    const getTime = (await getTimeToStartOrEndGame())?.toString() || 0;
    const gameStatus = (await getGameState()).toString();
    const playerInfo = (await getPlayerInfo())?.toString();
    const numberPlayers = (await getNumberOfPlayers())?.toString() || 0;
    const playerExistInGame = playerInfo?.split(',')[0] 

    setGameState(gameStatus)
    setPendingPlayers(minNumberPlayers-numberPlayers);

    if(allowedLPAddresses.includes(playerExistInGame)){
      setPlayerExist(true)
    } 

    console.log("getTime:", getTime)
    console.log("gameStatus:", gameStatus)

    let expiresInMS = getTime*1000
    let currentTimeStamp = new Date()
    let expiresDateTime = new Date(currentTimeStamp.getTime() + expiresInMS);
    setDateTime(expiresDateTime)
    
  }

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

  const playButtonClicked = () => {
    if (pendingPlayers > 0) {
      dispatch({
        type: "error",
        message: `Waiting for more players to join the game`,
        title: "Failed to start the game",
        position: "topR",
      });
      return;
    }
    if (pendingPlayers <= 0 && gameState == 0) {
      dispatch({
        type: "error",
        message: `Game is not ready yet, please wait a few more seconds and try again`,
        title: "Failed to start the game",
        position: "topR",
      });
      updateUI();
      return;
    }
    router.push("/map-page");
  }
  
  useEffect(() => {
    for (let i = 0; i < allowedLPAddresses.length; i++) {
      getLPTokenSymbol(allowedLPAddresses[i]);
    }

    if(allowedLPAddresses.length > 0){
      updateUI();
    }
  }, [allowedLPAddresses])

  useEffect(() => {
    getAllowedTokens();
  }, [LiquidityVaultAddress])
  
  useEffect(() =>{
    console.log("account: ", account)
    if(isWeb3Enabled){
      updateUI();
    }
  }, [isWeb3Enabled, account, playerExist])

  return (
    <>
    <TopNav />
      <Multiplayer />
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
              className="h-52"
              src="/assets/images/liquidity_wars.png"
              alt="logo"
            />
          </motion.div>

          <div className="flex flex-col mt-12">

            {isWeb3Enabled && gameState ? ( 
              <>
              <div className="bg-transparent p-4 ">
                <div className="bg-[url('/assets/images/valley-canvas.png')] justify-center w-[800px] h-auto bg-cover bg-no-repeat">
                    <div className="flex flex-col  justify-center text-lg items-center text-center px-6 py-6">
                      <h2 className="font-['Nabana-bold'] text-4xl text-[#CF3810]">
                        {gameState == 0 ? 'Game will start Soon!' : 'Game is Running!'}
                      </h2>
                      {gameState == 0 && dateTime <= new Date() && pendingPlayers > 0 &&
                        (<h3 className="font-['Nabana-bold'] text-2xl">
                          Game is about to start, waiting for {pendingPlayers} {pluralize("player", pendingPlayers)} to join...
                        </h3>)
                      }
                      {gameState == 1 && !playerExist &&
                        (<h3 className="font-['Nabana-bold'] text-2xl">
                          Please wait for the next round to start...
                        </h3>)
                      }
                      {/* <div className="bg-[url('/assets/images/scroll.png')] justify-center w-24 bg-cover bg-no-repeat">
                        <p className="font-['Nabana-bold']">{gameState == 0 ? 'Ready' : 'Running'}</p>
                      </div> */}

                      {!playerExist && 
                        <CountdownTimer targetDate={dateTime} />
                      }
                      
                      {playerExist && 
                        (<div className="bg-transparent p-8 ">
                            <div className="bg-[url('/assets/images/Web3Frame.png')] flex justify-center w-64 h-64 bg-cover bg-no-repeat">
                                <div className="flex flex-col font-['Stardew'] justify-center text-lg items-center text-center px-6">
                                    <h2>Welcome to <br></br> Liquidity Wars!!!</h2>
                                    <a onClick={playButtonClicked}
                                        className="cursor-pointer bg-[url('/assets/images/valley-button.png')] font-['Nabana-bold'] w-40 h-16 bg-cover bg-no-repeat text-[#CF3810] p-4 ">
                                      Play Now!
                                    </a>
                                </div>
                            </div>
                        </div>)
                      } 
                      {!playerExist && gameState == 0 && 
                        (<LiquidityPool 
                          LiquidityVaultAddress={LiquidityVaultAddress}
                          LiquidityVaultConfigAddress={LiquidityVaultConfigAddress}
                          SendMeDemoLpsAddress={SendMeDemoLpsAddress}
                          allowedLPTokens={allowedLPTokens}
                          allowedLPAddresses={allowedLPAddresses}
                          gameState={gameState}
                          onSucess={updateUI}
                        />)
                      } 
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

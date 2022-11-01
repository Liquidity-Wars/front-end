import styles from "../styles/Home.module.css";
import { motion } from "framer-motion";
import CountdownTimer from "../components/Timer/CountdownTimer";
import { useMoralis, useWeb3Contract } from "react-moralis";
import LiquidityVault from '../constants/LiquidityVault.json'
import LiquidityPool from '../components/LiquidityPool';
import networkMapping from '../constants/networkMapping.json'
import LiquidityWars from "../constants/LiquidityWars.json";
import { useEffect, useState } from "react";
import ConnectToWallet from "../components/Misc/ConnectToWallet";
import TopNav from "../components/TopNav";

export default function Home() {

  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const [dateTime , setDateTime] = useState();
  const [ gameState, setGameState ] = useState();
  const chainId = parseInt(chainIdHex)
  const LiquidityVaultAddress = chainId in networkMapping ? networkMapping[chainId]['LiquidityVault'][0] : null


  // get time getTimeToStartOrEndGame
  const {runContractFunction: getTimeToStartOrEndGame} = useWeb3Contract({
    abi: LiquidityVault,
    contractAddress: LiquidityVaultAddress,
    functionName:"getTimeToStartOrEndGame",
    params:{}
  })

  // getGameState 
  const {runContractFunction: getGameState} = useWeb3Contract({
    abi: LiquidityVault,
    contractAddress: LiquidityVaultAddress,
    functionName:"getGameState",
    params:{}
  })

  // Keep track and update all UI state
  async function updateUI(){
    const getTime = (await getTimeToStartOrEndGame()).toString();
    const gameStatus = (await getGameState()).toString();
    setDateTime(getTime)
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
                <div className="bg-[url('/assets/images/valley-canvas.png')] justify-center w-[600px] h-auto bg-cover bg-no-repeat">
                    <div className="flex flex-col  justify-center text-lg items-center text-center px-6 py-6">
                      <h2 className="font-['Nabana-bold'] text-4xl text-[#CF3810]">Next Game In</h2>
                      <div className="bg-[url('/assets/images/scroll.png')] justify-center w-24 bg-cover bg-no-repeat">
                        <p>{gameState}</p>
                      </div>
                      <CountdownTimer targetDate={dateTime} />
                      <LiquidityPool contractAddress={LiquidityVaultAddress} />
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

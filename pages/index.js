import styles from "../styles/Home.module.css";
import { motion } from "framer-motion";
import CountdownTimer from "../components/Timer/CountdownTimer";
import { useMoralis, useWeb3Contract } from "react-moralis";
import LiquidityVault from '../constants/LiquidityVault.json'
import LiquidityWars from '../constants/LiquidityWars.json'
import LiquidityPool from '../components/LiquidityPool';
import { useEffect, useState } from "react";
import ConnectToWallet from "../components/Misc/ConnectToWallet";

export default function Home() {

  const { isWeb3Enabled, account } = useMoralis();
  const [dateTime , setDateTime] = useState();
  // const dateTime = NOW_IN_MS + THREE_DAYS_IN_MS;

  // get time getTimeToStartOrEndGame
  const {runContractFunction: getTimeToStartOrEndGame} = useWeb3Contract({
    abi: LiquidityVault,
    contractAddress: "0x41e190323923e37A190A6907aa4868cb0F613cF2",
    functionName:"getTimeToStartOrEndGame",
    params:{}
  })

  // Keep track and update all UI state
  async function updateUI(){
    const getTime = (await getTimeToStartOrEndGame()).toString();
    setDateTime(getTime)
    console.log(getTime)
  }

  useEffect(() =>{
    if(isWeb3Enabled){
      updateUI();
    }
  }, [isWeb3Enabled])

  return (
    <>
      <div className={styles.container}>
        <div className="flex flex-col justify-center items-center pt-4">
          <motion.div
             initial={{
              y: 0,
            }}
            animate={{
              y: [30, 0, 30],
              transition:{
                duration: 1.6,
                ease: "linear",
                repeat: Infinity,
              }
            }}
           className="flex"
          >  
          <img  className="h-64"src="/assets/images/sample-logo.png" alt="logo"/>
          </motion.div>
            
          <div className="flex flex-col mt-12">

            {isWeb3Enabled ? ( 
              <>
              <div className="bg-transparent p-4 ">
                <div className="bg-[url('/assets/images/valley-canvas.png')] justify-center w-[500px] h-auto bg-cover bg-no-repeat">
                    <div className="flex flex-col  justify-center text-lg items-center text-center px-6 py-6">
                      <h2>Next Game In</h2>
                      <CountdownTimer targetDate={dateTime} />
                      <LiquidityPool />
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
  )
}

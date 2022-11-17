import React from 'react'
import { motion } from "framer-motion";

const HelpModal = ({handleClose}) => {
const dropIn = {
    hidden: {
        y: "-100vh",
        opacity: 0,
    },
    visible: {
        y: "0",
        overflowY: "hidden",
        opacity: 1,
        transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
        },
    },
    exit: {
        opacity: 0,
    },
    };
  return (
   <>
    <motion.div
      onClick={(e) => e.stopPropagation}
      className="absolute w-[400px] h-[400px] flex flex-col items-center justify-center z-50 top-20 left-[4rem]"
      variants={dropIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
        <div className="flex flex-col items-center justify-center h-full w-full rounded-md bg-cover bg-[url('/assets/images/Web3Frame.png')]">
        <button
            onClick={handleClose}
            className="absolute top-8 right-10"
        >
            <div className="text-red-500 font-semibold">
            <img
                src="/assets/images/closebutton.png"
                className="h-[30px] p-0"
                alt="close icon"
            />
            </div>
        </button>
        <div className="h-[350px] w-[350px]  overflow-y-scroll overflow-x-hidden flex flex-col">
            <div className='p-4'>
                <h3 className='font-bold'>Guide & Information</h3>
                <hr className='my-2'></hr>
                <p>Liquidity wars is no lose game when players deploy its liquidity to play in the game. At the end of the game each player can redeem the same amount of liquidity tokens (LP). The main rules in the game is to get as many resources (RES) as it is possible. The RES will be the base for rewards distributions which will be derived from LP tokens rewards. In order to get RES players can attack and rob each other, develop infrastruture to get more resources, increase defence or places to hide RES from the aggressor. The purpose of the project is to not be another play to earn game but to be play and earn game which will atract potential investors to provide and lock their liquidity. The targets of the projects are not only players but DEXes which will want to increase liquidity by our game. That is why another goal of the game is to have configurable game where each DEX can configure its game and some game parameters (game duration, additional rewards, allowed LP tokens).</p>
            </div>
        </div>
        </div>
    </motion.div>
   </>
  )
}

export default HelpModal
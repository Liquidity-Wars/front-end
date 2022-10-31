import React, { useState, useEffect } from 'react'
import LiquidityVault from '../constants/LiquidityVault.json'
import { useMoralis, useWeb3Contract,  } from "react-moralis"
import { ethers } from "ethers"

const LiquidityPool = () => {

  const [ tokenAmount, setTokenAmount] = useState(0);
  const [ requiredAmount, setRequiredAmount] = useState(0);
  const { isWeb3Enabled  } = useMoralis();
  const depositToken = event =>{
    event.preventDefault();
    console.log(tokenAmount)
  }

  const { runContractFunction: depositLpToken } = useWeb3Contract({
    abi: LiquidityVault,
    contractAddress: '0x41e190323923e37A190A6907aa4868cb0F613cF2',
    functionName: "depositLpToken",
    params:{
      tokenAmount: 10,

    }
  })

  // getUsdRequiredAmount
  const { runContractFunction: getUsdRequiredAmount } = useWeb3Contract({
    abi: LiquidityVault,
    contractAddress: '0x41e190323923e37A190A6907aa4868cb0F613cF2',
    functionName: "getUsdRequiredAmount",
    params:{}
  })



  async function updateUI(){
    const depositedLpTokens = await depositLpToken();
    const getUsdAmount = (await getUsdRequiredAmount()).toString();

    setRequiredAmount(getUsdAmount);
  }

  useEffect(() =>{
    if(isWeb3Enabled){
      updateUI();
    }
  }, [isWeb3Enabled])

  return (
   <>
      <div className='bg-white p-4 shadow-sm rounded-lg'>
        
        <form onSubmit={depositToken}>
          <div>
            <label className='block mb-2 text-sm font-medium text-gray-900'>Deposit</label>
            <input 
              onChange={event => setTokenAmount(event.target.value)}
              value={tokenAmount}
              type='text' id="deposit" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
            <div>Amount u need to deposit {requiredAmount}USd to play </div>
          </div>
          {/* <div className="bg-[url('/assets/images/valley-button.png')] justify-center items-center w-40 h-auto bg-cover bg-no-repeat">
            
          </div> */}

          <button className="bg-[url('/assets/images/valley-button.png')] w-40 h-16 bg-cover bg-no-repeat text-white p-2 ">Deposit</button>

        </form>
      </div>
   </>
  )
}

export default LiquidityPool
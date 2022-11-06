import React, { useState, useEffect } from 'react'
import LiquidityVault from '../constants/LiquidityVault.json'
import LiquidityWarsConfig from '../constants/LiquidityWarsConfig.json'
import { useMoralis, useWeb3Contract  } from "react-moralis"
import { ethers } from "ethers"
import { Form } from 'web3uikit';

const LiquidityPool = ({LiquidityVaultConfigAddress, LiquidityVaultAddress}) => {

  const [ tokenAmount, setTokenAmount] = useState(0);
  const [ requiredAmount, setRequiredAmount] = useState(0);
  const [ tokenId, setTokenId ] = useState();
  const { isWeb3Enabled  } = useMoralis();
  const { runContractFunction } = useWeb3Contract();

  // deposit LP tokens
  const { runContractFunction: depositLpToken } = useWeb3Contract({
    abi: LiquidityVault,
    contractAddress: LiquidityVaultAddress,
    functionName: "depositLpToken",
    params:{
      amount: tokenAmount,
      tokenAddress: "0xe11a86849d99f524cac3e7a0ec1241828e332c62" // usdc token addre
    }
  })

  // getUsdRequiredAmount
  const { runContractFunction: getUsdRequiredAmount } = useWeb3Contract({
    abi: LiquidityWarsConfig,
    contractAddress: LiquidityVaultConfigAddress,
    functionName: "getUsdRequiredAmount",
    params:{}
  })

  // getUsdRequiredAmount
  const { runContractFunction: getGameDuration } = useWeb3Contract({
    abi: LiquidityVault,
    contractAddress: LiquidityVaultAddress,
    functionName: "getGameDuration",
    params:{}
  })

  async function updateUI(){
    const depositedLpTokens = await depositLpToken();
    const getUsdAmount = (await getUsdRequiredAmount()).toString();
    const gameDuration = (await getGameDuration()).toString();
    console.log(gameDuration)
    setRequiredAmount(getUsdAmount);
  }



  // let approveOptions = {
  //   abi:LiquidityVault,
  //   contractAddress: contractAddress,
  //   functionName: "depositLpToken"
  // }

  // const depositToken = async event =>{
  //   event.preventDefault();

  //   approveOptions.params = {
  //     amount: tokenAmount,
  //     tokenAddress: "0xe11a86849d99f524cac3e7a0ec1241828e332c62"
  //   }

  //   console.log("approving")

  //   const tx = await depositLpToken({
  //     params: approveOptions,
  //     onError : (error) => console.log(error),
  //     onSuccess : () =>{
  //       handleApproveSuccess(approveOptions.params.amount)
  //     }
  //   })
    
  // }

  

  async function depositLPTokens(event){
    event.preventDefault();
    const tokensAddr = '0xe097d6b3100777dc31b34dc2c58fb524c2e76921'
    setTokenId(tokensAddr);
    // const price = ethers.utils.parseUnits(tokenAmount, "ether").toString()
    const price = Number(tokenAmount)

    const approveOptions = {
      abi:LiquidityVault,
      contractAddress: LiquidityVaultAddress,
      functionName: "depositLpToken",
      params: {
        _tokenAddress: tokenId,
        _amount: price
      }
    }
    // claimRewardTokensFromProtocol
    //  const approveOptions = {
    //   abi:LiquidityVault,
    //   contractAddress: LiquidityVaultAddress,
    //   functionName: "setGameDuration",
    //   params: {
    //     _gameDuration : 1000
    //   }
    // }
    console.log(approveOptions )

    await runContractFunction({
      params: approveOptions,
      onSuccess: handleApproveSuccess,
      onError:(error) =>{
        handleError(error);
      }
    })

  }

  async function handleApproveSuccess(tx){
   await tx.wait(1)
    console.log("soemthing")
  }

  async function handleError(error){
    // await tx.wait(1)
     console.log("soemthing", error)
   }
  
  useEffect(() =>{
    if(isWeb3Enabled){
      updateUI();
    }
  }, [isWeb3Enabled])

  return (
   <>
      <div className="bg-[url('/assets/images/frame.png')] p-4 shadow-sm rounded-lg bg-cover bg-no-repeat justify-center items-center w-[400px]">

        <form className='px-4 py-4' onSubmit={depositLPTokens}>
          <div>
            <label className="block mb-2  font-['Nabana-bold'] text-3xl text-[#CF3810] font-medium">Deposit</label>
            <input 
              onChange={event => setTokenAmount(event.target.value)}
              value={tokenAmount}
              type='text' id="deposit" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
            <div className='text-[#CF3810] text-sm font py-1'>Amount u need to deposit {requiredAmount} USD to play </div>
          </div>
          {/* <div className="bg-[url('/assets/images/valley-button.png')] justify-center items-center w-40 h-auto bg-cover bg-no-repeat">
            
          </div> */}

          <button className="bg-[url('/assets/images/valley-button.png')] font-['Nabana-bold'] w-40 h-16 bg-cover bg-no-repeat text-[#CF3810] p-2 ">Deposit</button>

        </form>
      </div>
   </>
  )
}

export default LiquidityPool
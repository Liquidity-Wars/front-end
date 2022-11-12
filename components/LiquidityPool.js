import React, { useState, useEffect } from 'react'
import SendMeDemoLpsAbi from "../constants/SendMeDemoLps.json";
import LiquidityVaultAbi from '../constants/LiquidityVault.json'
import LiquidityWarsConfigAbi from '../constants/LiquidityWarsConfig.json'
import { useMoralis, useWeb3Contract  } from "react-moralis"
import { ethers } from "ethers"
import { Form } from 'web3uikit';

const LiquidityPool = ({LiquidityVaultConfigAddress, LiquidityVaultAddress, SushiSwapAddress, allowedLPTokens, SendMeDemoLpsAddress}) => {

  const [ tokenAmount, setTokenAmount] = useState(0);
  const [ requiredAmount, setRequiredAmount] = useState(0);
  const [ tokenId, setTokenId ] = useState();
  const [ demoLps , setDemoLps] = useState();
  const { isWeb3Enabled  } = useMoralis();
  const { runContractFunction } = useWeb3Contract();

  // deposit LP tokens
  const { runContractFunction: depositLpToken } = useWeb3Contract({
    abi: LiquidityVaultAbi,
    contractAddress: LiquidityVaultAddress,
    functionName: "depositLpToken",
    params:{
      amount: tokenAmount,
      tokenAddress: "0xe11a86849d99f524cac3e7a0ec1241828e332c62" // usdc token addre
    }
  })

  // getUsdRequiredAmount
  const { runContractFunction: getUsdRequiredAmount } = useWeb3Contract({
    abi: LiquidityWarsConfigAbi,
    contractAddress: LiquidityVaultConfigAddress,
    functionName: "getUsdRequiredAmount",
    params:{}
  })

  // getUsdRequiredAmount
  const { runContractFunction: getGameDuration } = useWeb3Contract({
    abi: LiquidityVaultAbi,
    contractAddress: LiquidityVaultAddress,
    functionName: "getGameDuration",
    params:{}
  })

  // send me Demo lps

  const { runContractFunction: sendMeDemoLps } = useWeb3Contract({
    abi: SendMeDemoLpsAbi,
    contractAddress: SendMeDemoLpsAddress,
    functionName: "sendMeDemoLps",
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
    const tokensAddr = '0x18a2470a7a8cda7691bb3a304b880da720053a3e' //Lp tokens
    setTokenId(tokensAddr);
    // const price = ethers.utils.parseUnits(tokenAmount, "ether").toString()
    const price = Number(tokenAmount)

    const approveOptions = {
      abi:LiquidityVault,
      contractAddress: LiquidityVaultAddress,
      functionName: "depositLpToken",
      params: {
        _tokenAddress: tokensAddr,
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

  const SendMeDemoLps = async () =>{
    console.log("button trigger")
      const demoLps = await sendMeDemoLps()

      console.log(demoLps)
  }
  
  useEffect(() =>{
    if(isWeb3Enabled){
      console.log(allowedLPTokens)
      updateUI();
    }
  }, [isWeb3Enabled])

  return (
   <>
      <div className="bg-[url('/assets/images/frame.png')] p-4 shadow-sm rounded-lg bg-cover bg-no-repeat justify-center items-center w-[450px]">

        <div className='px-4 py-4' >
          <div>
            <label className="block mb-2  font-['Nabana-bold'] text-3xl text-[#CF3810] font-medium">Deposit</label>
            <input 
              onChange={event => setTokenAmount(event.target.value)}
              value={tokenAmount}
              type='text' id="deposit" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
            <div className='text-[#CF3810] text-sm font py-1'>Amount u need to deposit <br/> {requiredAmount} LP Token to play </div>
          </div>
          {/* <div className="bg-[url('/assets/images/valley-button.png')] justify-center items-center w-40 h-auto bg-cover bg-no-repeat">
            
          </div> */}

          <button onSubmit={depositLPTokens} className="bg-[url('/assets/images/valley-button.png')] font-['Nabana-bold'] w-40 h-16 bg-cover bg-no-repeat text-[#CF3810] p-2 ">Deposit</button>

          <button onSubmit={SendMeDemoLps} className="bg-[url('/assets/images/valley-button.png')] font-['Nabana-bold'] w-40 h-16 bg-cover bg-no-repeat text-[#CF3810] p-2 ">DemoLps</button>
        </div>
      </div>
   </>
  )
}

export default LiquidityPool
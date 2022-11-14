import React, { useState, useEffect } from 'react'
import SendMeDemoLpsAbi from "../constants/SendMeDemoLps.json";
import LiquidityVaultAbi from '../constants/LiquidityVault.json'
import LiquidityWarsConfigAbi from '../constants/LiquidityWarsConfig.json'
import ERC20Abi from '../constants/ERC20.json';
import SushiAbi from '../constants/SushiAbi.json'
import { useMoralis, useWeb3Contract, useERC20Balances   } from "react-moralis"
import { useNotification } from "web3uikit";
import { ethers } from "ethers"
import { Form } from 'web3uikit';

const LiquidityPool = ({LiquidityVaultConfigAddress, LiquidityVaultAddress, SushiSwapAddress, allowedLPTokens, allowedLPAddresses, SendMeDemoLpsAddress, userAddress}) => {

  const [ tokenAmount, setTokenAmount] = useState(0);
  const [ requiredAmount, setRequiredAmount] = useState(0);
  const [ tokenId, setTokenId ] = useState();
  const [ demoLps , setDemoLps] = useState();
  const { isWeb3Enabled, isInitialized  } = useMoralis();
  const [ lpTokenBalance, setLpTokenBalance] = useState();
  const [ approvedAmount, setApprovedAmount ] = useState(0)
  const { runContractFunction } = useWeb3Contract();
  const dispatch = useNotification();





  // deposit LP tokens
  const { runContractFunction: depositLpToken } = useWeb3Contract({
    abi: LiquidityVaultAbi,
    contractAddress: LiquidityVaultAddress,
    functionName: "depositLpToken",
    params:{
      _amount: tokenAmount,
      _tokenAddress: allowedLPAddresses // usdc token addre
    }
  })

  const { runContractFunction: approveLpToken } = useWeb3Contract({
    abi: ERC20Abi,
    contractAddress: allowedLPAddresses[0],
    functionName: "approve",
    params:{
      spender: LiquidityVaultAddress,
      amount: tokenAmount
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

  
  async function updateUI(){
    const depositedLpTokens = await depositLpToken();
    const getUsdAmount = (await getUsdRequiredAmount())?.toString();
    const gameDuration = (await getGameDuration())?.toString();
    const format = ethers.utils.formatEther(getUsdAmount,18)
    console.log(gameDuration)
    setRequiredAmount(getUsdAmount);
  }
 
  async function depositLPTokens(event){
    event.preventDefault();
    const tokensAddr = allowedLPAddresses?.toString() //Lp tokens
    setTokenId(tokensAddr);
    // const price = ethers.utils.parseUnits(tokenAmount, "ether").toString()
    const price = Number(tokenAmount)

    const approveOptions = {
      abi:LiquidityVaultAbi,
      contractAddress: LiquidityVaultAddress,
      functionName: "depositLpToken",
      params: {
        _tokenAddress: "0x18a2470a7a8CdA7691Bb3a304b880Da720053A3e",
        _amount: tokenAmount
      }
    }
    await runContractFunction({
      params: approveOptions,
      onSuccess: handleApproveSuccess,
      onError:(error) =>{
        handleDepositErrorDispatcher(error);
      }
    })

  }

  async function approveLpTokenFunc(event){
    event.preventDefault();

    // Get Approve LP Tokens

    console.log(LiquidityVaultAddress, tokenAmount, allowedLPAddresses)
    if(tokenAmount && tokenAmount > requiredAmount){
      const approveLPTokens = await approveLpToken()
      setApprovedAmount(approveLPTokens)
      console.log(approveLPTokens)
    } else {
      handleErrorApproveDispatcher()
    }

  }
  

  async function handleApproveSuccess(tx){
   await tx.wait(1)
  }

  const SendMeDemoLpFunc = async () =>{
    let SendMeDemoLpParams = {
      abi: SendMeDemoLpsAbi,
      contractAddress: SendMeDemoLpsAddress,
      functionName: "sendMeDemoLps",
      params:{}
    }
    await runContractFunction({
      params: SendMeDemoLpParams,
      onSuccess: () => handleSuccess,
      onError: () => handleErrorDispatcher()
    })
  }

  // async function getBalance(){
  //   // tokensAddr: 0x18a2470a7a8CdA7691Bb3a304b880Da720053A3e
  //   const tokensAddr = allowedLPAddresses.toString() //Lp tokens
  //   setTokenId(tokensAddr)
  //   console.log(tokenId)
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const balance = await provider.getBalance(tokenId);
  //   // const balanceInLpToken = ethers.utils.formatEther(balance);
  //   console.log(balance.toString());
  // }

  const fetchTokenBalances = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const erc20TokenContract = new ethers.Contract("0x18a2470a7a8CdA7691Bb3a304b880Da720053A3e", SushiAbi, provider);
    const balance = (await erc20TokenContract.balanceOf(userAddress))?.toString();
    const format = ethers.utils.formatEther(balance,18)

    setLpTokenBalance(balance)
  }


  
  // dispatch function
  async function handleSuccess() {
    dispatch({
      type: "success",
      message: "Lp Tokens Are Acquired",
      title: "Troops Trained",
      position: "topR",
    });
  }
  async function handleErrorDispatcher(error) {
    dispatch({
      type: "error",
      message: "You Have Rejected The Transaction",
      title: "Failed Transaction",
      position: "topR",
    });
  }

  async function handleErrorApproveDispatcher(error) {
    dispatch({
      type: "error",
      message: "Approving Too little LpTokens!",
      title: `You have to deposit at least more than required amount ${requiredAmount}`,
      position: "topR",
    });
  }

  async function handleDepositErrorDispatcher(error) {
    dispatch({
      type: "error",
      message: `Deposit Lp token failed Amount of Lp token deposited ${tokenAmount}`,
      title: "Failed Transaction",
      position: "topR",
    });
  }
  
  useEffect(() =>{
    if(isWeb3Enabled){
      updateUI();
      if(userAddress){
        fetchTokenBalances();
      }

    }
  }, [isWeb3Enabled, userAddress,approvedAmount])


  return (
   <>
      <div className="bg-[url('/assets/images/frame.png')] p-4 shadow-sm rounded-lg bg-cover bg-no-repeat justify-center items-center w-[60%]">

        <div className='px-4 py-4' >
          <div>
            <label className="block mb-2  font-['Nabana-bold'] text-3xl text-[#CF3810] font-medium">Deposit</label>
            <input 
              onChange={event => setTokenAmount(event.target.value)}
              value={tokenAmount}
              type='text' id="deposit" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
            <div className='text-[#CF3810] text-sm font py-1'>This amount of {requiredAmount} LP Token to play </div>
            <div className='text-sm font py-1'>You currently have This much LP token {lpTokenBalance}  </div>
          </div>
          {/* <div className="bg-[url('/assets/images/valley-button.png')] justify-center items-center w-40 h-auto bg-cover bg-no-repeat">
            
          </div> */}
          {!approvedAmount ?
          (
            <button onClick={approveLpTokenFunc} className="bg-[url('/assets/images/valley-button.png')] font-['Nabana-bold'] w-40 h-16 bg-cover bg-no-repeat text-[#CF3810] p-2 ">Approve</button>
          ) : (
            <button onClick={depositLPTokens} className="bg-[url('/assets/images/valley-button.png')] font-['Nabana-bold'] w-40 h-16 bg-cover bg-no-repeat text-[#CF3810] p-2 ">Deposit</button>
          )
          }

            


          <button onClick={SendMeDemoLpFunc} className="bg-[url('/assets/images/valley-button.png')] font-['Nabana-bold'] w-40 h-16 bg-cover bg-no-repeat text-[#CF3810] p-2 ">DemoLps</button>
        </div>
      </div>
   </>
  )
}

export default LiquidityPool
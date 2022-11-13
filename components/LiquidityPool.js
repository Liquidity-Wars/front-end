import React, { useState, useEffect } from 'react'
import SendMeDemoLpsAbi from "../constants/SendMeDemoLps.json";
import LiquidityVaultAbi from '../constants/LiquidityVault.json'
import LiquidityWarsConfigAbi from '../constants/LiquidityWarsConfig.json'
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
    const tokensAddr = allowedLPAddresses?.toString() //Lp tokens
    setTokenId(tokensAddr);
    // const price = ethers.utils.parseUnits(tokenAmount, "ether").toString()
    const price = Number(tokenAmount)

    const approveOptions = {
      abi:LiquidityVaultAbi,
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
        handleDepositErrorDispatcher(error);
      }
    })

  }

  async function handleApproveSuccess(tx){
   await tx.wait(1)
    console.log("soemthing")
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
    console.log(userAddress)
    const balance = (await erc20TokenContract.balanceOf(userAddress))?.toString();
    const format = ethers.utils.formatEther(balance,18)
    console.log(format)
    setLpTokenBalance(balance)
  }

  // async function fetchTokenBalances() {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  //   let accounts = await provider.send("eth_requestAccounts", []);
  //   let account = accounts[0];
  //   provider.on('accountsChanged', function (accounts) {
  //       account = accounts[0];
  //       console.log(address); // Print new address
  //   });
  //   const signer = provider.getSigner();
  //   const balance = await signer.getBalance();
  //   const format = ethers.utils.formatEther(balance,18)
  //  console.log(format)
  // }

  
  // dispatch function
  async function handleSuccess() {
    console.log(tx)
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
      console.log(allowedLPTokens)
      updateUI();
      if(userAddress){
        fetchTokenBalances();
      }

    }
  }, [isWeb3Enabled, userAddress])


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

          <button onClick={depositLPTokens} className="bg-[url('/assets/images/valley-button.png')] font-['Nabana-bold'] w-40 h-16 bg-cover bg-no-repeat text-[#CF3810] p-2 ">Deposit</button>

          <button onClick={SendMeDemoLpFunc} className="bg-[url('/assets/images/valley-button.png')] font-['Nabana-bold'] w-40 h-16 bg-cover bg-no-repeat text-[#CF3810] p-2 ">DemoLps</button>
        </div>
      </div>
   </>
  )
}

export default LiquidityPool
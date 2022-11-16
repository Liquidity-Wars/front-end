import React, { useState, useEffect } from 'react'
import SendMeDemoLpsAbi from "../constants/SendMeDemoLps.json";
import LiquidityVaultAbi from '../constants/LiquidityVault.json'
import LiquidityWarsConfigAbi from '../constants/LiquidityWarsConfig.json'
import ERC20Abi from '../constants/ERC20.json';
import UniswapV2PairAbi from '../constants/UniswapV2Pair.json'
import { useMoralis, useWeb3Contract, useERC20Balances   } from "react-moralis"
import Selector from "../components/Misc/Selector";
import { useNotification } from "web3uikit";
import { ethers } from "ethers"
import { motion } from 'framer-motion';

const LiquidityPool = ({LiquidityVaultConfigAddress, LiquidityVaultAddress, SushiSwapAddress, allowedLPTokens, allowedLPAddresses, SendMeDemoLpsAddress, userAddress, gameState}) => {

  const [ tokenAmount, setTokenAmount] = useState(null);
  const [ requiredAmount, setRequiredAmount] = useState(null);
  const [ demoLps , setDemoLps] = useState();
  const { isWeb3Enabled, isInitialized  } = useMoralis();
  const [ lpTokenBalance, setLpTokenBalance] = useState();
  const [ approvedAmount, setApprovedAmount ] = useState(0);
  const [ selected, setSelected ] = useState(null);
  const { runContractFunction } = useWeb3Contract();
  const dispatch = useNotification();

  const { runContractFunction: depositLpToken } = useWeb3Contract({
    abi: LiquidityVaultAbi,
    contractAddress: LiquidityVaultAddress,
    functionName: "depositLpToken",
    params:{
      _amount: requiredAmount,
      _tokenAddress: selected?.address
    }
  })

  const { runContractFunction: approveLpToken } = useWeb3Contract({
    abi: ERC20Abi,
    contractAddress: selected?.address,
    functionName: "approve",
    params:{
      spender: LiquidityVaultAddress,
      amount: lpTokenBalance //requiredAmount
    }
  })

  const { runContractFunction: getUsdRequiredAmount } = useWeb3Contract({
    abi: LiquidityWarsConfigAbi,
    contractAddress: LiquidityVaultConfigAddress,
    functionName: "getUsdRequiredAmount",
    params:{}
  })

  const { runContractFunction: getAmountOfLpTokensRequired } = useWeb3Contract({
    abi: LiquidityWarsConfigAbi,
    contractAddress: LiquidityVaultConfigAddress,
    functionName: "getAmountOfLpTokensRequired",
    params:{
      _tokenAddress: selected?.address,
    }
  })

  const { runContractFunction: getGameDuration } = useWeb3Contract({
    abi: LiquidityVaultAbi,
    contractAddress: LiquidityVaultAddress,
    functionName: "getGameDuration",
    params:{}
  })

  async function getRequiredAmountOfLpTokens(){
    //const depositedLpTokens = await depositLpToken();
    // const usdAmount = (await getUsdRequiredAmount())?.toString();
    const amountOfLpTokensRequired = await getAmountOfLpTokensRequired()
    // console.log("usdAmount:", usdAmount)
    console.log("amountOfLpTokensRequired:", amountOfLpTokensRequired)
    setRequiredAmount(amountOfLpTokensRequired);
  }

  async function approveLpTokenFunc(event){
    event.preventDefault();
    if(!selected){
      dispatch({
        type: "error",
        message: "LP Token not selected",
        title: `You have to select one of the approved LP Tokens`,
        position: "topR",
      });

      return;
    }
    if(requiredAmount
        && lpTokenBalance
        && lpTokenBalance.gte(requiredAmount)){
        const approval = await approveLpToken()
        if(approval) {
          setApprovedAmount(requiredAmount)
        } else {
          handleErrorDispatcher()
        }
    } else {
      dispatch({
        type: "error",
        message: "Not enough LP Tokens in wallet",
        title: `You have to deposit the required amount: ${requiredAmount}`,
        position: "topR",
      });
    }
  }

  async function depositLPTokens(event){
    event.preventDefault();
    const approveOptions = {
      abi:LiquidityVaultAbi,
      contractAddress: LiquidityVaultAddress,
      functionName: "depositLpToken",
      params: {
        _tokenAddress: selected?.address,
        _amount: requiredAmount
      }
    }
    await runContractFunction({
      params: approveOptions,
      onSuccess: handleSuccessForDepositAndApprove(),
      onError:(error) =>{
        handleDepositErrorDispatcher(error);
      }
    })

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
      onSuccess: () => handleSuccess(),
      onError: () => handleErrorDispatcher()
    })
  }

  const fetchTokenBalances = async () => {
    console.log("userAddress:", userAddress);
    console.log("allowedLPAddresses:", allowedLPAddresses);
    if(userAddress && allowedLPAddresses.length > 0){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const erc20TokenContract = new ethers.Contract(allowedLPAddresses[0], UniswapV2PairAbi, provider);
      const balance = await erc20TokenContract.balanceOf(userAddress)
      setLpTokenBalance(balance);
    }
  }

  const formatEther = (value) => {
    if (value) {
      return parseFloat(ethers.utils.formatEther(value)).toFixed(5);
    } else {
      return 0;
    }   
  }

  async function handleSuccess() {
    dispatch({
      type: "success",
      message: "Lp Tokens Transferred successfully",
      title: "Lp Tokens",
      position: "topR",
    });
  }

  async function handleSuccessForDepositAndApprove() {
    dispatch({
      type: "success",
      message: "Lp Tokens Approved & Deposit Success!",
      title: "Lp Tokens",
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
    if(gameState == 1 ){
      dispatch({
        type: "error",
        message: `Game is Already Started! You cant Join Or Deposit Now`,
        title: "Failed Transaction",
        position: "topR",
      });
    } else if (gameState == 0) {
      dispatch({
        type: "error",
        message: `Deposit Lp token failed Amount of Lp token deposited ${tokenAmount}`,
        title: "Failed Transaction",
        position: "topR",
      });
    }
  }
  
  useEffect(() =>{
    if(isWeb3Enabled && selected){
      getRequiredAmountOfLpTokens();
      fetchTokenBalances();
    }
  }, [isWeb3Enabled, userAddress, selected])

  return (
   <>
      <motion.div 
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        className="bg-[url('/assets/images/frame.png')] p-4 shadow-sm rounded-lg bg-cover bg-no-repeat justify-center items-center w-[60%]">

        <div className='px-4 py-4' >
          <div>
            <label className="block mb-2  font-['Nabana-bold'] text-3xl text-[#CF3810] font-medium">Deposit</label>
            <div className="flex flex-row w-full justify-between">
            <input type='text' id="deposit" readonly="readonly" value={formatEther(requiredAmount)} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
            <Selector 
              allowedLPTokens={allowedLPTokens}
              allowedLPAddresses={allowedLPAddresses}
              setSelected={setSelected}
              selected={selected}
            />
            </div>
            {requiredAmount && (<div className='text-[#CF3810] text-sm font py-1'>You need {formatEther(requiredAmount)} LP Tokens to join the game</div>)}
            {lpTokenBalance && (<div className='text-sm font py-1'>You currently have {formatEther(lpTokenBalance)} LP Tokens</div>)}
          </div>
          {approvedAmount == 0 ?

          (
            <motion.button 
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.5 },
              }}
              onClick={approveLpTokenFunc} className="bg-[url('/assets/images/valley-button.png')] font-['Nabana-bold'] w-40 h-16 bg-cover bg-no-repeat text-[#CF3810] p-2 ">Approve</motion.button>
          ) : (
            <motion.button 
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.5  },
              }}
              onClick={depositLPTokens} className="bg-[url('/assets/images/valley-button.png')] font-['Nabana-bold'] w-40 h-16 bg-cover bg-no-repeat text-[#CF3810] p-2 ">Deposit</motion.button>
          )
          }
          <motion.button 
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.5  },
            }}
            onClick={SendMeDemoLpFunc} className="bg-[url('/assets/images/valley-button.png')] font-['Nabana-bold'] w-40 h-16 bg-cover bg-no-repeat text-[#CF3810] p-2 ">LP Tokens Faucet</motion.button>

        </div>
      </motion.div>
   </>
  )
}

export default LiquidityPool
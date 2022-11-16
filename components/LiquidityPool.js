import React, { useState, useEffect } from 'react'
import SendMeDemoLpsAbi from "../constants/SendMeDemoLps.json";
import LiquidityVaultAbi from '../constants/LiquidityVault.json'
import LiquidityWarsConfigAbi from '../constants/LiquidityWarsConfig.json'
import UniswapV2PairAbi from '../constants/UniswapV2Pair.json'
import { useMoralis, useWeb3Contract } from "react-moralis"
import Selector from "../components/Misc/Selector";
import { useNotification } from "web3uikit";
import { ethers } from "ethers"
import { motion } from 'framer-motion';

const LiquidityPool = ({LiquidityVaultConfigAddress, LiquidityVaultAddress, SendMeDemoLpsAddress, allowedLPTokens, allowedLPAddresses, gameState, onSucess}) => {

  const [ tokenAmount, setTokenAmount] = useState(null);
  const [ requiredAmount, setRequiredAmount] = useState(null);
  const { isWeb3Enabled, account, isInitialized  } = useMoralis();
  const [ lpTokenBalance, setLpTokenBalance] = useState();
  const [ lpTokenContract, setLpTokenContract] = useState();
  const [ vaultContract, setVaultContract] = useState();
  const [ approvedAmount, setApprovedAmount ] = useState(0);
  const [ isApproving, setIsApproving ] = useState(false);
  const [ selected, setSelected ] = useState(null);
  const { runContractFunction } = useWeb3Contract();
  const dispatch = useNotification();

  const { runContractFunction: getAmountOfLpTokensRequired } = useWeb3Contract({
    abi: LiquidityWarsConfigAbi,
    contractAddress: LiquidityVaultConfigAddress,
    functionName: "getAmountOfLpTokensRequired",
    params:{
      _tokenAddress: selected?.address,
    }
  })

  async function getRequiredAmountOfLpTokens(){
    const amountOfLpTokensRequired = await getAmountOfLpTokensRequired();
    console.log("amountOfLpTokensRequired:", formatEther(amountOfLpTokensRequired));
    const safetyFactorNum = ethers.utils.parseEther(String(1e17));
    const safetyFactorDen = ethers.utils.parseEther(String(1e18));
    const safetyAmount = amountOfLpTokensRequired.mul(safetyFactorNum).div(safetyFactorDen); //10% safety factor
    const requiredAmountSafety = amountOfLpTokensRequired.add(safetyAmount);
    console.log("amountOfLpTokensRequired+safetyAmount:", formatEther(requiredAmountSafety));
    setRequiredAmount(requiredAmountSafety);
  }

  async function approveLpToken(){
    if (isApproving) {
      return;
    }
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
        try {
          setIsApproving(true);
          const txn = await lpTokenContract.approve(LiquidityVaultAddress, lpTokenBalance);
        } catch (error) {
          setIsApproving(false);
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

  async function depositLPTokens(){
    if (isApproving) {
      return;
    }
    try {
      setIsApproving(true);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const liquidityVaultContract = new ethers.Contract(LiquidityVaultAddress, LiquidityVaultAbi, provider.getSigner());
      setVaultContract(liquidityVaultContract);
      const txn = await liquidityVaultContract.depositLpToken(selected?.address, requiredAmount);
    } catch (error) {
      setIsApproving(false);
      handleDepositErrorDispatcher(error.reason);
    }
  }

  const sendMeDemoLp = async () =>{
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const lpDemoContract = new ethers.Contract(SendMeDemoLpsAddress, SendMeDemoLpsAbi, provider.getSigner());
      const txn = await lpDemoContract.sendMeDemoLps();
      await txn.wait();
      dispatch({
        type: "success",
        message: "Lp Tokens transferred successfully",
        title: "Lp Tokens",
        position: "topR",
      });
    } catch (error) {
      dispatch({
        type: "error",
        message: error.reason,
        title: "Failed Transaction",
        position: "topR",
      });
    }
  }

  const fetchTokenBalances = async () => {
    console.log("account:", account);
    console.log("selected.address:", selected?.address);
    if(account && selected){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const erc20TokenContract = new ethers.Contract(selected.address, UniswapV2PairAbi, provider.getSigner());
      const balance = await erc20TokenContract.balanceOf(account);
      setLpTokenBalance(balance);
      setLpTokenContract(erc20TokenContract);
    }
  }

  const formatEther = (value) => {
    if (value) {
      return parseFloat(ethers.utils.formatEther(value)).toFixed(5);
    } else {
      return 0;
    }   
  }

  async function handleDepositErrorDispatcher(error) {
    if(gameState == 1 ){
      dispatch({
        type: "error",
        message: `Game has already started! You cannot deposit at this moment`,
        title: "Failed Transaction",
        position: "topR",
      });
    } else if (gameState == 0) {
      dispatch({
        type: "error",
        message: `LP Token deposit failed: ${error}`,
        title: "Failed Transaction",
        position: "topR",
      });
    }
  }
  
  useEffect(() => {
    if(isWeb3Enabled && selected){
      getRequiredAmountOfLpTokens();
      fetchTokenBalances();
    }
  }, [isWeb3Enabled, account, selected])

  useEffect(() => {

    const onApproval = (owner, spender, value) => {
      console.log(`Approval event arrived, owner: ${owner}, spender: ${spender}, value: ${value}`);
      setApprovedAmount(value);
      setIsApproving(false);
      dispatch({
        type: "success",
        message: "Lp Token spent approved successfully!",
        title: "Lp Tokens",
        position: "topR",
      });
      
    };

    if (lpTokenContract) {
      lpTokenContract.on('Approval', onApproval);
    }

    return () => {
      if (lpTokenContract) {
        lpTokenContract.off('Approval', onApproval);
      }
    }
  }, [lpTokenContract])

  useEffect(() => {

    const onDepositDone = () => {
      console.log(`Deposit event arrived`);
      dispatch({
        type: "success",
        message: "Lp Tokens deposited successfully!",
        title: "Lp Tokens",
        position: "topR",
      });
      onSucess();
    };

    if (vaultContract) {
      vaultContract.on('DepositDone', onDepositDone);
    }

    return () => {
      if (vaultContract) {
        vaultContract.off('DepositDone', onDepositDone);
      }
    }
  }, [vaultContract])

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
            <input type='text' id="deposit" readOnly value={formatEther(requiredAmount)} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'/>
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
              onClick={approveLpToken} className="bg-[url('/assets/images/valley-button.png')] font-['Nabana-bold'] w-40 h-16 bg-cover bg-no-repeat text-[#CF3810] p-2 ">{isApproving ? "Approving..." : "Approve + Deposit"}</motion.button>
          ) : (
            <motion.button 
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.5  },
              }}
              onClick={depositLPTokens} className="bg-[url('/assets/images/valley-button.png')] font-['Nabana-bold'] w-40 h-16 bg-cover bg-no-repeat text-[#CF3810] p-2 ">{isApproving ? "Depositing..." : "Deposit"}</motion.button>
          )
          }
          <motion.button 
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.5  },
            }}
            onClick={sendMeDemoLp} className="bg-[url('/assets/images/valley-button.png')] font-['Nabana-bold'] w-40 h-16 bg-cover bg-no-repeat text-[#CF3810] p-2 ">LP Tokens Faucet</motion.button>

        </div>
      </motion.div>
   </>
  )
}

export default LiquidityPool
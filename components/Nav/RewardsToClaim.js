import React from 'react'
import { useMoralis, useWeb3Contract } from "react-moralis";
import StrategiesAbi from "../../constants/Strategies.json";
import { useState, useEffect } from "react";
import networkMapping from "../../constants/networkMapping.json";

const RewardsToClaim = () => {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const StrategiesAddress =
        chainId in networkMapping
          ? networkMapping[chainId]["Strategies"][0]
          : null;
    const [currentRewards, setCurrentRewards] = useState();

    const { runContractFunction: getCurrentRewards } = useWeb3Contract({
        abi: StrategiesAbi,
        contractAddress: StrategiesAddress,
        functionName: "getCurrentRewards",
        params: { _option: 0, _protocolAddress: 0, _lpTokenAddress: process.env.NEXT_PUBLIC_MORALIS_APP_ID },
    });

    async function updateCurrentRewards() {
        const getPlayerResource = await getCurrentRewards();
        setCurrentRewards(getPlayerResource)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateCurrentRewards();
        }
      }, [isWeb3Enabled]);

  return (
    <li className="text-white block py-2 pr-4 pl-3 rounded">
        <div className="flex items-center justify-center">
            <img
            src="/assets/images/rewards_icon.png"
            className="h-[40px] mr-1 p-0"
            alt="rewards icon"
            />
            <div>Rewards to Claim: {currentRewards}</div>
        </div>
    </li>
  )
}

export default RewardsToClaim
import React from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import StrategiesAbi from "../../constants/Strategies.json";
import LiquidityWarsAbi from "../../constants/LiquidityWars.json";
import { useState, useEffect } from "react";
import networkMapping from "../../constants/networkMapping.json";
import { BigNumber } from "ethers";

const RewardsToClaim = () => {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const StrategiesAddress =
    chainId in networkMapping ? networkMapping[chainId]["Strategies"][0] : null;
  const LiquidityWarsAddress =
    chainId in networkMapping
      ? networkMapping[chainId]["LiquidityWars"][0]
      : null;
  const [currentRewards, setCurrentRewards] = useState();
  const [ratioOfRewards, setRatioOfRewards] = useState();
  const [playerRewards, setPlayerRewards] = useState(0);

  const { runContractFunction: getCurrentRewards } = useWeb3Contract({
    abi: StrategiesAbi,
    contractAddress: StrategiesAddress,
    functionName: "getCurrentRewards",
    params: {
      _option: 0,
      _protocolAddress: "0x18a2470a7a8CdA7691Bb3a304b880Da720053A3e",
      _lpTokenAddress: "0x18a2470a7a8CdA7691Bb3a304b880Da720053A3e",
    },
  });

  const { runContractFunction: getRatioOfResources } = useWeb3Contract({
    abi: LiquidityWarsAbi,
    contractAddress: LiquidityWarsAddress,
    functionName: "getRatioOfResources",
    params: { _playerAddress: account },
  });

  async function updateCurrentRewards() {
    const getPlayerResource = Number((await getCurrentRewards())?.toString());
    const getRatioOfRewards = await getRatioOfResources().then((b) => {
      return b.toNumber();
    });
    setCurrentRewards(getPlayerResource);
    console.log(`current rewards are ${currentRewards}`);
    getRatioOfRewards = getRatioOfRewards / 10 ** 10;
    setRatioOfRewards(getRatioOfRewards);
    console.log(ratioOfRewards);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateCurrentRewards();
      setPlayerRewards(parseInt(ratioOfRewards * currentRewards));
    }
  }, [isWeb3Enabled]);

  return (
    <li className="text-white block py-2">
      <div className="flex items-center justify-center">
        <img
          src="/assets/images/rewards_icon.png"
          className="h-[40px] mr-1 p-0"
          alt="rewards icon"
        />
        <div>Rewards to Claim: {playerRewards}</div>
      </div>
    </li>
  );
};

export default RewardsToClaim;

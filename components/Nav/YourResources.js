import React from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import LiquidityWarsAbi from "../../constants/LiquidityWars.json";
import { useState, useEffect } from "react";
import networkMapping from "../../constants/networkMapping.json";

const YourResources = () => {
  const [playerResources, setPlayerResources] = useState(0);
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const LiquidityWarsAddress =
    chainId in networkMapping
      ? networkMapping[chainId]["LiquidityWars"][0]
      : null;

  const { runContractFunction: getPlayerResources } = useWeb3Contract({
    abi: LiquidityWarsAbi,
    contractAddress: LiquidityWarsAddress,
    functionName: "getPlayerResources",
    params: { _playerAddress: account },
  });

  async function updatePlayerResources() {
    const getPlayerResource = (await getPlayerResources())?.toString();
    setPlayerResources(getPlayerResource);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updatePlayerResources();
    }
  }, [isWeb3Enabled]);

  return (
    <li className="text-white block py-2 pr-4 pl-3 rounded">
      <div className="flex items-center justify-center">
        <img
          src="/assets/images/resources_icon.png"
          className="h-[30px] mr-2 p-0"
          alt="resources icon"
        />
        <div>Your Resources: {playerResources}</div>
      </div>
    </li>
  );
};

export default YourResources;

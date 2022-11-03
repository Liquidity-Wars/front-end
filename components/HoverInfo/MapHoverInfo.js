import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import LiquidityVault from "../../constants/LiquidityVault.json";
import networkMapping from "../../constants/networkMapping.json";
import LiquidityWars from "../../constants/LiquidityWars.json";

export default function MapHoverInfo() {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const [playerResources, setPlayerResources] = useState(0);

  const chainId = parseInt(chainIdHex);
  const LiquidityWarsAddress =
    chainId in networkMapping
      ? networkMapping[chainId]["LiquidityWars"][0]
      : null;
  // get upgradeBuilding function
  const { runContractFunction: getPlayerResources } = useWeb3Contract({
    abi: LiquidityWars,
    contractAddress: LiquidityWarsAddress,
    functionName: "getPlayerResources",
    params: {},
  });

  async function updateUI() {
    // const getPlayerResource = await getPlayerResources();
    // setCurrentBuildingLevel(getPlayerResource);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div className="absolute flex flex-col items-center justify-center translate-x-[-30px] w-[200px] h-[200px] bg-center bg-cover bg-[url('/assets/images/timer_frame.png')]">
      <div>Number of Troops: </div>
    </div>
  );
}

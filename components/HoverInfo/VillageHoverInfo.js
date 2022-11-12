import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import LiquidityVault from "../../constants/LiquidityVault.json";
import networkMapping from "../../constants/networkMapping.json";
import LiquidityWars from "../../constants/LiquidityWars.json";

export default function VillageHoverInfo() {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const [troopNumber, setTroopNumber] = useState(0);
  const [villageSize, setVillageSize] = useState(0);

  const chainId = parseInt(chainIdHex);
  const LiquidityWarsAddress =
    chainId in networkMapping
      ? networkMapping[chainId]["LiquidityWars"][0]
      : null;
  // get troop numbers
  const { runContractFunction: getNumberOfTroops } = useWeb3Contract({
    abi: LiquidityWars,
    contractAddress: LiquidityWarsAddress,
    functionName: "getNumberOfTroops",
    params: {},
  });
  // get villageSize
  const { runContractFunction: getVillageSize } = useWeb3Contract({
    abi: LiquidityWars,
    contractAddress: LiquidityWarsAddress,
    functionName: "getVillageSize",
    params: { _playerAddress: account },
  });

  async function updateUI() {
    const getTroopNumber = (await getNumberOfTroops()).toString();
    setTroopNumber(getTroopNumber);
    const getVillageSizes = await getVillageSize();
    setVillageSize(getVillageSizes.toString());
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div className="absolute flex flex-col items-center justify-center translate-x-[-30px] w-[200px] h-[200px] bg-center bg-cover bg-[url('/assets/images/timer_frame.png')]">
      <div>Number of Troops: {troopNumber}</div>
      <div>Village Size: {villageSize}</div>
    </div>
  );
}

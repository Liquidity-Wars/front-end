import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import LiquidityVault from "../../constants/LiquidityVault.json";
import networkMapping from "../../constants/networkMapping.json";
import LiquidityWars from "../../constants/LiquidityWars.json";

export default function TrainTroops() {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const [troopAttributes, setTroopAttributes] = useState();
  const [costToTrainTroops, setCostToTrainTroops] = useState();
  const [numberToTrain, setNumberToTrain] = useState(0);

  const chainId = parseInt(chainIdHex);
  const LiquidityWarsAddress =
    chainId in networkMapping
      ? networkMapping[chainId]["LiquidityWars"][0]
      : null;

  // get Troop Attributes
  const { runContractFunction: getTroopAttributes } = useWeb3Contract({
    abi: LiquidityWars,
    contractAddress: LiquidityWarsAddress,
    functionName: "getTroopAttributes",
    params: { _playerAddress: account },
  });

  // get Cost Of Training Troops
  const { runContractFunction: getTotalCostOfTroop } = useWeb3Contract({
    abi: LiquidityWars,
    contractAddress: LiquidityWarsAddress,
    functionName: "getTotalCostOfTroop",
    params: { _playerAddress: account },
  });

  // get Cost Of Training Troops
  const { runContractFunction: trainTroops } = useWeb3Contract({
    abi: LiquidityWars,
    contractAddress: LiquidityWarsAddress,
    functionName: "trainTroops",
    params: { _numberOfTroops: numberToTrain },
  });

  async function updateUI() {
    const getTroopAttribute = await getTroopAttributes();
    setTroopAttributes(getTroopAttribute);
    const getCostToTrainTroops = await getTotalCostOfTroop();
    setCostToTrainTroops(getCostToTrainTroops);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-700 text-center mb-3">
        Troop Stats
      </h1>
      <div>
        Number: {troopAttributes.number} Health: {troopAttributes.health}{" "}
        Capacity: {troopAttributes.capacity} Speed: {troopAttributes.speed}{" "}
        Defense: {troopAttributes.defense} Attack: {troopAttributes.attack}
      </div>
      <div>Cost to Train Troops: {costToTrainTroops}</div>
      <button>Train Troops</button>
    </div>
  );
}

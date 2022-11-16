import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import LiquidityVault from "../../constants/LiquidityVault.json";
import networkMapping from "../../constants/networkMapping.json";
import LiquidityWars from "../../constants/LiquidityWars.json";
import { useNotification } from "web3uikit";

export default function TrainTroops() {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const [troopAttributes, setTroopAttributes] = useState();
  const [costToTrainTroops, setCostToTrainTroops] = useState();
  const dispatch = useNotification();
  const [numberToTrain, setNumberToTrain] = useState(0);

  const chainId = parseInt(chainIdHex);
  const LiquidityWarsAddress =
    chainId in networkMapping
      ? networkMapping[chainId]["LiquidityWars"][0]
      : null;

  const { runContractFunction } = useWeb3Contract();

  // handle train troops success
  async function handleTrainTroopsSuccess() {
    dispatch({
      type: "success",
      message: `${numberToTrain} Troops Trained! Please refresh and wait to see changes`,
      title: "Troops Trained",
      position: "topR",
    });
  }
  async function handleTrainTroopsError(error) {
    dispatch({
      type: "error",
      message: `${error.message}`,
      title: "Failed to train troops",
      position: "topR",
    });
  }

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

  // submit train <user input> number of troops
  async function handleTrainTroops(numberToTrain) {
    const trainTroopsParams = {
      abi: LiquidityWars,
      contractAddress: LiquidityWarsAddress,
      functionName: "trainTroops",
      params: { _numberOfTroops: numberToTrain },
    };

    await runContractFunction({
      params: trainTroopsParams,
      onSuccess: () => handleTrainTroopsSuccess(),
      onError: (error) => handleTrainTroopsError(error),
    });
  }

  async function updateUI() {
    const getTroopAttribute = await getTroopAttributes();
    setTroopAttributes(getTroopAttribute);
    console.log(troopAttributes);
    const getCostToTrainTroops = await getTotalCostOfTroop();
    setCostToTrainTroops(getCostToTrainTroops.toNumber());
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleTrainTroops(numberToTrain);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-xl font-bold text-gray-700 text-center mt-3 underline">
        Troop Stats
      </h1>
      <div className="text-xs m-auto w-[300px] flex items-center justify-center">
        <div>Number: {Number(troopAttributes?.number)}</div>
        <div>Health: {troopAttributes?.health}</div>
        <div>Capacity: {troopAttributes?.capacity}</div>
        <div>Speed: {troopAttributes?.speed}</div>
        <div>Defense: {troopAttributes?.defense}</div>
        <div>Attack: {troopAttributes?.attack}</div>
      </div>
      <div className="text-sm mt-2 mb-1 flex">
        <img
          src="/assets/images/upgrade_cost.png"
          className="h-[20px] mr-[2px] p-0"
          alt="cost to upgrade icon"
        />
        <div className="font-semibold">
          Cost to Train Troops:{" "}
          <span className="font-normal">
            {costToTrainTroops * numberToTrain}
          </span>
        </div>
      </div>
      <input
        name="Train Troops"
        type="number"
        className="w-2/3 p-1"
        placeholder="Input Number to Train"
        value={numberToTrain}
        onChange={(event) => setNumberToTrain(event.target.value)}
      />
      <button
        type="submit"
        className="btn btn-primary text-white font-semibold w-1/3 p-1 bg-[rgb(5,57,76)]"
      >
        Train Troops
      </button>
    </form>
  );
}

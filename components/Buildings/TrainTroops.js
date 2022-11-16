import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import LiquidityVault from "../../constants/LiquidityVault.json";
import networkMapping from "../../constants/networkMapping.json";
import LiquidityWars from "../../constants/LiquidityWars.json";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";

export default function TrainTroops() {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const [troopAttributes, setTroopAttributes] = useState();
  const [costToTrainTroops, setCostToTrainTroops] = useState();
  const dispatch = useNotification();
  const [numberToTrain, setNumberToTrain] = useState(0);
  const [warsContract, setWarsContract] = useState();
  const [isTraining, setIsTraining] = useState();


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
    if (isTraining) {
      return;
    }
    try {
      setIsTraining(true);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const liquidityWarsContract = new ethers.Contract(LiquidityWarsAddress, LiquidityWars, provider.getSigner());
      setWarsContract(liquidityWarsContract); //for the future, when we have a TroopTrained event in the Smart Contract
      const txn = await liquidityWarsContract.trainTroops(numberToTrain);
      await txn.wait();
      dispatch({
        type: "success",
        message: `${numberToTrain} Troops Trained successfully!`,
        title: "Troops Trained",
        position: "topR",
      });
      setIsTraining(false);
    } catch (error) {
      setIsTraining(false);
      dispatch({
        type: "error",
        message: error.reason,
        title: "Failed to train troops",
        position: "topR",
      });

    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-xl font-bold text-gray-700 text-center mt-3 underline">
        Troop Stats
      </h1>
      <div className="text-xs m-auto w-full flex items-center text-center">
        <div className="pr-1.5"><b>Number</b><br/>{Number(troopAttributes?.number)}</div>
        <div className="pr-1.5"><b>Health</b><br/>{troopAttributes?.health}</div>
        <div className="pr-1.5"><b>Capacity</b><br/>{troopAttributes?.capacity}</div>
        <div className="pr-1.5"><b>Speed</b><br/>{troopAttributes?.speed}</div>
        <div className="pr-1.5"><b>Defense</b><br/>{troopAttributes?.defense}</div>
        <div><b>Attack</b><br/>{troopAttributes?.attack}</div>
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
        className="w-1/2 p-1 mt-1.5"
        placeholder="Input Number to Train"
        value={numberToTrain}
        onChange={(event) => setNumberToTrain(event.target.value)}
      />
      <button
        type="submit"
        className="btn btn-primary text-white font-semibold w-1/2 p-1 bg-[rgb(5,57,76)]"
      >
        {isTraining ? "Training..." : "Train Troops"}
      </button>
    </form>
  );
}

import { useEffect, useState } from "react";
import LiquidityVault from "../../constants/LiquidityVault.json";
import networkMapping from "../../constants/networkMapping.json";
import LiquidityWars from "../../constants/LiquidityWars.json";
import LiquidityWarsConfig from "../../constants/LiquidityWarsConfig.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import TrainTroops from "./TrainTroops";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";

export default function UpgradeBuilding({
  handleClose,
  buildingType,
  infrastructureNumber,
}) {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const [currentBuildingLevel, setCurrentBuildingLevel] = useState(0);
  const [costOfUpgrade, setCostOfUpgrade] = useState(0);
  const [buildingAbility, setBuildingAbility] = useState(0);
  const [bonus, setBonus] = useState(0);
  const dispatch = useNotification();

  const { runContractFunction } = useWeb3Contract();

  const chainId = parseInt(chainIdHex);
  const LiquidityWarsAddress =
    chainId in networkMapping
      ? networkMapping[chainId]["LiquidityWars"][0]
      : null;

  const LiquidityWarsConfigAddress =
    chainId in networkMapping
      ? networkMapping[chainId]["LiquidityWarsConfig"][0]
      : null;

  // handle upgrade building success
  async function handleUpgradeSuccess(buildingType) {
    dispatch({
      type: "success",
      message: "Builing upgraded successfully!",
      title: `${buildingType} Upgrade`,
      position: "topR",
    });
  }

  // handle upgrade building error
  async function handleUpgradeError(buildingType) {
    dispatch({
      type: "error",
      message: "Not enough resources to upgrade building",
      title: `Failed to upgrade ${buildingType}`,
      position: "topR",
    });
  }

  // get currentBuildingLevel
  const { runContractFunction: getCurrentBuildingLevel } = useWeb3Contract({
    abi: LiquidityWars,
    contractAddress: LiquidityWarsAddress,
    functionName: "getCurrentBuildingLevel",
    params: { _building: infrastructureNumber },
  });

  // get costOfUpgrade
  const { runContractFunction: getCostOfUpgrade } = useWeb3Contract({
    abi: LiquidityWars,
    contractAddress: LiquidityWarsAddress,
    functionName: "getCostOfUpgrade",
    params: { _level: currentBuildingLevel },
  });

  // get currentAbility
  const { runContractFunction: getBuildingAbility } = useWeb3Contract({
    abi: LiquidityWars,
    contractAddress: LiquidityWarsAddress,
    functionName: "getBuildingAbility",
    params: { _level: currentBuildingLevel, _building: infrastructureNumber },
  });

  // get buildingParam for bonuses
  const { runContractFunction: getBuildingParam } = useWeb3Contract({
    abi: LiquidityWarsConfig,
    contractAddress: LiquidityWarsConfigAddress,
    functionName: "getBuildingParam",
    params: { _id: infrastructureNumber },
  });

  // upgrade building function
  async function handleUpgradeBuilding() {
    const buildingParams = {
      abi: LiquidityWars,
      contractAddress: LiquidityWarsAddress,
      functionName: "upgradeBuilding",
      params: { _building: infrastructureNumber },
    };

    await runContractFunction({
      params: buildingParams,
      onSuccess: () => handleUpgradeSuccess(buildingParams.params._building),
      onError: () => handleUpgradeError(buildingParams.params._building),
    });
  }

  async function getBuildingParams() {
    const getBuildingParams = await getBuildingParam();
    console.log(getBuildingParams.toString());
    setBonus(getBuildingParams?.bonus ? getBuildingParams.bonus.toNumber() : 0);
    console.log(typeof bonus);
  }

  async function updateUI() {
    const getBuildingLevel = (await getCurrentBuildingLevel())?.toString();
    setCurrentBuildingLevel(getBuildingLevel);
    const getUpgradeCost = (await getCostOfUpgrade())?.toString();
    setCostOfUpgrade(getUpgradeCost);
    const getCurrentAbility = (await getBuildingAbility())?.toString();
    setBuildingAbility(getCurrentAbility);
    console.log(getBuildingLevel);
    console.log(getCurrentAbility);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [buildingType, currentBuildingLevel]);

  useEffect(() => {
    if (isWeb3Enabled) {
      getBuildingParams();
    }
  }, [buildingType]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full rounded-md bg-cover bg-[url('/assets/images/Web3Frame.png')]">
      <button
        onClick={handleClose}
        className="absolute translate-x-[170px] translate-y-[-180px]"
      >
        <div className="text-red-500 font-semibold">Close</div>
      </button>
      <div className="p-6 flex flex-col items-center justify-between h-full">
        <div className="text-2xl font-bold text-gray-700 text-center ">
          {buildingType}
          <div className="text-sm font-bold text-gray-700">
            Level: {currentBuildingLevel}
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-700 text-center">
            Building Stats
          </h1>
          <div>Cost of Upgrade: {costOfUpgrade}</div>
          <div>Current Ability: {buildingAbility}</div>
          <div>
            Next Ability:{" "}
            {Number(buildingAbility) + Number(buildingAbility * bonus) / 100}
          </div>
          {buildingType == "BARRACK" && <TrainTroops />}
        </div>
        <button
          onClick={async () => {
            await handleUpgradeBuilding();
          }}
          className="btn btn-primary text-white p-3 font-semibold rounded-md bg-cover w-[130px] bg-[url('/assets/images/valley-button.png')]"
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}

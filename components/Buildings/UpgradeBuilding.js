import { useEffect, useState } from "react";
import LiquidityVault from "../../constants/LiquidityVault.json";
import networkMapping from "../../constants/networkMapping.json";
import LiquidityWars from "../../constants/LiquidityWars.json";
import LiquidityWarsConfig from "../../constants/LiquidityWarsConfig.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import TrainTroops from "./TrainTroops";
import { useNotification } from "web3uikit";

export default function UpgradeBuilding({ handleClose, buildingType }) {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const [currentBuildingLevel, setCurrentBuildingLevel] = useState(0);
  const [costOfUpgrade, setCostOfUpgrade] = useState(0);
  const [buildingAbility, setBuildingAbility] = useState(0);
  const [bonus, setBonus] = useState(0);
  const dispatch = useNotification();
  var infrastructureNumber;

  const { runContractFunction } = useWeb3Contract();

  switch (buildingType) {
    case "FARM":
      infrastructureNumber = 0;
      break;
    case "BARRACKS":
      infrastructureNumber = 1;
      break;
    case "HIDEAWAY":
      infrastructureNumber = 2;
      break;
    case "WALLS":
      infrastructureNumber = 3;
      break;
  }

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
    abi: LiquidityWars,
    contractAddress: LiquidityWarsConfigAddress,
    functionName: "getBuildingParam",
    params: { _id: infrastructureNumber },
  });

  // upgrade building function
  async function handleUpgradeBuilding(buildingType) {
    const buildingParams = {
      abi: LiquidityWars,
      contractAddress: LiquidityWarsAddress,
      functionName: "upgradeBuilding",
      params: { _building: buildingType },
    };

    await runContractFunction({
      params: buildingParams,
      onSuccess: () => handleUpgradeSuccess(buildingParams.params._building),
      onError: () => handleUpgradeError(buildingParams.params._building),
    });
  }

  async function updateUI() {
    const getBuildingLevel = await getCurrentBuildingLevel();
    setCurrentBuildingLevel(getBuildingLevel);
    const getUpgradeCost = await getCostOfUpgrade();
    setCostOfUpgrade(getUpgradeCost);
    const getCurrentAbility = await getBuildingAbility();
    setBuildingAbility(getCurrentAbility);
    const getBuildingParams = await getBuildingParam();
    setBonus(getBuildingParams?.bonus);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
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
            Next Ability: {buildingAbility + (buildingAbility * bonus) / 100}
          </div>
          {buildingType == "BARRACK" && <TrainTroops />}
        </div>
        <button
          onClick={async () => {
            await handleUpgradeBuilding(buildingType);
          }}
          className="btn btn-primary text-white p-3 font-semibold rounded-md bg-cover w-[130px] bg-[url('/assets/images/valley-button.png')]"
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}

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
  async function handleUpgradeSuccess() {
    dispatch({
      type: "success",
      message: "Builing upgraded successfully! Please refresh to see changes",
      title: `${buildingType} Upgraded`,
      position: "topR",
    });
  }

  // handle upgrade building error
  async function handleUpgradeError(error) {
    dispatch({
      type: "error",
      message: `${error.message}`,
      title: `Failed to upgrade`,
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
      onSuccess: () => handleUpgradeSuccess(),
      onError: (error) => handleUpgradeError(error),
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
      getBuildingParams();
    }
  }, [buildingType, currentBuildingLevel]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full rounded-md bg-cover bg-[url('/assets/images/Web3Frame.png')]">
      <button
        onClick={handleClose}
        className="absolute translate-x-[175px] translate-y-[-175px]"
      >
        <div className="text-red-500 font-semibold">
          <img
            src="/assets/images/closebutton.png"
            className="h-[30px] p-0"
            alt="close icon"
          />
        </div>
      </button>
      <div className="p-6 flex flex-col items-center justify-between h-full">
        <div className="text-2xl font-bold text-gray-700 text-center ">
          {buildingType}
          <div className="text-sm font-bold text-gray-700">
            Level: {currentBuildingLevel}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-gray-700 text-center underline">
            Building Stats
          </h1>
          <div className="flex flex-col font-semibold">
            <div className="flex items-center">
              <img
                src="/assets/images/upgrade_cost.png"
                className="h-[25px] ml-1 mr-[2px] p-0"
                alt="cost to upgrade icon"
              />
              <div>
                Cost of Upgrade:{" "}
                <span className="font-normal">{costOfUpgrade}</span>
              </div>
            </div>
            <div className="flex items-center font-semibold">
              <img
                src="/assets/images/building_ability.png"
                className="h-[25px] mr-1 p-0"
                alt="current ability icon"
              />
              <div>
                Current Ability:{" "}
                <span className="font-normal">{buildingAbility}</span>
              </div>
            </div>
            <div className="flex items-center font-semibold">
              <img
                src="/assets/images/next_ability.png"
                className="h-[20px] mr-1 ml-1 p-0"
                alt="next ability icon"
              />
              <div>
                Next Ability:{" "}
                <span className="font-normal">
                  {Number(buildingAbility) +
                    Number(buildingAbility * bonus) / 100}
                </span>
                <span className="font-normal text-lime-600">
                  {" (+"}
                  {Number(buildingAbility) +
                    Number(buildingAbility * bonus) / 100 -
                    buildingAbility}
                  {")"}
                </span>
              </div>
            </div>
          </div>

          {buildingType == "BARRACK" && <TrainTroops />}
        </div>
        <button
          onClick={async () => {
            await handleUpgradeBuilding();
          }}
          className="btn btn-primary flex items-center text-white p-3 font-semibold rounded-md bg-cover w-[130px] bg-[url('/assets/images/valley-button.png')]"
        >
          <img
            src="/assets/images/upgrade_building.png"
            className="h-[20px] mr-1 ml-1 p-0"
            alt="upgrade building icon"
          />
          <span className="text-slate-700 font-semibold">Upgrade</span>
        </button>
      </div>
    </div>
  );
}

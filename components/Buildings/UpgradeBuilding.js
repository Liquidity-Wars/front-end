import { useEffect, useState } from "react";
import LiquidityVault from "../../constants/LiquidityVault.json";
import networkMapping from "../../constants/networkMapping.json";
import LiquidityWars from "../../constants/LiquidityWars.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import TrainTroops from "./TrainTroops";

export default function UpgradeBuilding({ handleClose, buildingType }) {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const [currentBuildingLevel, setCurrentBuildingLevel] = useState(0);
  const [costOfUpgrade, setCostOfUpgrade] = useState(0);
  const [buildingAbility, setBuildingAbility] = useState(0);
  var infrastructureNumber;

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

  // get upgradeBuilding function
  const { runContractFunction: upgradeBuilding } = useWeb3Contract({
    abi: LiquidityWars,
    contractAddress: LiquidityWarsAddress,
    functionName: "upgradeBuilding",
    params: { _building: buildingType },
  });

  async function updateUI() {
    const getBuildingLevel = await getCurrentBuildingLevel();
    setCurrentBuildingLevel(getBuildingLevel);
    const getUpgradeCost = await getCostOfUpgrade();
    setCostOfUpgrade(getUpgradeCost);
    const getCurrentAbility = await getBuildingAbility();
    setBuildingAbility(getCurrentAbility);
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
      <div>
        <main className="p-4">
          <div className="text-2xl font-bold text-gray-700 text-center mb-8">
            {buildingType}
            <div className="text-sm font-bold text-gray-700">
              Level: {currentBuildingLevel}
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-700 text-center mb-3">
            Building Stats
          </h1>
          <div>Cost of Upgrade: {costOfUpgrade}</div>
          <div>Current Ability: {buildingAbility}</div>
          <div>Next Ability: </div>

          {buildingType == "BARRACK" && <TrainTroops />}
          <button
            onClick={async () => {
              await upgradeBuilding;
            }}
            className="m-auto btn btn-primary text-white p-3 rounded-md bg-cover w-[130px] bg-[url('/assets/images/valley-button.png')]"
          >
            Upgrade
          </button>
        </main>
      </div>
    </div>
  );
}

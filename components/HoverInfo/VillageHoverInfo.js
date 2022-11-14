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
    <div className="absolute flex flex-col justify-center translate-y-[-30px] translate-x-[70px] w-[150px] h-[150px] p-5 bg-center bg-cover bg-[url('/assets/images/timer_frame.png')]">
      <div className="flex mb-3">
        <img
          src="/assets/images/troop_size.png"
          className="h-[18px] mr-1 ml-0 p-0"
          alt="troop size logo"
        />
        <div className="text-xs font-semibold">
          Troops Number:
          <br />
          {troopNumber}
        </div>
      </div>
      <div className="flex">
        <img
          src="/assets/images/village_size.png"
          className="h-[20px] mr-0 p-0"
          alt="village size logo"
        />
        <div className="text-xs font-semibold">
          Village Size:
          <br />
          {villageSize}
        </div>
      </div>
    </div>
  );
}

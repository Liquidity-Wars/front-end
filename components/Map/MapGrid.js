import { useContext, useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import LiquidityVault from "../../constants/LiquidityVault.json";
import networkMapping from "../../constants/networkMapping.json";
import LiquidityWars from "../../constants/LiquidityWars.json";
import PlayerGrid from "./PlayerGrid";
import { PlayerContext } from "../../pages/map-page";

export default function MapGrid() {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const setPlayerId = useContext(PlayerContext);
  const chainId = parseInt(chainIdHex);
  const [numberOfPlayers, setNumberOfPlayers] = useState(3);
  const LiquidityVaultAddress =
    chainId in networkMapping
      ? networkMapping[chainId]["LiquidityVault"][0]
      : null;

  // get total number of players
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: LiquidityVault,
    contractAddress: LiquidityVaultAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  async function updateUI() {
    const getNumberOfPlayersInGame = await getNumberOfPlayers();
    setNumberOfPlayers(getNumberOfPlayersInGame);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const villages = [];
  for (let i = 0; i < numberOfPlayers; i++) {
    villages.push(<PlayerGrid playerId={i} setPlayerId={setPlayerId} />);
  }

  return (
    <div className="w-[320px] h-[320px] flex justify-center items-center">
      <div class="grid grid-rows-4 grid-cols-4 gap-2 m-auto items-center justify-center">
        {villages.map((village) => village)}
      </div>
    </div>
  );
}

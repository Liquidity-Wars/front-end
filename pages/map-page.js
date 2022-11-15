import { AnimatePresence } from "framer-motion";
import { createContext, useState, useEffect } from "react";
import MapHoverInfo from "../components/HoverInfo/MapHoverInfo";
import EnemyInfo from "../components/Map/EnemyInfo";
import MapGrid from "../components/Map/MapGrid";
import Modal from "../components/Map/Modal";
import MapNav from "../components/MapNav";
import styles from "../styles/Home.module.css";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useRouter } from "next/router";
import LiquidityWarsAbi from "../constants/LiquidityWars.json";
import LiquidityVaultAbi from "../constants/LiquidityVault.json";
import networkMapping from "../constants/networkMapping.json";
import { ethers } from "ethers";

export const PlayerContext = createContext();

export default function MapPage() {
  const router = useRouter();
  const [isPlayer, setIsPlayer] = useState("");
  const [playerId, setPlayerId] = useState();
  const [modalOpen, setModalOpen] = useState();
  const [gameState, setGameState] = useState();
  const [gameId, setGameId] = useState();
  const { account, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const contractAddresses =
    chainId in networkMapping ? networkMapping[chainId] : null;

  const { runContractFunction: getCurrentGameId } = useWeb3Contract({
    abi: LiquidityWarsAbi,
    contractAddress: contractAddresses
      ? contractAddresses["LiquidityWars"][0]
      : null,
    functionName: "getCurrentGameId",
  });

  const { runContractFunction: getPlayerInfo } = useWeb3Contract({
    abi: LiquidityVaultAbi,
    contractAddress: contractAddresses
      ? contractAddresses["LiquidityVault"][0]
      : null,
    functionName: "getPlayerInfo",
    params: {
      _playerAddress: account,
    },
  });

  const { runContractFunction: getGameState } = useWeb3Contract({
    abi: LiquidityVaultAbi,
    contractAddress: contractAddresses
      ? contractAddresses["LiquidityVault"][0]
      : null,
    functionName: "getGameState",
    params: {},
  });

  const close = () => setModalOpen(false);

  const open = () => {
    setModalOpen(true);
  };

  async function updateGameId() {
    const gameId = await getCurrentGameId();
    setGameId(gameId ? gameId.toString() : 0);
  }

  async function checkPlayer() {
    if (account) {
      // console.log("Checking if is player...");
      // console.log("account: ", account);
      const [tokenAddress, amount] = await getPlayerInfo();
      const amountParsed = parseFloat(ethers.utils.formatEther(amount));
      // console.log("amount:", amountParsed);
      const isPlayer = amountParsed > 0 ? "yes" : "no";
      // console.log("isPlayer:", isPlayer);
      setIsPlayer(isPlayer);
    }
  }

  async function getGameStateAsync() {
    const gameState = await getGameState();
    //console.log("village-map gameState:", gameState);
    setGameState(gameState);
  }

  useEffect(() => {
    // console.log("useEffect isPlayer: ", isPlayer);
    // console.log("useEffect account: ", account);
    checkPlayer();
    if ((account && isPlayer == "no") || gameState == 0) {
      router.push("/");
    }
  }, [isPlayer, gameState, account]);

  useEffect(() => {
    if (isWeb3Enabled) {
      updateGameId();
      checkPlayer();
      getGameStateAsync();
    }
  }, [isWeb3Enabled]);

  return (
    <PlayerContext.Provider value={setPlayerId}>
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-cover bg-[url('/assets/images/stardew-valley-img.jpg')]">
        <MapNav className="w-full" gameState={gameState} />
        <div className="flex justify-center items-center w-[850px] h-[520px] bg-[url('/assets/images/valley-canvas.png')] translate-x-[30px] bg-center bg-cover">
          <div className="flex mx-12 flex-col justify-center  w-[250px] h-[450px] truncate">
            {playerId !== undefined ? (
              <EnemyInfo playerId={playerId} />
            ) : (
              <div className="w-full text-center">
                Click on an enemy for info.
              </div>
            )}
          </div>
          <div className="flex items-center justify-center bg-cover rounded-md w-[450px] h-[450px] bg-[url('/assets/images/map_background.png')] bg-center">
            <MapGrid />
          </div>
          <button
            onClick={() => open()}
            className=" px-3 py-1 bg-slate-400 border-black border-2 rounded-full translate-y-[-230px] translate-x-6"
          >
            <img
              src="/assets/images/log_icon.png"
              className="h-[50px] mr-0 p-0"
              alt="log icon"
            />
          </button>
          <AnimatePresence
            initial={false}
            exitBeforeEnter={true}
            onExitComplete={() => null}
            className="absolute m-auto"
          >
            {modalOpen && <Modal gameId={gameId} handleClose={close} />}
          </AnimatePresence>
        </div>
      </div>
    </PlayerContext.Provider>
  );
}

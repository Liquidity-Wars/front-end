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
import networkMapping from "../constants/networkMapping.json";

export const PlayerContext = createContext();

export default function MapPage() {
  const router = useRouter();
  const [playerId, setPlayerId] = useState();
  const [modalOpen, setModalOpen] = useState();
  const [gameId, setGameId] = useState();
  const { account, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const LiquidityWarsAddress =
    chainId in networkMapping
      ? networkMapping[chainId]["LiquidityWars"][0]
      : null;

  const { runContractFunction: getCurrentGameId } = useWeb3Contract({
    abi: LiquidityWarsAbi,
    contractAddress: LiquidityWarsAddress,
    functionName: "getCurrentGameId",
  });

  const close = () => setModalOpen(false);

  const open = () => {
    setModalOpen(true);
  };

  async function updateGameId() {
    const gameId = await getCurrentGameId();
    setGameId(gameId);
  }

  useEffect(() => {
    if (!account) {
      router.push("/");
    }
  }, [account]);

  useEffect(() => {
    if (isWeb3Enabled) {
      updateGameId();
    }
  }, [isWeb3Enabled]);

  return (
    <PlayerContext.Provider value={setPlayerId}>
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-cover bg-[url('/assets/images/stardew-valley-img.jpg')]">
        <MapNav className="w-full" />
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

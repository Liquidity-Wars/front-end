import { AnimatePresence } from "framer-motion";
import { createContext, useState } from "react";
import MapHoverInfo from "../components/HoverInfo/MapHoverInfo";
import EnemyInfo from "../components/Map/EnemyInfo";
import MapGrid from "../components/Map/MapGrid";
import Modal from "../components/Map/Modal";
import MapNav from "../components/MapNav";
import styles from "../styles/Home.module.css";
export const PlayerContext = createContext();

export default function MapPage() {
  const [playerId, setPlayerId] = useState();
  const [modalOpen, setModalOpen] = useState();

  const close = () => setModalOpen(false);
  const open = () => {
    setModalOpen(true);
  };

  return (
    <PlayerContext.Provider value={setPlayerId}>
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-cover bg-[url('/assets/images/stardew-valley-img.jpg')]">
        <MapNav className="w-full" />
        <div className="flex justify-center items-center w-[850px] h-[520px] bg-[url('/assets/images/valley-canvas.png')] translate-x-[30px] bg-center bg-cover">
          <div className="flex mx-12 flex-col justify-center  w-[250px] h-[450px]">
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
            onClick={() => open("WALLS")}
            className="py-3 px-3 bg-yellow-400 border-black border-2 rounded-full translate-y-[-230px] translate-x-6"
          >
            Log
          </button>
          <AnimatePresence
            initial={false}
            exitBeforeEnter={true}
            onExitComplete={() => null}
            className="absolute m-auto"
          >
            {modalOpen && <Modal modalOpen={modalOpen} handleClose={close} />}
          </AnimatePresence>
        </div>
      </div>
    </PlayerContext.Provider>
  );
}

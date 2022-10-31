import VillageNav from "../components/TopNav";
import Modal from "../components/Modal";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function VillagePage() {
  const [modalOpen, setModalOpen] = useState();
  const [buildingType, setBuildingType] = useState("none");
  const close = () => setModalOpen(false);
  const open = (building) => {
    setModalOpen(true);
    setBuildingType(building);
  };
  return (
    <div className="flex flex-col h-screen w-screen bg-cover bg-[url('/assets/images/stardew-valley-img.jpg')]">
      <VillageNav className="w-screen" />
      <div className="flex h-full w-screen justify-center items-center">
        <div className="flex justify-center items-center w-[850px] h-[550px] bg-[url('/assets/images/valley-canvas.png')] translate-x-[30px] bg-center bg-cover">
          <div className="flex m-auto justify-center bg-cover w-[800px] h-[500px] bg-[url('/assets/images/village_map.png')] bg-center">
            <div className="absolute w-[300px] h-[180px] border-2 border-gray-300 hover:border-yellow-300 hover:border-4 translate-x-[-165px] translate-y-[60px]">
              <button
                onClick={() => open("Farm")}
                className="relative translate-x-[130px] rounded-sm text-center translate-y-[175px] w-[40px] bg-gray-300"
              >
                Farm
              </button>
            </div>

            <div className="absolute w-[150px] h-[130px] border-2 border-gray-300 hover:border-yellow-300 hover:border-4 translate-x-[5px] translate-y-[260px]">
              <button
                onClick={() => open("Hideaway")}
                className="relative translate-x-[37px] rounded-sm text-center translate-y-[125px] w-[75px] bg-gray-300"
              >
                Hideaway
              </button>
            </div>
            <div className="absolute w-[210px] h-[170px] border-2 border-gray-300 hover:border-yellow-300 hover:border-4 translate-x-[185px] translate-y-[60px]">
              <button
                onClick={() => open("Barrack")}
                className="relative translate-x-[75px] rounded-sm text-center translate-y-[165px] w-[60px] bg-gray-300"
              >
                Barrack
              </button>
            </div>
            <button
              onClick={() => open("Walls")}
              className="absolute translate-x-[140px] rounded-sm text-center translate-y-[460px] w-[50px] h-[30px] bg-gray-300"
            >
              Walls
            </button>
          </div>
        </div>
        <button className="py-3 px-6 bg-yellow-400 border-black border-2 rounded-full translate-y-[-230px] translate-x-2">
          i
        </button>
        <AnimatePresence
          initial={false}
          exitBeforeEnter={true}
          onExitComplete={() => null}
          className="absolute m-auto"
        >
          {modalOpen && (
            <Modal
              modalOpen={modalOpen}
              handleClose={close}
              buildingType={buildingType}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

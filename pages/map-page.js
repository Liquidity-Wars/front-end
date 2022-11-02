import { createContext, useState } from "react";
import MapHoverInfo from "../components/HoverInfo/MapHoverInfo";
import EnemyInfo from "../components/Map/EnemyInfo";
import MapGrid from "../components/Map/MapGrid";
import MapNav from "../components/MapNav";
import styles from "../styles/Home.module.css";
export const PlayerContext = createContext();

export default function MapPage() {
  const [isHovering, setIsHovering] = useState(false);
  const [playerId, setPlayerId] = useState();

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  return (
    <PlayerContext.Provider value={setPlayerId}>
      <div className="flex flex-col items-center h-screen w-screen bg-cover bg-[url('/assets/images/stardew-valley-img.jpg')]">
        <MapNav className="w-full" />
        <div className="flex items-center w-[850px] h-[520px] bg-[url('/assets/images/valley-canvas.png')] translate-x-[30px] bg-center bg-cover">
          <div className="flex mx-12 flex-col justify-center  w-[250px] h-[450px] border-2 border-black">
            <EnemyInfo playerId={playerId} />
          </div>
          <div className="flex items-center justify-center bg-cover rounded-md w-[450px] h-[450px] bg-[url('/assets/images/map_background.png')] bg-center">
            <MapGrid />
          </div>
          <div
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            className="py-3 px-3 bg-yellow-400 border-black border-2 rounded-full translate-y-[-230px] translate-x-6"
          >
            Log
            {isHovering && <MapHoverInfo />}
          </div>
        </div>
      </div>
    </PlayerContext.Provider>
  );
}

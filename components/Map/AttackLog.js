import { useState } from "react";
import AttackEvent from "./AttackEvent";

export default function AttackLog({ handleClose }) {
  // const [attackHistory, setAttackHistory] = useState([]);
  const attackHistory = [
    ["Attacked", 0, 6, 10],
    ["Attack", 0, 6, 10],
    ["Attacked", 0, 6, 10],
    ["Attacked", 0, 6, 10],
    ["Attack", 0, 6, 10],
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full w-full rounded-md bg-cover bg-[url('/assets/images/Web3Frame.png')]">
      <button
        onClick={handleClose}
        className="absolute translate-x-[170px] translate-y-[-180px]"
      >
        <div className="text-red-500 font-semibold">Close</div>
      </button>
      <div className="h-[350px] w-[350px]  overflow-y-scroll overflow-x-hidden flex flex-col">
        {attackHistory.map((attack, index) => (
          <div>
            <AttackEvent
              index={index}
              type={attack[0]}
              attackersLeft={attack[1]}
              defendersLeft={attack[2]}
              robbedResources={attack[3]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

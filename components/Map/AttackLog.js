import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import AttackEvent from "./AttackEvent";
import LiquidityWarsAbi from "../../constants/LiquidityWars.json";
import networkMapping from "../../constants/networkMapping.json";

export default function AttackLog({ handleClose, gameId }) {
  const [attackHistory, setAttackHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const LiquidityWarsAddress =
    chainId in networkMapping
      ? networkMapping[chainId]["LiquidityWars"][0]
      : null;

  const getEvents = async () => {
    // https://docs.ethers.io/v5/concepts/events/
    // https://docs.ethers.io/v5/getting-started/#getting-started--history
    setIsLoading(true);
    if (account && gameId) {
      var provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_MUMBAI_RPC_URL)
      const liquidityWarsContract = new ethers.Contract(
        LiquidityWarsAddress,
        LiquidityWarsAbi,
        provider
      );
      const attackerFilter = liquidityWarsContract.filters.AttackHappenned(
        account,
        null,
        gameId
      );
      const defenderFilter = liquidityWarsContract.filters.AttackHappenned(
        null,
        account,
        gameId
      );
      const attackerEvents = await liquidityWarsContract.queryFilter(
        attackerFilter,
        -9000
      );
      const defenderEvents = await liquidityWarsContract.queryFilter(
        defenderFilter,
        -9000
      );

      console.log("attackerEvents:", attackerEvents);
      console.log("defenderEvents:", defenderEvents);
      let allEvents = [...attackerEvents, ...defenderEvents];
      allEvents.sort((a, b) => a.blockNumber - b.blockNumber); // b - a for reverse sort
      console.log("allEvents:", allEvents);
      let history = [];
      let type;
      allEvents.forEach((event) => {

        type =
          event.args.attacker.toLowerCase() == account.toLowerCase()
            ? "Attack"
            : "Attacked";
        history.push([
          type,
          event.args.attackerTroopsSurvived.toString(),
          event.args.defenderTroopsSurvived.toString(),
          event.args.robbedResources.toString(),
          event.blockNumber.toString(),
        ]);

      });
      console.log("history:", history);
      setAttackHistory(history);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, [gameId]);

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
      <div className="h-[350px] w-[350px]  overflow-y-scroll overflow-x-hidden flex flex-col">
        {
          isLoading ? 
            <div className="text-center w-full bg-white border-[1px] border-black">
              Loading...
            </div>
          :
            attackHistory.length > 0 ? 
              attackHistory.map((attack, index) => (
                <div key={attack[4]}>
                  <AttackEvent
                    index={index}
                    type={attack[0]}
                    attackersLeft={attack[1]}
                    defendersLeft={attack[2]}
                    robbedResources={attack[3]}
                  />
                </div>))      
            :
              <div className="text-center w-full bg-white border-[1px] border-black">
                No event was found
              </div>
        }
      </div>
    </div>
  );
}

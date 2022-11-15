import VillageNav from "../components/VillageNav";
import Modal from "../components/Buildings/Modal";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import VillageHoverInfo from "../components/HoverInfo/VillageHoverInfo";
import { ethers } from "ethers";
import LiquidityVaultAbi from "../constants/LiquidityVault.json";
import networkMapping from "../constants/networkMapping.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useRouter } from "next/router";

export default function VillagePage() {
  const { account, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const router = useRouter();
  const [isPlayer, setIsPlayer] = useState("");
  const [modalOpen, setModalOpen] = useState();
  const [gameState, setGameState] = useState();
  const [buildingType, setBuildingType] = useState("none");
  const [isHovering, setIsHovering] = useState(false);
  const [infrastructureNumber, setInfrastructureNumber] = useState();
  const chainId = parseInt(chainIdHex);
  const contractAddresses =
    chainId in networkMapping ? networkMapping[chainId] : null;

  const close = () => setModalOpen(false);

  const open = (building) => {
    setModalOpen(true);
    setBuildingType(building);
    switch (building) {
      case "FARM":
        setInfrastructureNumber(0);
        break;
      case "BARRACK":
        setInfrastructureNumber(1);
        break;
      case "HIDEAWAY":
        setInfrastructureNumber(2);
        break;
      case "WALLS":
        setInfrastructureNumber(3);
        break;
    }
  };

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

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  async function checkPlayer() {
    if (account) {
      const [tokenAddress, amount] = await getPlayerInfo();
      const amountParsed = parseFloat(ethers.utils.formatEther(amount));
      const isPlayer = amountParsed > 0 ? "yes" : "no";
      setIsPlayer(isPlayer);
    }
  }

  async function getGameStateAsync() {
    const gameState = await getGameState();
    //console.log("village-map gameState:", gameState);
    setGameState(gameState);
  }

  useEffect(() => {
    checkPlayer();
    if ((account && isPlayer == "no") || gameState == 0) {
      router.push("/");
    }
  }, [isPlayer, gameState, account]);

  useEffect(() => {
    if (isWeb3Enabled) {
      checkPlayer();
      getGameStateAsync();
    }
  }, [isWeb3Enabled]);

  return (
    <div className="flex flex-col items-center h-screen w-screen bg-cover bg-[url('/assets/images/stardew-valley-img.jpg')]">
      <VillageNav className="w-full" gameState={gameState} />
      <div className="flex h-full w-screen justify-center items-center">
        <div className="flex justify-center items-center w-[850px] h-[520px] bg-[url('/assets/images/valley-canvas.png')] translate-x-[30px] bg-center bg-cover">
          <div className="flex m-auto justify-center bg-cover w-[770px] h-[470px] bg-[url('/assets/images/village_map.png')] bg-center">
            <div className="absolute w-[270px] h-[170px] border-2 border-gray-300 hover:border-yellow-300 hover:border-4 translate-x-[-155px] translate-y-[60px]">
              <button
                onClick={() => open("FARM")}
                className="relative translate-x-[110px] rounded-sm text-center translate-y-[165px] w-[40px] bg-gray-300"
              >
                Farm
              </button>
            </div>

            <div className="absolute w-[150px] h-[130px] border-2 border-gray-300 hover:border-yellow-300 hover:border-4 translate-x-[5px] translate-y-[240px]">
              <button
                onClick={() => open("HIDEAWAY")}
                className="relative translate-x-[37px] rounded-sm text-center translate-y-[125px] w-[75px] bg-gray-300"
              >
                Hideaway
              </button>
            </div>
            <div className="absolute w-[180px] h-[150px] border-2 border-gray-300 hover:border-yellow-300 hover:border-4 translate-x-[175px] translate-y-[60px]">
              <button
                onClick={() => open("BARRACK")}
                className="relative translate-x-[60px] rounded-sm text-center translate-y-[145px] w-[60px] bg-gray-300"
              >
                Barrack
              </button>
            </div>
            <button
              onClick={() => open("WALLS")}
              className="absolute translate-x-[140px] rounded-sm text-center translate-y-[420px] w-[50px] h-[30px] bg-gray-300"
            >
              Walls
            </button>
          </div>
        </div>
        <div
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          className="absolute z-20 translate-y-[-210px] translate-x-[455px]"
        >
          <img
            src="/assets/images/kingdom_flag.png"
            className="h-[100px] mr-2 p-0"
            alt="flag icon"
          />
          {isHovering && <VillageHoverInfo />}
        </div>

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
              infrastructureNumber={infrastructureNumber}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

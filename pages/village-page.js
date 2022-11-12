import VillageNav from "../components/VillageNav";
import Modal from "../components/Buildings/Modal";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import VillageHoverInfo from "../components/HoverInfo/VillageHoverInfo";
import { ethers } from "ethers";
import ERC20Abi from '../constants/ERC20.json'
import { useMoralis } from "react-moralis";
import { useRouter } from 'next/router'

export default function VillagePage() {
  const { account } = useMoralis();
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState();
  const [buildingType, setBuildingType] = useState("none");
  const [isHovering, setIsHovering] = useState(false);
  
  const close = () => setModalOpen(false);

  const open = (building) => {
    setModalOpen(true);
    setBuildingType(building);
  };

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const getEvents = async () => {
    // https://docs.ethers.io/v5/concepts/events/
    // https://docs.ethers.io/v5/getting-started/#getting-started--history

    console.log("getEvents");

    const provider = new ethers.providers.Web3Provider(ethereum);

    // LINK Token Mumbai
    const erc20Contract = new ethers.Contract("0x326C977E6efc84E512bB9C30f76E30c160eD06FB", ERC20Abi, provider);
    // Filter for all token transfers to me
    const filterTo = erc20Contract.filters.Transfer(null, "0xe220825b597e4D5867218E0Efa9684Dd26957b00");
    console.log("filterTo:", filterTo);
    // Filter for all token transfers from me
    const filterFrom = erc20Contract.filters.Transfer("0xe220825b597e4D5867218E0Efa9684Dd26957b00");
    console.log("filterFrom:", filterFrom);
    const events = await erc20Contract.queryFilter(filterTo);
    console.log("events:", events);

    // USDC Token Mainnet
    const usdcContract = new ethers.Contract("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", ERC20Abi, provider);
    const events2 = await usdcContract.queryFilter(filterTo);
    console.log("All USDC transfer to me:", events2);
    const events3 = await usdcContract.queryFilter(filterFrom);
    console.log("All USDC transfer from me:", events3);

    // DepositDone event from the LiquidityVault contract
    //const liquidityVaultContract = new ethers.Contract("0x41e190323923e37A190A6907aa4868cb0F613cF2", LiquidityVaultAbi, provider);
    //const eventFilter = liquidityVaultContract.filters.DepositDone();
    //const events = await liquidityVaultContract.queryFilter(eventFilter);

  }

  useEffect(() => {
    getEvents();
  }, [])

  useEffect(() => {
    if(!account) {
      router.push("/");
    }
  }, [account])

  return (
    <div className="flex flex-col items-center h-screen w-screen bg-cover bg-[url('/assets/images/stardew-valley-img.jpg')]">
      <VillageNav className="w-full" />
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
          className="py-3 px-3 bg-yellow-400 border-black border-2 rounded-full translate-y-[-230px] translate-x-2"
        >
          Info
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
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

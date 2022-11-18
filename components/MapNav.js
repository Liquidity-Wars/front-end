import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectButton } from "web3uikit";
import RewardsToClaim from "./Nav/RewardsToClaim";
import YourResources from "./Nav/YourResources";
import CountdownTimer from "./SmallTimer/CountdownTimer";
import { useMoralis, useWeb3Contract } from "react-moralis";
import LiquidityVaultAbi from "../constants/LiquidityVault.json";
import networkMapping from "../constants/networkMapping.json";
import HelpModal from "./Misc/HelpModal";

const MapNav = ({ gameState }) => {
  const router = useRouter();
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const LiquidityVaultAddress =
    chainId in networkMapping
      ? networkMapping[chainId]["LiquidityVault"][0]
      : null;
  const dateTime0 = new Date().getTime() + 5000;
  const [dateTime, setDateTime] = useState(dateTime0);
  const [modalOpen, setModalOpen] = useState();

  // get time getTimeToStartOrEndGame
  const { runContractFunction: getTimeToStartOrEndGame } = useWeb3Contract({
    abi: LiquidityVaultAbi,
    contractAddress: LiquidityVaultAddress,
    functionName: "getTimeToStartOrEndGame",
    params: {},
  });

  // getGameDuration
  const { runContractFunction: getGameDuration } = useWeb3Contract({
    abi: LiquidityVaultAbi,
    contractAddress: LiquidityVaultAddress,
    functionName: "getGameDuration",
    params: {},
  });

  async function updateUI() {
    const getTime = (await getTimeToStartOrEndGame())?.toString() || 0;
    const getGameDurations = (await getGameDuration())?.toString();
    let expiresInMS = getTime * 1000;
    let currentTimeStamp = new Date();
    let expiresDateTime = new Date(currentTimeStamp.getTime() + expiresInMS);
    setDateTime(expiresDateTime);
  }



  const close = () => setModalOpen(false);

  const open = () => {
    setModalOpen(true);
  };


  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <>
      <nav className="bg-transparent border-gray-200 py-2.5 rounded w-full">
        <div className="container flex justify-between items-center mx-auto">
          <div className="flex flex-col justify-center items-center">
            <div className="flex items-center">
              <Link href="/">
                <a
                  className={`flex items-center ${
                    isWeb3Enabled == true ? "pr-30" : "pr-2"
                  }`}
                >
                  <motion.div
                    initial={{
                      y: 0,
                    }}
                    animate={{
                      y: [10, 0, 10],
                      transition: {
                        duration: 1.6,
                        ease: "linear",
                        repeat: Infinity,
                      },
                    }}
                  >
                    <img
                      src="/assets/images/chicken.png"
                      className="mr-3 h-6 sm:h-9 ml-6"
                      alt="LW logo"
                    />
                  </motion.div>
                  <span className=" text-white self-center text-xl font-semibold whitespace-nowrap">
                    Liquidity Wars
                  </span>
                </a>
              </Link>
              <button
                    onClick={() => open()}
                    className="bg-[#F5AF00] px-2 font-bold shadow-md items-center rounded-full justify-center mx-2"
                  >
                    Tutorial
              </button>
            </div>
            <div className="flex flex-row items-center mt-4 ml-6">
              <CountdownTimer targetDate={dateTime} />
            </div>
          </div>

          <div className="hidden w-full md:block md:w-auto">
            <ul className="flex flex-col p-4 mt-4 items-center bg-transparent rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
              <li
                className={router.pathname == "/village-page" ? "active" : ""}
              >
                <Link href="/village-page">
                  <a
                    className={`block py-2 pr-4 pl-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ${
                      router.pathname === "/village-page"
                        ? "text-gray-200"
                        : "text-white"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <img
                        src="/assets/images/village_icon2.png"
                        className="h-[40px] mr-2 p-0"
                        alt="map icon"
                      />
                      <div>Go to Village</div>
                    </div>
                  </a>
                </Link>
              </li>
              <YourResources gameState={gameState} />
              <RewardsToClaim />
            </ul>
          </div>
          <div className="flex">
            <ConnectButton />
          </div>
          {modalOpen && <HelpModal handleClose={close} />}
        </div>
      </nav>
    </>
  );
};

export default MapNav;

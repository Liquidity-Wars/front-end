import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectButton } from "web3uikit";
import { useMoralis, useWeb3Contract } from "react-moralis";
import LiquidityVault from "../constants/LiquidityVault.json";
import networkMapping from "../constants/networkMapping.json";
import LiquidityWars from "../constants/LiquidityWars.json";

const VillageNav = () => {
  const router = useRouter();
  const [playerResources, setPlayerResources] = useState(0);
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const LiquidityWarsAddress =
    chainId in networkMapping
      ? networkMapping[chainId]["LiquidityWars"][0]
      : null;

  const { runContractFunction: getPlayerResources } = useWeb3Contract({
    abi: LiquidityWars,
    contractAddress: LiquidityWarsAddress,
    functionName: "getPlayerResources",
    params: { _playerAddress: account },
  });

  async function updateUI() {
    const getPlayerResource = await getPlayerResources();
    setPlayerResources(getPlayerResource);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <>
      <nav className="bg-transparent border-gray-200 py-2.5 rounded w-full">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <a href="/" className="flex items-center">
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
                className="mr-3 h-6 sm:h-9"
                alt="LW logo"
              />
            </motion.div>
            <span className=" text-white self-center text-xl font-semibold whitespace-nowrap">
              Liquidity Wars
            </span>
          </a>

          <div className="hidden w-full md:block md:w-auto">
            <ul className="flex flex-col p-4 mt-4 items-center bg-transparent rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
              <li className={router.pathname == "/map-page" ? "active" : ""}>
                <Link href="/map-page">
                  <a
                    className={`block py-2 pr-4 pl-3 rounded hover:text-blue-700  ${
                      router.pathname === "/map-page"
                        ? "text-gray-200"
                        : "text-white"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <img
                        src="/assets/images/map_icon.png"
                        className="h-[40px] mr-2 p-0"
                        alt="map icon"
                      />
                      <div>Go to Map</div>
                    </div>
                  </a>
                </Link>
              </li>
              <li className="text-white block py-2 pr-4 pl-3 rounded">
                <div className="flex items-center justify-center">
                  <img
                    src="/assets/images/resources_icon.png"
                    className="h-[30px] mr-2 p-0"
                    alt="resources icon"
                  />
                  <div>Your Resources: {playerResources}</div>
                </div>
              </li>
              <li className="text-white block py-2 pr-4 pl-3 rounded">
                <div className="flex items-center justify-center">
                  <img
                    src="/assets/images/rewards_icon.png"
                    className="h-[40px] mr-1 p-0"
                    alt="rewards icon"
                  />
                  <div>Rewards to Claim: {playerResources}</div>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex">
            <ConnectButton />
          </div>
        </div>
      </nav>
    </>
  );
};

export default VillageNav;

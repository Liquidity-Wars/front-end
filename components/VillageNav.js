import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectButton } from "web3uikit";
import RewardsToClaim from "./Nav/RewardsToClaim";
import YourResources from "./Nav/YourResources";
import { useMoralis } from "react-moralis";

const VillageNav = (gameState) => {
  const router = useRouter();
  const { isWeb3Enabled } = useMoralis();

  return (
    <>
      <nav className="bg-transparent border-gray-200 py-2.5 rounded w-full">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <a
            href="/"
            className={`flex items-center ${
              isWeb3Enabled == true ? "pr-36" : "pr-2"
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
              <YourResources gameState={gameState} />
              <RewardsToClaim />
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

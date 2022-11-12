import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectButton } from "web3uikit";
import RewardsToClaim from "./Nav/RewardsToClaim";
import YourResources from "./Nav/YourResources";


const MapNav = () => {
  const router = useRouter();

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
                        src="/assets/images/village_icon.png"
                        className="h-[40px] mr-2 p-0"
                        alt="map icon"
                      />
                      <div>Go to VIllage</div>
                    </div>
                  </a>
                </Link>
              </li>
              <YourResources />
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

export default MapNav;

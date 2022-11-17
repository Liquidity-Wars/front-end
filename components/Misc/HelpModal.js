import React, { useState } from "react";
import { motion } from "framer-motion";

const HelpModal = ({ handleClose }) => {
  const [openTab, setOpenTab] = useState(1);
  const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      overflowY: "hidden",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      opacity: 0,
    },
  };
  return (
    <>
      <motion.div
        onClick={(e) => e.stopPropagation}
        className="absolute w-[350px] h-[500px] flex flex-col items-center justify-center z-50 top-20 left-[1rem]"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex flex-col items-center justify-center h-full w-full rounded-md bg-cover bg-[url('/assets/images/Modal.png')]">
          <button onClick={handleClose} className="absolute top-4 right-6">
            <div className="text-red-500 font-semibold">
              <img
                src="/assets/images/closebutton.png"
                className="h-[30px] p-0"
                alt="close icon"
              />
            </div>
          </button>
          <div className="h-[460px] w-[290px]  overflow-y-scroll overflow-x-hidden flex flex-col">
            <div className="p-4">
              <div className="flex flex-col items-center justify-center max-w-xl ">
                <ul className="flex space-x-2">
                  <li>
                    <a
                      href="#"
                      onClick={() => setOpenTab(1)}
                      className={` ${
                        openTab === 1
                          ? "underline underline-offset-8 decoration-[#CF3810] decoration-4 text-[#CF3810]"
                          : ""
                      } font-['Nabana-bold'] text-lg inline-block`}
                    >
                      Deposit
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => setOpenTab(2)}
                      className={` ${
                        openTab === 2
                          ? "underline underline-offset-8 decoration-[#CF3810] decoration-4 text-[#CF3810]"
                          : ""
                      } font-['Nabana-bold'] text-lg  inline-block `}
                    >
                      Map Page
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => setOpenTab(3)}
                      className={` ${
                        openTab === 3
                          ? "underline underline-offset-8 decoration-[#CF3810] decoration-4 text-[#CF3810]"
                          : ""
                      } font-['Nabana-bold'] text-lg  inline-bloc`}
                    >
                      Village Page
                    </a>
                  </li>
                </ul>

                <div className="ml-4 py-3 mt-2 ">
                  <hr className="mb-2"></hr>
                  <div className={openTab === 1 ? "block" : "hidden"}>
                    <div className="mb-3">
                      Dear Judges, thanks for taking your time to try out our
                      front-end interface for our protocol. This is a guide we
                      have written to facilitate your interaction with our
                      interface.
                    </div>
                    <div>Step 1: Connect to your token wallet</div>
                    <img
                      src="/assets/images/deposit-step1.png"
                      className="h-[130px] p-0 mb-3"
                      alt="deposit step 1"
                    />
                    <div>
                      Step 2: Request for free demo LP tokens to test our game
                      {
                        " (We specially built this faucet to facilitate your testing)"
                      }
                      . Wait for the LP tokens to be transferred to your wallet.
                    </div>
                    <img
                      src="/assets/images/deposit-step1.png"
                      className="h-[130px] p-0 mb-3"
                      alt="deposit step 1"
                    />
                  </div>
                  <div className={openTab === 2 ? "block" : "hidden"}>
                    Liquidity on DEXes is a crucial factor which is responsible
                    for costs of swap
                  </div>
                  <div className={openTab === 3 ? "block" : "hidden"}>
                    Liquidity on DEXes is a crucial factor which is responsible
                    for costs of swap
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default HelpModal;

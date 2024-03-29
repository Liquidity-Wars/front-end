import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const HelpModal = ({ handleClose }) => {
  const router = useRouter();
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

  useEffect(() => {
    if (router.pathname === "/map-page") {
      setOpenTab(3);
    } else if (router.pathname === "/village-page") {
      setOpenTab(2);
    } else {
      setOpenTab(1);
    }
  }, []);
  return (
    <>
      <motion.div
        onClick={(e) => e.stopPropagation}
        className="absolute w-[350px] h-5/6 flex flex-col items-center justify-center z-50 top-20 left-[1rem]"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex flex-col items-center justify-center h-full w-full bg-[#FFCA7A] border-[#AB4A05] border-4 rounded-lg shadow-sm">
          <button onClick={handleClose} className="absolute top-1 right-1">
            <div className="text-red-500 font-semibold">
              <img
                src="/assets/images/closebutton.png"
                className="h-[30px] p-0"
                alt="close icon"
              />
            </div>
          </button>
          <div className="h-screen w-full  overflow-y-scroll overflow-x-hidden flex flex-col">
            <div className="px-2 py-4">
              <div className="flex flex-col items-left justify-center max-w-xl ">
                <ul className="flex space-x-2 px-2">
                  <li>
                    <a
                      href="#"
                      onClick={() => setOpenTab(1)}
                      className={`${
                        (openTab == 1)
                          ? "underline underline-offset-8 decoration-[#CF3810] decoration-4 text-[#CF3810]"
                          : ""
                      } font-['Nabana-bold']  text-lg inline-block`}
                    >
                      Deposit |
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => setOpenTab(2)}
                      className={`${
                        (openTab == 2 || router.pathname === "/village-page")
                          ? "underline underline-offset-8 decoration-[#CF3810] decoration-4 text-[#CF3810]"
                          : ""
                      } font-['Nabana-bold']  text-lg  inline-block`}
                    >
                      Village Page |
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => setOpenTab(3)}
                      className={`${
                        (openTab == 3 || router.pathname === "/map-page")
                          ? "underline underline-offset-8 decoration-[#CF3810] decoration-4 text-[#CF3810]"
                          : ""
                      } font-['Nabana-bold']  text-lg  inline-bloc`}
                    >
                      Map Page
                    </a>
                  </li>
                </ul>

                <div className="ml-2 py-3 mt-2 ">
                  <hr className="mb-2"></hr>
                  <div className={openTab === 1 ? "block" : "hidden"}>
                    <div className="mb-3">
                      Dear Players, thanks for taking your time to try out our
                      sample frontend interface for our protocol. This is a guide we
                      have written to help your interaction with our game.
                    </div>
                    <div>
                      <b>Step 1</b>: Connect to your token wallet.
                      Please be aware we only support Polygon Testnet Mumbai at moment.
                    </div>
                    <img
                      src="/assets/images/deposit-step1.png"
                      className="h-[150px] p-0 mb-3 mt-3 border-2 border-black"
                      alt="deposit step 1"
                    />
                    <div>
                      <b>Step 2</b>: Request free demo LP tokens to test our game{" "}
                        {
                          "(We've built this faucet for the only purpouse of helping you test)"
                        }
                        . Wait for the LP tokens to be transferred to your wallet.
                    </div>
                    <img
                      src="/assets/images/deposit-step2.png"
                      className="h-[150px] p-0 mb-3 mt-3 border-2 border-black"
                      alt="deposit step 2"
                    />
                    <div>
                      <b>Step 3</b>: Select the LINK-WMATIC LP token{" "}
                      {
                        "(We have configured our smart contract to support only this LP Token at the moment)"
                      }
                    </div>
                    <img
                      src="/assets/images/deposit-step3.png"
                      className="h-[150px] p-0 mb-3 mt-3 border-2 border-black"
                      alt="deposit step 3"
                    />
                    <div>
                      <b>Step 4</b>: Click the approve + deposit button to allow the
                      protocol to access the demo LP tokens and wait for
                      approval message.
                    </div>
                    <img
                      src="/assets/images/deposit-step4.png"
                      className="h-[150px] p-0 mb-3 mt-3 border-2 border-black"
                      alt="deposit step 4"
                    />
                    <div>
                      <b>Step 5</b>: Deposit the LP tokens required to enter our game
                      and wait for deposit success message.
                    </div>
                    <img
                      src="/assets/images/deposit-step5.png"
                      className="h-[150px] p-0 mb-3 mt-3 border-2 border-black"
                      alt="deposit step 5"
                    />
                    <div className="mb-3">
                      <b>Step 6</b>: Repeat steps 1-5 using another token wallet
                      account (this will be your enemy).
                    </div>
                    <div>
                      <b>Step 7</b>: Wait for some minutes so that the game changes
                      the state from “Game will start soon” to “Game is running”.
                      For this demo game, we configured the Chainlink Automation
                      to start the game once 80 seconds have passed and there should be 
                      at least 2 players deposited. The game should start soon since you have
                      deposited with 2 accounts.
                    </div>
                    <img
                      src="/assets/images/deposit-step6.png"
                      className="h-[150px] p-0 mb-3 mt-3 border-2 border-black"
                      alt="deposit step 6"
                    />
                    <div>
                      <b>Step 8</b>: Great! The game has started! Now head to the
                      Village page by clicking the Village button in the navbar.
                      This is your own personal village that you will build
                      throughout the duration of the game
                    </div>
                  </div>
                  <div className={openTab === 2 ? "block" : "hidden"}>
                    <div>
                      <b>Step 1</b>: Welcome to the Village page. You should see 4
                      basic infrastructures - Farm, Barrack, Walls and
                      Hideaway. Start by clicking on the Barrack button.
                    </div>
                    <img
                      src="/assets/images/village-step1.png"
                      className="h-[150px] p-0 mb-3 mt-3 border-2 border-black"
                      alt="village step 1"
                    />
                    <div>
                      <b>Step 2</b>: You should see a modal popup. This shows the
                      building stats of the Barrack. These attributes change
                      based on the level of the building. Click the
                      upgrade button to upgrade the barrack.
                    </div>
                    <img
                      src="/assets/images/village-step2.png"
                      className="h-[150px] p-0 mb-3 mt-3 border-2 border-black"
                      alt="village step 2"
                    />
                    <div>
                      <b>Step 3</b>: Great! Now the Barrack information modal should
                      show the updated building level and attributes. Try to
                      train troops. Input a number greater than 0 {"(e.g. 5)"}
                      into the input field. Click train troops and wait for the
                      success message.
                    </div>
                    <img
                      src="/assets/images/village-step3.png"
                      className="h-[150px] p-0 mb-3 mt-3 border-2 border-black"
                      alt="village step 3"
                    />
                    <div>
                      <b>Step 4</b>: Great! Now you have troops to attack other
                      players. Lets head over to the Map page!{" "}
                      {"(Click “Go to Map” in the navbar)"}
                    </div>
                  </div>
                  <div className={openTab === 3 ? "block" : "hidden"}>
                    <div>
                      <b>Step 1</b>: Welcome to the Map Page! Click on any of the
                      villages icons on the map to see more information
                      information.
                    </div>
                    <img
                      src="/assets/images/map-step1.png"
                      className="h-[150px] p-0 mb-3 mt-3 border-2 border-black"
                      alt="map step 1"
                    />
                    <div>
                      <b>Step 2</b>: If the village is yours, the address should state
                      {`"You"`}. Else, it should show a truncated wallet address
                      of another player and you should be able to see the Attack
                      button. Click on the Attack button to use the troops you
                      trained to steal resources. Wait for the success message.
                    </div>
                    <img
                      src="/assets/images/map-step2.png"
                      className="h-[150px] p-0 mb-3 mt-3 border-2 border-black"
                      alt="map step 2"
                    />
                    <div>
                      <b>Step 3</b>: Awesome! You have attacked your first enemy and
                      hpefully stolen resources from them. Click on the button that looks
                      like an ink pen to see your attack history. You should be able to see 
                      the details of your recent attack.
                    </div>
                    <img
                      src="/assets/images/map-step3.png"
                      className="h-[150px] p-0 mb-3 mt-3 border-2 border-black"
                      alt="map step 3"
                    />
                    <div>
                      <b>Step 4</b>: Great! You are now familiar with the basic
                      functionalities of our game. Do continue to explore
                      the game as you like{" "}
                      {
                        "(do note that the game ends after 10 minutes for this demo game)"
                      }
                      . Your deposited LP tokens will be returned to you when
                      the game ends. You will also receive extra REWARD tokens.
                      You can find these ERC20 transactions through your wallet
                      address in the Mumbai Polygonscan.
                    </div>
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

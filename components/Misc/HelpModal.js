import React, { useState } from 'react'
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const HelpModal = ({handleClose}) => {
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
        <button
            onClick={handleClose}
            className="absolute top-1 right-1"
        >
            <div className="text-red-500 font-semibold">
            <img
                src="/assets/images/closebutton.png"
                className="h-[30px] p-0"
                alt="close icon"
            />
            </div>
        </button>
        <div className="h-screen w-full  overflow-y-scroll overflow-x-hidden flex flex-col">
            <div className='px-2 py-4'>
    
                    <div className="flex flex-col items-left justify-center max-w-xl ">
                        <ul className="flex space-x-2 px-2">
                            <li>
                                <a
                                    href="#"
                                    onClick={() => setOpenTab(1)}
                                    className={` ${ router.pathname === "/" ? "underline underline-offset-8 decoration-[#CF3810] decoration-4 text-[#CF3810]" : "pointer-events-none"} font-['Nabana-bold']  text-lg inline-block`}
                                >
                                    Deposit |
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    onClick={() => setOpenTab(2)}
                                    className={` ${router.pathname === "/map-page"? "underline underline-offset-8 decoration-[#CF3810] decoration-4 text-[#CF3810]" : "pointer-events-none"} font-['Nabana-bold']  text-lg  inline-block `}
                                >
                                    Map Page |
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    onClick={() => setOpenTab(3)}
                                    className={` ${router.pathname === "/village-page" ? "underline underline-offset-8 decoration-[#CF3810] decoration-4 text-[#CF3810]" : "pointer-events-none"} font-['Nabana-bold']  text-lg  inline-bloc`}
                                >
                                    Village Page 
                                </a>
                            </li>
                        </ul>
                     
                        <div className="ml-2 py-3 mt-2 ">
                            <hr className='mb-2'></hr>
                            <div className={openTab === 1 ? "block" : "hidden"}>
                                {" "}
                                Liquidity on DEXes is a crucial factor which is responsible for costs of swap (slippages) and liquidity providing efficiency (pernament loss). Dexes usually compete for liquidity providers by offering high APRs often with highly inflationary tokens what obscures real APY. Our protocol offers different approach to attract liquidity - entertainment. What if I tell you, you can benefit from current LP farms and additionally have a fun ? Don't you be interested use our protocol instead of others ? We have taken an ide from pool together extended it and transmitted to the fantasy world where you can fight with other players for LP rewards without exposing yourself to risk of loosing LP tokens (LP tokens will always come back to you).
                            </div>
                            <div className={openTab === 2 ? "block" : "hidden"}>
                            Liquidity on DEXes is a crucial factor which is responsible for costs of swap
                            </div>
                            <div className={openTab === 3 ? "block" : "hidden"}>
                            Liquidity on DEXes is a crucial factor which is responsible for costs of swap
                            </div>
                        </div>
                    </div>
                
            </div>
        </div>
        </div>
    </motion.div>
   </>
  )
}

export default HelpModal
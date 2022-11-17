import React, {useState} from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectButton } from "web3uikit";
import { useMoralis } from "react-moralis";
import HelpModal from "./Misc/HelpModal";

const TopNav = () => {
  const router = useRouter();
  const { isWeb3Enabled } = useMoralis();
  const [modalOpen, setModalOpen] = useState();


  const close = () => setModalOpen(false);

  const open = () => {
    setModalOpen(true);
  };

//   useEffect(() =>{

//   }, [isWeb3Enabled])

  return (
    <>
        <nav className="bg-transparent border-gray-200 px-2 sm:px-4 py-2.5 rounded">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
            <div className={` flex ${isWeb3Enabled == true ? "pr-8" : "pr-2"} justify-center items-center`}>
              <a href="/" className={`flex items-center `}>
                    <motion.div
                        initial={{
                            y: 0,
                          }}
                          animate={{
                            y: [10, 0, 10],
                            transition:{
                              duration: 1.6,
                              ease: "linear",
                              repeat: Infinity,
                            }
                          }}
                    >
                        <img src="/assets/images/chicken.png" className="mr-3 h-6 sm:h-9" alt="LW logo" />
                    </motion.div>
                    <span className=" text-white self-center text-xl font-semibold whitespace-nowrap">Liquidity Wars</span>
                    {/* <Modal gameId={gameId} handleClose={close} /> */}
                </a>
                <button
                    onClick={() => open()}
                    className="bg-[#CF3810] h-6 w-6 items-center rounded-full justify-center mx-2"
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>

                </button>
            </div>
            <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
            </button>
            <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul className="flex flex-col p-4 mt-4 items-center bg-transparent rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
                    <li className={router.pathname == "/" ? "active" : ""}>
                        <Link href="/">
                            <a className={`block py-2 pr-4 pl-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ${router.pathname === "/"
                                    ? "text-gray-200"
                                    : "text-white"
                                }`}>Home</a>
                        </Link>
                    </li>
                    <li className={router.pathname == "/map-page" ? "active" : ""}>
                        <Link href="/map-page">
                            <a className={`block py-2 pr-4 pl-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ${router.pathname === "/map-page"
                                    ? "text-gray-200"
                                    : "text-white"
                                }`}>Map</a>
                        </Link>
                        
                    </li>
                    <li className={router.pathname == "/village-page" ? "active" : ""}>
                        <Link href="/village-page">
                            <a className={`block py-2 pr-4 pl-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ${router.pathname === "/village-page"
                                    ? "text-gray-200"
                                    : "text-white"
                                }`}>Village</a>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className='flex'>
                <ConnectButton />
            </div>
            {modalOpen && <HelpModal handleClose={close} />}
        </div>
      </nav>
    </>
  );
};

export default TopNav;

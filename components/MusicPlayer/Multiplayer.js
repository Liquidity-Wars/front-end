import React, { useEffect, useState } from 'react'
import useSound from 'use-sound';
import { motion } from 'framer-motion';


const Multiplayer = () => {
  const [play, { stop }] = useSound('/songs/site-song.mp3');
  const [played, setPlayed] = useState(false);

  const handleClick = () => {
    if(!played){
      play()
      setPlayed(true)
    } else {
      stop()
      setPlayed(false)
    }
  }

 
  useEffect(()=>{
    setTimeout(() => {
      play();
    }, 1);
    setPlayed(true)
  },[play])

  return (
   <>
    <motion.div 
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
        className="fixed z-50 bottom-10 right-8 bg-[#FFCA7A] border-[#AB4A05] border-2 rounded-lg shadow-sm w-48 h-24 drop-shadow-lg flex justify-center items-center hover:drop-shadow-2xl  duration-300"
    >
      <div className='flex flex-col items-center justify-center'>
        <div className='flex'>
          <h2 className="text-lg text-[#CF3810] font-['Nabana-bold'] font-bold">Liquidity Player</h2>
        </div>
        <div className='flex items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#AB4A05" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z" />
            </svg>
            <motion.button 
              id="playButton"
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.6 },
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleClick()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#AB4A05" className="w-8 h-8">
                  <motion.path 
                    initial={{
                      rotate: -45,
                      pathLength: 0, 
                    }}
                    animate={{
                      rotate: 0,
                      pathLength: 1, 
                    }}
                  strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                </svg>
            </motion.button>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#AB4A05" className="w-6 h-6">
              <motion.path 
                initial={{
                  pathLength: 0, 
                }}
                animate={{
                  pathLength: 1, 
                }}
              strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
            </svg>
        </div>
        <div className='flex'>
          <h2 className="text-lg text-[#CF3810] font-['Nabana-bold'] font-bold">Playing ~Valley Mix~</h2>
        </div>
      </div>


    </motion.div>
   </>
  )
}

export default Multiplayer
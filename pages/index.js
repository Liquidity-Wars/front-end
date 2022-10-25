import styles from "../styles/Home.module.css";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <div className="flex flex-col justify-center items-center pt-4">
          <motion.div
             initial={{
              y: 0,
            }}
            animate={{
              y: [30, 0, 30],
              transition:{
                duration: 1.6,
                ease: "linear",
                repeat: Infinity,
              }
            }}
           className="flex"
          >  
          <img  className="h-64"src="/assets/images/sample-logo.png" alt="logo"/>
          </motion.div>
            
          <div className="flex flex-col mt-12">
            <h2>Next Game In</h2>
            <p>....Tmer...</p>
          </div>
        </div>
      </div>
    </>
  )
}

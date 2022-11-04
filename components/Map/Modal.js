import { motion } from "framer-motion";
import AttackLog from "./AttackLog";

export default function Modal({ handleClose }) {
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
    <motion.div
      onClick={(e) => e.stopPropagation}
      className="absolute w-[400px] h-[400px] flex flex-col items-center justify-center"
      variants={dropIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <AttackLog handleClose={handleClose} />
    </motion.div>
  );
}

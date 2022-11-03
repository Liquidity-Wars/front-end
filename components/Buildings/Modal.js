import { motion } from "framer-motion";
import UpgradeBuilding from "./UpgradeBuilding";

export default function Modal({ handleClose, buildingType }) {
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
      <UpgradeBuilding handleClose={handleClose} buildingType={buildingType} />
    </motion.div>
  );
}

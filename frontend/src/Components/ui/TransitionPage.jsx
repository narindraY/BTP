import { motion } from "framer-motion";

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.11, ease: "easeInOut" }}
      style={{ position: "absolute", width: "100%" }}
    >
      {children}
    </motion.div>
  );
}
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
const AnimationWrapper = ({
  children,
  keyValue,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 2 },
  className,
}) => {
  return (
    <>
      <AnimatePresence>
        <motion.div
          className={className}
          initial={initial}
          animate={animate}
          transition={transition}
          key={keyValue}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default AnimationWrapper;

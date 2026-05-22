import React from 'react';
import { motion } from 'framer-motion';

const FloatingElement = ({ children, delay = 0, duration = 4, className = '', yOffset = -20, style = {} }) => {
  return (
    <motion.div
      animate={{
        y: [0, yOffset, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay,
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default FloatingElement;

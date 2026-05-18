import React from 'react';
import { motion } from 'framer-motion';

const GradientButton = ({ children, onClick, className = '', type = 'button' }) => {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-vibe-indigo via-vibe-lavender to-vibe-pink bg-size-200 hover:bg-right-bottom transition-all shadow-xl hover:shadow-2xl ${className}`}
      style={{ backgroundSize: '200% auto' }}
    >
      {children}
    </motion.button>
  );
};

export default GradientButton;

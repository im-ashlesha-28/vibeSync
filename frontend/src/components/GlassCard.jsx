import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', delay = 0, hover = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay }}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      className={`glass-card p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;

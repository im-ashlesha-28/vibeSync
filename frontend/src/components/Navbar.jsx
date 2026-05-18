import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-card px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: 180 }} 
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="text-vibe-indigo w-6 h-6" />
          </motion.div>
          <span className="font-bold text-2xl tracking-tight text-gradient">VibeSync</span>
        </Link>
        <div className="flex gap-6 items-center font-medium">
          <Link to="/sync" className="hover:text-vibe-indigo transition-colors duration-200">The Sync</Link>
          <Link to="/group" className="hover:text-vibe-indigo transition-colors duration-200">Group Lore</Link>
          <Link to="/sync">
            <button className="bg-vibe-indigo text-white px-5 py-2 rounded-full hover:bg-opacity-90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              Start
            </button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

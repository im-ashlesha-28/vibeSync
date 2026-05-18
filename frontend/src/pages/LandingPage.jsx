import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Users, Heart, Zap } from 'lucide-react';
import FloatingElement from '../components/FloatingElement';
import GradientButton from '../components/GradientButton';
import GlassCard from '../components/GlassCard';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <FloatingElement className="absolute top-10 left-10 text-6xl opacity-40 blur-[2px]" delay={0}>✨</FloatingElement>
      <FloatingElement className="absolute bottom-20 right-10 text-6xl opacity-40 blur-[2px]" delay={1}>💖</FloatingElement>
      <FloatingElement className="absolute top-1/4 right-1/4 text-4xl opacity-50 blur-[1px]" delay={2} yOffset={-30}>🦋</FloatingElement>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 mt-10"
      >
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
          How compatible are <br/>
          <span className="text-gradient">your vibes?</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium">
          Aesthetically analyze your friendships, relationships, and group dynamics. 
          Are you emotionally synced or just sharing one braincell?
        </p>

        <div className="flex flex-wrap gap-6 justify-center">
          <GradientButton onClick={() => navigate('/sync')} className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Start Syncing
          </GradientButton>
          <button onClick={() => navigate('/group')} className="px-8 py-4 rounded-full font-bold text-slate-700 bg-white/50 backdrop-blur-md border border-white hover:bg-white/70 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
            <Users className="w-5 h-5 text-vibe-indigo" /> Test Your Group
          </button>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-24 max-w-5xl z-10">
        <GlassCard hover={true} delay={0.2} className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-vibe-lavender/30 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-vibe-indigo" />
          </div>
          <h3 className="text-xl font-bold mb-2">Friendship Sync</h3>
          <p className="text-slate-600">Discover your dynamic. Are you the therapist friend or the chaos bringer?</p>
        </GlassCard>

        <GlassCard hover={true} delay={0.4} className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-vibe-pink/30 flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Chaos Level</h3>
          <p className="text-slate-600">Calculate the exact probability of making terrible decisions together.</p>
        </GlassCard>

        <GlassCard hover={true} delay={0.6} className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-vibe-blue/30 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Group Lore</h3>
          <p className="text-slate-600">Map out your friend group's ecosystem and assign official roles.</p>
        </GlassCard>
      </div>
    </div>
  );
};

export default LandingPage;

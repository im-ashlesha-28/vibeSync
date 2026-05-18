import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import FloatingElement from '../components/FloatingElement';
import { Users, Plus, Star } from 'lucide-react';

const roles = [
  { id: 1, name: "Therapist Friend", emoji: "🛋️", desc: "Listens to 40min voice notes", color: "bg-vibe-lavender" },
  { id: 2, name: "Chaotic One", emoji: "🌪️", desc: "Instigates everything", color: "bg-vibe-pink" },
  { id: 3, name: "Delulu Friend", emoji: "✨", desc: "Lives in their own world", color: "bg-vibe-blue" },
  { id: 4, name: "Planner", emoji: "📅", desc: "The only reason you guys meet", color: "bg-vibe-cream" },
];

const GroupMapPage = () => {
  const [members, setMembers] = useState([
    { id: 1, name: "Alex", role: roles[0] },
    { id: 2, name: "Sam", role: roles[1] },
    { id: 3, name: "Jordan", role: roles[3] },
  ]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-10">
      
      <div className="text-center mt-6 mb-10">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block p-3 bg-white/50 backdrop-blur-sm rounded-full mb-4">
          <Users className="w-8 h-8 text-vibe-indigo" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">Group <span className="text-gradient">Dynamics</span></h1>
        <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
          "This group would definitely miss their flight but somehow become emotionally closer in the airport."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Group List */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
            <Star className="text-yellow-400 fill-yellow-400" /> The Roster
          </h2>
          
          {members.map((member, idx) => (
            <motion.div 
              key={member.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard className="flex items-center justify-between py-4" hover={true}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${member.role.color} shadow-inner`}>
                    {member.role.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{member.role.name}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
          
          <button className="mt-2 py-4 border-2 border-dashed border-vibe-indigo/40 rounded-2xl text-vibe-indigo font-bold hover:bg-vibe-indigo/5 transition-colors flex items-center justify-center gap-2">
            <Plus /> Add Member
          </button>
        </div>

        {/* Right Column: Interactive Canvas Map (Mocked as visual) */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full min-h-[500px] relative overflow-hidden flex items-center justify-center bg-white/30 border-2 border-white/60">
            {/* Background elements */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            
            <h3 className="absolute top-6 left-6 font-bold text-slate-400 tracking-widest uppercase text-sm">Ecosystem Map</h3>

            {/* Simulated nodes */}
            <FloatingElement delay={0} className="absolute top-1/4 left-1/4" yOffset={-15}>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-vibe-lavender rounded-full shadow-lg border-4 border-white flex items-center justify-center text-3xl z-10 hover:scale-110 transition-transform cursor-pointer">
                  🛋️
                </div>
                <span className="mt-2 font-bold bg-white/80 px-3 py-1 rounded-full text-xs shadow-sm">Alex</span>
              </div>
            </FloatingElement>

            <FloatingElement delay={0.5} className="absolute bottom-1/4 left-1/3" yOffset={20}>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-vibe-pink rounded-full shadow-lg border-4 border-white flex items-center justify-center text-4xl z-10 hover:scale-110 transition-transform cursor-pointer">
                  🌪️
                </div>
                <span className="mt-2 font-bold bg-white/80 px-3 py-1 rounded-full text-xs shadow-sm">Sam</span>
              </div>
            </FloatingElement>

            <FloatingElement delay={1} className="absolute top-1/3 right-1/4" yOffset={-10}>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-vibe-cream rounded-full shadow-lg border-4 border-white flex items-center justify-center text-2xl z-10 hover:scale-110 transition-transform cursor-pointer">
                  📅
                </div>
                <span className="mt-2 font-bold bg-white/80 px-3 py-1 rounded-full text-xs shadow-sm">Jordan</span>
              </div>
            </FloatingElement>
            
            {/* Connecting Lines SVG (Mocked) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <motion.line 
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
                x1="25%" y1="25%" x2="33%" y2="75%" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeDasharray="5,5" 
              />
              <motion.line 
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5 }}
                x1="33%" y1="75%" x2="75%" y2="33%" stroke="rgba(255,255,255,0.8)" strokeWidth="3" 
              />
            </svg>
            
            <div className="absolute bottom-6 right-6">
               <GradientButton className="text-sm px-6 py-2 shadow-lg">Generate Lore Certificate</GradientButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default GroupMapPage;

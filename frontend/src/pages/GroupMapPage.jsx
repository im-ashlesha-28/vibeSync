import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import FloatingElement from '../components/FloatingElement';
import { Users, Plus, Star, X, Camera } from 'lucide-react';

const roles = [
  { id: 1, name: "Therapist Friend", emoji: "🛋️", desc: "Listens to 40min voice notes", color: "bg-vibe-lavender" },
  { id: 2, name: "Chaotic One", emoji: "🌪️", desc: "Instigates everything", color: "bg-vibe-pink" },
  { id: 3, name: "Delulu Friend", emoji: "✨", desc: "Lives in their own world", color: "bg-blue-400" },
  { id: 4, name: "The Planner", emoji: "📅", desc: "The only reason you meet", color: "bg-amber-300" },
  { id: 5, name: "Mom Friend", emoji: "👜", desc: "Carries snacks and bandaids", color: "bg-emerald-400" },
  { id: 6, name: "Meme Lord", emoji: "📱", desc: "Communicates in TikToks", color: "bg-purple-400" },
  { id: 7, name: "The Ghoster", emoji: "👻", desc: "Replies 3-5 business days later", color: "bg-slate-400" },
];

const GroupMapPage = () => {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal Form State
  const [newName, setNewName] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0].id);

  const canvasRef = useRef(null);

  const handleAddMember = () => {
    if (!newName.trim()) {
      alert("Please enter a name!");
      return;
    }
    const role = roles.find(r => r.id === selectedRoleId);
    
    // Assign random positions between 15% and 75% so they stay on screen
    const randomX = Math.floor(Math.random() * 60) + 15;
    const randomY = Math.floor(Math.random() * 60) + 15;
    
    const newMember = {
      id: Date.now(),
      name: newName,
      role,
      x: randomX,
      y: randomY
    };
    
    setMembers([...members, newMember]);
    setNewName('');
    setIsModalOpen(false);
  };

  const removeMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleDownload = async () => {
    if (members.length === 0) {
      alert("Add some friends to your map first!");
      return;
    }
    if (canvasRef.current) {
      const canvas = await html2canvas(canvasRef.current, { backgroundColor: null, scale: 2 });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `VibeSync_Group_Lore.png`;
      link.click();
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-10 relative">
      
      {/* Header */}
      <div className="text-center mt-6 mb-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block p-3 bg-white/50 backdrop-blur-sm rounded-full mb-4">
          <Users className="w-8 h-8 text-vibe-indigo" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">Group <span className="text-gradient">Lore</span></h1>
        <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
          Map out your friend group's ecosystem and generate your official group dynamics certificate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Group List */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
            <Star className="text-yellow-400 fill-yellow-400" /> The Roster ({members.length})
          </h2>
          
          <AnimatePresence>
            {members.map((member, idx) => (
              <motion.div 
                key={member.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <GlassCard className="flex items-center justify-between py-3 px-4 relative group" hover={true}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${member.role.color} shadow-inner`}>
                      {member.role.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{member.name}</h3>
                      <p className="text-xs text-slate-500 font-semibold">{member.role.name}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeMember(member.id)}
                    className="absolute right-4 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {members.length === 0 && (
            <div className="p-6 text-center border-2 border-dashed border-vibe-lavender/50 rounded-2xl text-slate-400">
              No friends added yet. Are you a lone wolf? 🐺
            </div>
          )}

          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-2 py-4 border-2 border-dashed border-vibe-indigo/40 rounded-2xl text-vibe-indigo font-bold hover:bg-vibe-indigo/5 transition-colors flex items-center justify-center gap-2"
          >
            <Plus /> Add Member
          </button>
        </div>

        {/* Right Column: Interactive Canvas Map */}
        <div className="lg:col-span-2">
          <GlassCard className="h-[600px] flex flex-col p-0 overflow-hidden relative">
            
            {/* The actual area that gets screenshotted */}
            <div ref={canvasRef} className="w-full h-full relative bg-[#fdfcff] overflow-hidden flex items-center justify-center">
              
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none"></div>
              
              <div className="absolute top-6 left-6 z-20">
                <h3 className="font-black text-2xl text-slate-800 uppercase tracking-widest">Ecosystem Map</h3>
                <p className="text-slate-400 font-bold text-sm tracking-widest">vibesync.vercel.app</p>
              </div>

              {members.length === 0 && (
                <div className="text-slate-300 font-bold text-xl flex flex-col items-center gap-4">
                  <Users className="w-16 h-16 opacity-50" />
                  Map is empty. Build your squad!
                </div>
              )}

              {/* Connecting Lines SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {members.map((member, index) => {
                  if (index === 0) return null;
                  const prevMember = members[index - 1];
                  return (
                    <motion.line 
                      key={`line-${member.id}`}
                      initial={{ pathLength: 0 }} 
                      animate={{ pathLength: 1 }} 
                      transition={{ duration: 0.8 }}
                      x1={`${prevMember.x}%`} 
                      y1={`${prevMember.y}%`} 
                      x2={`${member.x}%`} 
                      y2={`${member.y}%`} 
                      stroke="#C8B6FF" 
                      strokeWidth="3" 
                      strokeDasharray="5,5" 
                      className="opacity-60"
                    />
                  );
                })}
              </svg>

              {/* Dynamic Nodes */}
              {members.map((member, idx) => (
                <FloatingElement 
                  key={member.id} 
                  delay={idx * 0.2} 
                  className="absolute z-10"
                  style={{ top: `${member.y}%`, left: `${member.x}%` }}
                >
                  <div className="flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-20 h-20 ${member.role.color} rounded-full shadow-lg border-4 border-white flex items-center justify-center text-3xl hover:scale-110 transition-transform cursor-pointer`}>
                      {member.role.emoji}
                    </div>
                    <span className="mt-2 font-bold bg-white/90 px-4 py-1 rounded-full text-sm shadow-md whitespace-nowrap">
                      {member.name}
                    </span>
                    <span className="mt-1 font-bold text-[10px] text-slate-500 uppercase tracking-wider bg-white/60 px-2 py-0.5 rounded-full">
                      {member.role.name}
                    </span>
                  </div>
                </FloatingElement>
              ))}

            </div>
            
            {/* Action Bar (Not included in screenshot) */}
            <div className="absolute bottom-6 right-6 z-20">
               <GradientButton onClick={handleDownload} className="text-sm px-6 py-3 shadow-lg flex items-center gap-2">
                 <Camera className="w-4 h-4" /> Generate Lore Certificate
               </GradientButton>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
            >
              <GlassCard className="bg-white">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-vibe-indigo">Add a Friend</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X />
                  </button>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-500 mb-2">Friend's Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Taylor"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-vibe-indigo focus:outline-none"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-500 mb-2">Their Role</label>
                  <div className="max-h-60 overflow-y-auto pr-2 flex flex-col gap-2">
                    {roles.map(role => (
                      <div 
                        key={role.id}
                        onClick={() => setSelectedRoleId(role.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${
                          selectedRoleId === role.id ? 'border-vibe-indigo bg-vibe-indigo/5' : 'border-slate-100 hover:border-vibe-lavender hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${role.color}`}>
                          {role.emoji}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{role.name}</div>
                          <div className="text-xs text-slate-500">{role.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <GradientButton onClick={handleAddMember} className="w-full">
                  Add to Group Lore ✨
                </GradientButton>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GroupMapPage;

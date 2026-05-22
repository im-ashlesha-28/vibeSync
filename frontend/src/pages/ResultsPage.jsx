import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import html2canvas from 'html2canvas';
import { Camera, ArrowRight, AlertTriangle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';

const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const vibeCardRef = useRef(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/sync/${id}`);
        const data = await res.json();
        setResultData(data);
      } catch (error) {
        console.error("Failed to fetch result", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  const handleDownload = async () => {
    if (vibeCardRef.current) {
      const canvas = await html2canvas(vibeCardRef.current, { backgroundColor: null, scale: 2 });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `VibeSync_${resultData?.personAName}_${resultData?.personBName}.png`;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-16 h-16 border-4 border-vibe-indigo border-t-transparent rounded-full mb-6" />
        <h2 className="text-2xl font-bold text-gradient">Calculating Vibes...</h2>
      </div>
    );
  }

  const activeScores = resultData?.scores || { chaos: 80, emotional: 90, memeLogic: 65, planning: 30, delusion: 85 };
  const currentRadarData = [
    { subject: 'Chaos', A: activeScores.chaos, fullMark: 100 },
    { subject: 'Emotional', A: activeScores.emotional, fullMark: 100 },
    { subject: 'Meme Logic', A: activeScores.memeLogic, fullMark: 100 },
    { subject: 'Planning', A: activeScores.planning, fullMark: 100 },
    { subject: 'Delusion', A: activeScores.delusion, fullMark: 100 },
  ];

  const compScore = resultData?.compatibilityScore || 75;
  const currentPieData = [
    { name: 'Synced', value: compScore, color: '#5A4FCF' },
    { name: 'Confused', value: 100 - compScore, color: '#C8B6FF' },
  ];

  const summaryText = resultData?.summary || "Emotionally chaotic but spiritually synced. This duo shares one braincell and uses it to make terrible decisions together.";
  const personAName = resultData?.personAName || "You";
  const personBName = resultData?.personBName || "Them";
  const badge = resultData?.badge || "Aesthetic but Chaotic 💅";
  const redFlags = resultData?.redFlags || { personA: "Will start a petty argument just to feel something.", personB: "Fully believes they are the main character of a 2000s romcom." };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-10">
      
      {/* VIBE CARD (Capture Target) */}
      <div ref={vibeCardRef} className="p-4 rounded-3xl bg-[#fdfcff]">
        
        {/* Header section */}
        <div className="text-center mt-6">
          <div className="inline-block px-4 py-1 rounded-full bg-vibe-pink/20 text-vibe-indigo font-bold text-sm mb-4 uppercase tracking-widest border border-vibe-lavender">
            {resultData?.mode === 'relationship' ? '❤️ Relationship Sync' : '👯‍♀️ Friendship Sync'}
          </div>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black mb-2">
            {personAName} & {personBName}
          </motion.h1>
          <div className="inline-block px-6 py-2 rounded-xl bg-gradient-to-r from-vibe-lavender to-vibe-indigo text-white font-black text-xl mb-6 shadow-lg transform -rotate-2">
            {badge}
          </div>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
            "{summaryText}"
          </p>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <GlassCard className="h-80 flex flex-col items-center">
            <h3 className="text-xl font-bold mb-2">Vibe Compatibility</h3>
            <div className="w-full h-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={currentPieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {currentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-vibe-indigo">{compScore}%</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Match</span>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="h-80 flex flex-col items-center">
            <h3 className="text-xl font-bold mb-2">Energy Signature</h3>
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={currentRadarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Vibe" dataKey="A" stroke="#5A4FCF" fill="#C8B6FF" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Red Flag Analyzer */}
        <div className="mt-8">
          <GlassCard className="border-2 border-red-200/50 bg-red-50/30">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-red-500">
              <AlertTriangle /> The Red Flag Analyzer
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/60 rounded-xl">
                <h4 className="font-bold text-slate-700 mb-1">{personAName}'s Biggest Red Flag:</h4>
                <p className="text-slate-600 italic">"{redFlags.personA}"</p>
              </div>
              <div className="p-4 bg-white/60 rounded-xl">
                <h4 className="font-bold text-slate-700 mb-1">{personBName}'s Biggest Red Flag:</h4>
                <p className="text-slate-600 italic">"{redFlags.personB}"</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="text-center mt-6 pt-4 border-t border-slate-200/50">
          <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">vibesync.vercel.app</p>
        </div>
      </div>
      {/* END VIBE CARD */}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
        <GradientButton onClick={handleDownload} className="flex items-center justify-center gap-2 px-8">
          <Camera className="w-5 h-5" /> Share to Story
        </GradientButton>
        
        <button 
          onClick={() => navigate('/')} 
          className="px-8 py-3 rounded-xl font-bold bg-white/50 border-2 border-white text-vibe-indigo hover:bg-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          Check Another Vibe <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};

export default ResultsPage;

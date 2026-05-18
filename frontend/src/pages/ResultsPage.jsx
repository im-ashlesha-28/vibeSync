import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Share2, Download, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import FloatingElement from '../components/FloatingElement';

const radarData = [
  { subject: 'Chaos', A: 80, fullMark: 100 },
  { subject: 'Emotional', A: 90, fullMark: 100 },
  { subject: 'Meme Logic', A: 65, fullMark: 100 },
  { subject: 'Planning', A: 30, fullMark: 100 },
  { subject: 'Delusion', A: 85, fullMark: 100 },
];

const pieData = [
  { name: 'Synced', value: 75, color: '#5A4FCF' },
  { name: 'Confused', value: 25, color: '#C8B6FF' },
];

const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/sync/${id}`);
        const data = await response.json();
        
        if (data.scores) {
          setResultData(data);
        }
      } catch (error) {
        console.error("Failed to fetch results", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-vibe-indigo border-t-transparent rounded-full" />
      </div>
    );
  }

  // Generate chart data based on API response or fallback to default
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

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-10">
      
      {/* Header section */}
      <div className="text-center mt-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black mb-4"
        >
          Your Vibe Check is <span className="text-gradient">Ready</span>
        </motion.h1>
        <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
          "{summaryText}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        
        {/* Radar Chart Card */}
        <GlassCard className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6">Vibe Spectrum</h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentRadarData}>
                <PolarGrid stroke="#fff" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 14, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Vibe" dataKey="A" stroke="#5A4FCF" fill="#C8B6FF" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Score Card */}
        <GlassCard className="flex flex-col items-center justify-center relative overflow-hidden">
          <FloatingElement className="absolute -top-10 -right-10 text-9xl opacity-10" delay={0}>🔥</FloatingElement>
          
          <h2 className="text-2xl font-bold mb-2 z-10">Compatibility Score</h2>
          
          <div className="w-full h-[250px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {currentPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-5xl font-black text-vibe-indigo">{compScore}%</span>
              <p className="text-sm font-bold text-slate-400 mt-1">
                {compScore > 80 ? 'Soulmates' : compScore > 50 ? 'Chaotic Duo' : 'High Risk'}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Share Section */}
      <GlassCard className="mt-4 flex flex-col sm:flex-row items-center justify-between p-8 bg-gradient-to-r from-vibe-lavender/20 to-vibe-pink/20">
        <div>
          <h3 className="text-2xl font-bold mb-2">Flex your vibe</h3>
          <p className="text-slate-600 mb-4 sm:mb-0">Share this highly accurate scientific result to your story.</p>
        </div>
        <div className="flex gap-4">
          <button className="p-4 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
            <Share2 className="text-vibe-indigo" />
          </button>
          <button className="p-4 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
            <Download className="text-vibe-indigo" />
          </button>
          <GradientButton onClick={() => navigate('/group')} className="px-6 py-3">
            Group Lore <ArrowRight className="inline w-4 h-4 ml-1" />
          </GradientButton>
        </div>
      </GlassCard>
    </div>
  );
};

export default ResultsPage;

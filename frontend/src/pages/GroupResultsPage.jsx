import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import { Users, Share2, Sparkles, Zap, Flame, Heart } from 'lucide-react';

const GroupResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(\`\${apiUrl}/group/\${id}/results\`);
        const data = await res.json();
        if (data.success) {
          setResult(data.result);
        } else {
          // Poll if not ready yet
          setTimeout(fetchResults, 2000);
          return;
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchResults();
  }, [id, apiUrl]);

  if (loading || !result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-16 h-16 border-4 border-vibe-pink border-t-transparent rounded-full mb-6" />
        <h2 className="text-2xl font-bold text-gradient">Calculating Group Lore...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-10">
      <div className="text-center mt-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block px-4 py-1 bg-vibe-indigo/10 text-vibe-indigo font-bold rounded-full mb-4 uppercase tracking-widest text-sm">
          Official Group Lore
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black mb-2 text-gradient">{result.groupTitle}</h1>
        <p className="text-xl text-slate-500 font-bold mb-8">Group Compatibility: {result.groupCompatibility}%</p>
      </div>

      <GlassCard className="relative overflow-hidden bg-white/60">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={100} />
        </div>
        <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><Flame className="text-orange-500" /> The AI Lore</h2>
        <p className="text-lg leading-relaxed text-slate-700 italic border-l-4 border-vibe-indigo pl-4 py-2 bg-vibe-indigo/5 rounded-r-xl font-medium">
          "{result.lore}"
        </p>
        
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Trust Level" value={result.scores.trust} color="bg-emerald-100 text-emerald-600" />
          <StatBox label="Loyalty" value={result.scores.loyalty} color="bg-blue-100 text-blue-600" />
          <StatBox label="Chaos" value={result.scores.chaos} color="bg-red-100 text-red-600" />
          <StatBox label="Meme Sync" value={result.scores.meme} color="bg-purple-100 text-purple-600" />
        </div>
      </GlassCard>

      <div className="mt-4">
        <h2 className="text-3xl font-black mb-6 text-center">Individual Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.members.map((member, idx) => (
            <motion.div 
              key={member.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard className="h-full border-2 border-transparent hover:border-vibe-lavender transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">{member.name}</h3>
                    <div className="mt-1 inline-block px-3 py-1 bg-vibe-pink/10 text-vibe-pink font-bold rounded-full text-sm">
                      {member.primaryLabel}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-inner font-bold text-slate-400">
                    {member.name.charAt(0)}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {member.secondaryLabels.map(lbl => (
                    <span key={lbl} className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                      {lbl}
                    </span>
                  ))}
                </div>

                <div className="space-y-3">
                  <ProgressBar label="Leadership" value={member.stats.leadership} color="bg-vibe-indigo" />
                  <ProgressBar label="Chaos Energy" value={member.stats.chaos} color="bg-vibe-pink" />
                  <ProgressBar label="Emotional Support" value={member.stats.emotional} color="bg-emerald-400" />
                  <ProgressBar label="Humor" value={member.stats.humor} color="bg-amber-400" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8">
         <GradientButton onClick={() => navigate('/')} className="px-10 py-4 shadow-xl">
           Take Another Quiz ✨
         </GradientButton>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, color }) => (
  <div className={\`p-4 rounded-xl text-center \${color} shadow-sm border border-white/50\`}>
    <div className="text-2xl font-black">{value}%</div>
    <div className="text-xs font-bold uppercase tracking-wider mt-1 opacity-80">{label}</div>
  </div>
);

const ProgressBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1 font-bold">
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-400">{value}</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: \`\${value}%\` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={\`h-full \${color}\`}
      />
    </div>
  </div>
);

export default GroupResultsPage;

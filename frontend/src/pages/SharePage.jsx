import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';

const SharePage = () => {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // The link to send to their friend
  const shareUrl = `${window.location.origin}/sync/invite/${inviteId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-10 items-center justify-center min-h-[75vh] text-center">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-black mb-2"
      >
        Your Quiz is <span className="text-gradient">Ready</span>
      </motion.h1>
      <p className="text-lg text-slate-500 font-medium">
        Send this link to your partner in crime. The compatibility score will only reveal itself after they finish the quiz!
      </p>

      <GlassCard className="w-full flex flex-col items-center p-8 mt-6">
        <h2 className="text-2xl font-bold mb-6">Your Unique Link:</h2>
        
        <div className="flex flex-col sm:flex-row w-full gap-4">
          <div className="flex-1 bg-white/50 border-2 border-vibe-lavender/50 rounded-xl px-4 py-3 flex items-center overflow-x-auto">
            <span className="text-slate-600 whitespace-nowrap">{shareUrl}</span>
          </div>
          
          <button 
            onClick={copyToClipboard}
            className={`px-6 py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${copied ? 'bg-green-500' : 'bg-vibe-indigo hover:bg-opacity-90 shadow-lg hover:-translate-y-1'}`}
          >
            {copied ? <><CheckCircle className="w-5 h-5" /> Copied!</> : <><Copy className="w-5 h-5" /> Copy Link</>}
          </button>
        </div>

        <div className="mt-10 p-6 bg-vibe-pink/20 rounded-2xl border border-vibe-pink border-dashed">
          <h3 className="font-bold text-vibe-indigo mb-2">How it works:</h3>
          <ul className="text-sm text-slate-600 text-left list-disc pl-5 space-y-2">
            <li>Send the link via iMessage, WhatsApp, or carrier pigeon.</li>
            <li>They answer the exact same questions.</li>
            <li>The VibeSync algorithm compares your answers.</li>
            <li>You'll both see the final compatibility score and summary!</li>
          </ul>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="mt-8 font-bold text-slate-400 hover:text-vibe-indigo transition-colors flex items-center gap-1"
        >
          Return Home <ArrowRight className="w-4 h-4" />
        </button>
      </GlassCard>
    </div>
  );
};

export default SharePage;

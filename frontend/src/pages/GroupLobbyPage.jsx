import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import { Users, Copy, CheckCircle2 } from 'lucide-react';

const GroupLobbyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [name, setName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [memberId, setMemberId] = useState(localStorage.getItem(\`group_\${id}_memberId\`) || null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Polling for lobby updates if joined
  useEffect(() => {
    let interval;
    if (id && (isJoined || memberId)) {
      const fetchLobby = async () => {
        try {
          const res = await fetch(\`\${apiUrl}/group/\${id}\`);
          const data = await res.json();
          if (data.success) {
            setSessionInfo(data);
            if (data.status === 'active') {
               navigate(\`/group-quiz/\${id}\`);
            }
          }
        } catch (error) {
          console.error("Failed to fetch lobby", error);
        }
      };
      
      fetchLobby();
      interval = setInterval(fetchLobby, 2000);
    }
    return () => clearInterval(interval);
  }, [id, isJoined, memberId, navigate, apiUrl]);

  const handleCreate = async () => {
    if (!name.trim()) return alert("Enter your name!");
    setIsLoading(true);
    try {
      const res = await fetch(\`\${apiUrl}/group/create\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostName: name })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem(\`group_\${data.sessionId}_memberId\`, data.hostId);
        navigate(\`/group-lobby/\${data.sessionId}\`);
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("Error connecting to server");
    }
    setIsLoading(false);
  };

  const handleJoin = async () => {
    if (!name.trim()) return alert("Enter your name!");
    setIsLoading(true);
    try {
      const res = await fetch(\`\${apiUrl}/group/\${id}/join\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem(\`group_\${id}_memberId\`, data.memberId);
        setMemberId(data.memberId);
        setIsJoined(true);
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("Error connecting to server");
    }
    setIsLoading(false);
  };

  const handleStart = async () => {
    try {
      await fetch(\`\${apiUrl}/group/\${id}/start\`, { method: 'POST' });
    } catch (e) {
      alert("Error starting quiz");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-16 h-16 border-4 border-vibe-indigo border-t-transparent rounded-full mb-6" />
        <h2 className="text-2xl font-bold text-gradient">Connecting...</h2>
      </div>
    );
  }

  // Create Mode
  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-md mx-auto w-full text-center">
        <GlassCard className="w-full">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-vibe-indigo/10 rounded-full text-vibe-indigo">
              <Users size={48} />
            </div>
          </div>
          <h1 className="text-3xl font-black mb-2">Create GroupLore</h1>
          <p className="text-slate-500 mb-6">Start a multiplayer session with your friend group.</p>
          <input 
            type="text" 
            placeholder="Your name..."
            className="w-full px-6 py-4 rounded-xl border-2 border-vibe-lavender bg-white/50 focus:bg-white focus:outline-none focus:border-vibe-indigo transition-all mb-6 text-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <GradientButton onClick={handleCreate} className="w-full">
            Create Lobby ✨
          </GradientButton>
        </GlassCard>
      </div>
    );
  }

  // Join Mode (Not Joined Yet)
  if (!isJoined && !memberId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-md mx-auto w-full text-center">
        <GlassCard className="w-full">
          <h1 className="text-3xl font-black mb-2">Join GroupLore</h1>
          <p className="text-slate-500 mb-6">You've been invited to join a group quiz!</p>
          <input 
            type="text" 
            placeholder="Your name..."
            className="w-full px-6 py-4 rounded-xl border-2 border-vibe-lavender bg-white/50 focus:bg-white focus:outline-none focus:border-vibe-indigo transition-all mb-6 text-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <GradientButton onClick={handleJoin} className="w-full">
            Join Lobby 🚀
          </GradientButton>
        </GlassCard>
      </div>
    );
  }

  // Lobby (Joined)
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-2xl mx-auto w-full">
      <GlassCard className="w-full text-center">
        <h1 className="text-4xl font-black mb-2 text-gradient">Group Lobby</h1>
        <p className="text-slate-500 mb-6 font-medium">Waiting for everyone to join...</p>

        <div className="bg-white/40 p-4 rounded-xl mb-8 flex items-center justify-between border-2 border-vibe-lavender border-dashed">
          <span className="truncate text-slate-500 font-medium mr-4">{window.location.href}</span>
          <button 
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-vibe-indigo font-bold hover:bg-vibe-indigo hover:text-white transition-colors"
          >
            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
            <Users className="text-vibe-indigo" /> 
            Members ({sessionInfo?.members?.length || 1})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sessionInfo?.members?.map((m) => (
              <div key={m.id} className="bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-100 font-bold text-slate-700 flex justify-center items-center gap-2">
                 {m.id === memberId && <span className="w-2 h-2 rounded-full bg-green-400"></span>}
                 {m.name}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/50">
          <p className="text-sm text-slate-400 mb-4">When everyone is here, anyone can start the quiz.</p>
          <GradientButton onClick={handleStart} className="w-full shadow-lg shadow-vibe-indigo/20">
            Start Quiz 🎮
          </GradientButton>
        </div>
      </GlassCard>
    </div>
  );
};

export default GroupLobbyPage;

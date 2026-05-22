import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import { friendshipQuestions, relationshipQuestions } from '../data/questions';

const QuizPage = () => {
  const navigate = useNavigate();
  const { inviteId } = useParams(); // If present, user is Person B
  
  const [setupStep, setSetupStep] = useState(inviteId ? 'name' : 'mode'); // 'mode' -> 'name' -> 'quiz'
  const [mode, setMode] = useState(''); // 'friendship' or 'relationship'
  const [personName, setPersonName] = useState('');
  const [inviteData, setInviteData] = useState(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If there's an inviteId, fetch the invite details
  useEffect(() => {
    if (inviteId) {
      const fetchInvite = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const res = await fetch(`${apiUrl}/invite/${inviteId}`);
          const data = await res.json();
          if (data.success) {
            setInviteData(data);
            setMode(data.mode);
          } else {
            alert("Invite not found!");
            navigate('/');
          }
        } catch (error) {
          console.error("Failed to fetch invite", error);
        }
      };
      fetchInvite();
    }
  }, [inviteId, navigate]);

  const questions = mode === 'relationship' ? relationshipQuestions : friendshipQuestions;

  const handleSelect = (questionId, optionType) => {
    const updatedAnswers = { ...answers, [questionId]: optionType };
    setAnswers(updatedAnswers);
    
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        submitQuiz(updatedAnswers);
      }
    }, 400);
  };

  const submitQuiz = async (finalAnswers) => {
    setIsSubmitting(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    try {
      if (inviteId) {
        // Person B Flow: Match answers
        const response = await fetch(`${apiUrl}/sync/match`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inviteId, personBName: personName, answers: finalAnswers })
        });
        
        const data = await response.json();
        if (data.success) {
          navigate(`/result/${data.resultId}`);
        } else {
          alert(`Backend Error: ${data.message || "Failed to calculate match"}`);
          setIsSubmitting(false);
        }
      } else {
        // Person A Flow: Create Invite
        const response = await fetch(`${apiUrl}/invite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ personAName: personName, mode, answers: finalAnswers })
        });
        
        const data = await response.json();
        if (data.success) {
          navigate(`/share/${data.inviteId}`);
        } else {
          alert(`Backend Error: ${data.message || "Failed to create invite"}`);
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error("API error:", error);
      alert(`Network Error: ${error.message}. Make sure your backend is running and VITE_API_URL is set correctly!`);
      setIsSubmitting(false);
    }
  };

  // UI rendering based on setupStep
  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-vibe-indigo border-t-transparent rounded-full mb-6"
        />
        <h2 className="text-2xl font-bold text-gradient">
          {inviteId ? "Analyzing compatibility..." : "Generating your vibe link..."}
        </h2>
      </div>
    );
  }

  if (setupStep === 'mode') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-xl mx-auto w-full text-center">
        <h1 className="text-4xl font-black mb-8">What are we testing?</h1>
        <div className="flex flex-col gap-6 w-full">
          <GlassCard hover={true} className="cursor-pointer" delay={0.1}>
            <div onClick={() => { setMode('friendship'); setSetupStep('name'); }} className="p-4">
              <h2 className="text-2xl font-bold mb-2">👯‍♀️ Friendship</h2>
              <p className="text-slate-500">Test if your friend group is emotionally synced or totally chaotic.</p>
            </div>
          </GlassCard>
          <GlassCard hover={true} className="cursor-pointer" delay={0.2}>
            <div onClick={() => { setMode('relationship'); setSetupStep('name'); }} className="p-4">
              <h2 className="text-2xl font-bold mb-2">❤️ Relationship</h2>
              <p className="text-slate-500">Find out if you are soulmates or a walking red flag.</p>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (setupStep === 'name') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-md mx-auto w-full text-center">
        <GlassCard className="w-full">
          {inviteId && inviteData && (
            <div className="mb-6 bg-vibe-lavender/20 p-4 rounded-xl">
              <p className="text-sm font-bold text-vibe-indigo uppercase tracking-wider">You've been invited!</p>
              <h2 className="text-xl font-bold">Match with {inviteData.personAName}</h2>
            </div>
          )}
          <h1 className="text-3xl font-black mb-6">What's your name?</h1>
          <input 
            type="text" 
            placeholder="Your first name..."
            className="w-full px-6 py-4 rounded-xl border-2 border-vibe-lavender bg-white/50 focus:bg-white focus:outline-none focus:border-vibe-indigo transition-all mb-6 text-lg"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
          />
          <GradientButton 
            onClick={() => personName.trim() ? setSetupStep('quiz') : alert('Enter your name!')}
            className="w-full"
          >
            Start Syncing ✨
          </GradientButton>
        </GlassCard>
      </div>
    );
  }

  // Quiz Step
  const currentQ = questions[currentStep];

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-2xl mx-auto w-full">
      <div className="w-full mb-8 flex flex-col sm:flex-row justify-between items-center px-4 gap-4">
        <span className="text-sm font-bold text-slate-400">
          Question {currentStep + 1} of {questions.length}
        </span>
        <div className="flex gap-1 flex-wrap justify-center">
          {questions.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 w-4 sm:w-6 rounded-full transition-all duration-300 ${idx <= currentStep ? 'bg-vibe-indigo' : 'bg-slate-200'}`} 
            />
          ))}
        </div>
      </div>

      <GlassCard className="w-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            <h2 className="text-2xl sm:text-3xl font-black mb-8 text-center">{currentQ.question}</h2>
            
            <div className="flex flex-col gap-4">
              {currentQ.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(currentQ.id, option.type)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 text-left font-medium text-lg transition-all
                    ${answers[currentQ.id] === option.type 
                      ? 'border-vibe-indigo bg-vibe-indigo/10 shadow-md' 
                      : 'border-white/50 bg-white/40 hover:bg-white/60 hover:border-vibe-lavender'
                    }`}
                >
                  {option.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </GlassCard>
    </div>
  );
};

export default QuizPage;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';

const questions = [
  {
    id: 1,
    question: "How do you react during conflict?",
    options: [
      { text: "Send a perfectly crafted paragraph", type: "therapist" },
      { text: "Ghost for 3 business days", type: "ghoster" },
      { text: "Send a TikTok instead of replying", type: "meme" },
      { text: "Start crying immediately", type: "emotional" },
    ]
  },
  {
    id: 2,
    question: "How many tabs do you currently have open?",
    options: [
      { text: "1-3 (I am mentally stable)", type: "planner" },
      { text: "10-20 (Organized chaos)", type: "therapist" },
      { text: "50+ (I'm scared to look)", type: "chaos" },
      { text: "I just use my phone for everything", type: "meme" },
    ]
  },
  {
    id: 3,
    question: "Who sends reels instead of replying?",
    options: [
      { text: "Definitely me", type: "meme" },
      { text: "Them, and it's annoying", type: "planner" },
      { text: "We communicate entirely in reels", type: "chaos" },
      { text: "What's a reel?", type: "boomer" },
    ]
  }
];

const QuizPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (optionType) => {
    setAnswers({ ...answers, [currentStep]: optionType });
    
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        submitQuiz();
      }
    }, 400);
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      
      const data = await response.json();
      
      if (data.success && data.resultId) {
        navigate(`/result/${data.resultId}`);
      } else {
        console.error("Failed to generate results");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("API error:", error);
      // Fallback for demo if API is down
      setTimeout(() => {
        const mockId = Math.random().toString(36).substring(7);
        navigate(`/result/${mockId}`);
      }, 1500);
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-vibe-indigo border-t-transparent rounded-full mb-6"
        />
        <h2 className="text-2xl font-bold text-gradient">Analyzing your vibes...</h2>
        <p className="text-slate-500 mt-2">Calculating chaos levels</p>
      </div>
    );
  }

  const currentQ = questions[currentStep];

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-2xl mx-auto w-full">
      
      <div className="w-full mb-8 flex justify-between items-center px-4">
        <span className="text-sm font-bold text-slate-400">Question {currentStep + 1} of {questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 w-8 rounded-full transition-all duration-300 ${idx <= currentStep ? 'bg-vibe-indigo' : 'bg-slate-200'}`} 
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
            <h2 className="text-3xl font-black mb-8 text-center">{currentQ.question}</h2>
            
            <div className="flex flex-col gap-4">
              {currentQ.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(option.type)}
                  className={`p-5 rounded-2xl border-2 text-left font-medium text-lg transition-all
                    ${answers[currentStep] === option.type 
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

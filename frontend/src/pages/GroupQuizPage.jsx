import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import { friendshipQuestions } from '../data/questions';

const GroupQuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  const [memberId, setMemberId] = useState(localStorage.getItem(\`group_\${id}_memberId\`));
  const [members, setMembers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [subStep, setSubStep] = useState('answer'); // 'answer' or 'vote'
  
  const [answers, setAnswers] = useState({});
  const [votes, setVotes] = useState({}); // { questionId: chosenMemberId }
  
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch session to get members
  useEffect(() => {
    if (!memberId) {
      navigate(\`/group-lobby/\${id}\`);
      return;
    }
    
    const fetchSession = async () => {
      try {
        const res = await fetch(\`\${apiUrl}/group/\${id}\`);
        const data = await res.json();
        if (data.success) {
          setMembers(data.members);
        }
      } catch (e) {
        console.error("Failed to fetch group", e);
      }
    };
    fetchSession();
  }, [id, memberId, navigate, apiUrl]);

  // Polling when finished
  useEffect(() => {
    let interval;
    if (isFinished) {
      const checkStatus = async () => {
        try {
          const res = await fetch(\`\${apiUrl}/group/\${id}\`);
          const data = await res.json();
          if (data.success && data.status === 'completed') {
            navigate(\`/group-results/\${id}\`);
          }
        } catch (e) {
          // ignore
        }
      };
      interval = setInterval(checkStatus, 2000);
    }
    return () => clearInterval(interval);
  }, [isFinished, id, navigate, apiUrl]);

  const handleAnswerSelect = (questionId, optionType) => {
    setAnswers({ ...answers, [questionId]: optionType });
    setTimeout(() => {
      setSubStep('vote');
    }, 300);
  };

  const handleVoteSelect = (questionId, chosenMemberId) => {
    setVotes({ ...votes, [questionId]: chosenMemberId });
    setTimeout(() => {
      if (currentStep < friendshipQuestions.length - 1) {
        setCurrentStep(currentStep + 1);
        setSubStep('answer');
      } else {
        submitQuiz();
      }
    }, 300);
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(\`\${apiUrl}/group/\${id}/submit\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, answers, votes })
      });
      const data = await res.json();
      if (data.success) {
        setIsFinished(true);
      } else {
        alert(data.message || "Failed to submit");
      }
    } catch (e) {
      alert("Error submitting quiz");
    }
    setIsSubmitting(false);
  };

  if (isFinished || isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-md mx-auto w-full text-center">
        <GlassCard className="w-full">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-16 h-16 border-4 border-vibe-indigo border-t-transparent rounded-full mx-auto mb-6" />
          <h1 className="text-2xl font-black mb-2">Answers locked in!</h1>
          <p className="text-slate-500 font-medium">Waiting for the rest of your group to finish...</p>
        </GlassCard>
      </div>
    );
  }

  const currentQ = friendshipQuestions[currentStep];

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-2xl mx-auto w-full">
      <div className="w-full mb-8 flex flex-col sm:flex-row justify-between items-center px-4 gap-4">
        <span className="text-sm font-bold text-slate-400">
          Question {currentStep + 1} of {friendshipQuestions.length}
        </span>
        <div className="flex gap-1 flex-wrap justify-center">
          {friendshipQuestions.map((_, idx) => (
            <div 
              key={idx} 
              className={\`h-2 w-4 sm:w-6 rounded-full transition-all duration-300 \${idx < currentStep ? 'bg-vibe-indigo' : idx === currentStep ? 'bg-vibe-pink' : 'bg-slate-200'}\`} 
            />
          ))}
        </div>
      </div>

      <GlassCard className="w-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          {subStep === 'answer' ? (
            <motion.div
              key={\`q-\${currentStep}\`}
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
                    onClick={() => handleAnswerSelect(currentQ.id, option.type)}
                    className={\`p-4 sm:p-5 rounded-2xl border-2 text-left font-medium text-lg transition-all \${answers[currentQ.id] === option.type ? 'border-vibe-indigo bg-vibe-indigo/10 shadow-md' : 'border-white/50 bg-white/40 hover:bg-white/60 hover:border-vibe-lavender'}\`}
                  >
                    {option.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={\`v-\${currentStep}\`}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-vibe-indigo uppercase tracking-wider bg-vibe-indigo/10 px-3 py-1 rounded-full mb-4 inline-block">Group Lore</span>
                <h2 className="text-2xl sm:text-3xl font-black mt-2">Who in your group matches this the most?</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {members.map((m) => (
                  <motion.button
                    key={m.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVoteSelect(currentQ.id, m.id)}
                    className={\`p-4 rounded-2xl border-2 text-center font-bold text-lg transition-all \${votes[currentQ.id] === m.id ? 'border-vibe-pink bg-vibe-pink/10 text-vibe-pink shadow-md' : 'border-slate-200 bg-white hover:border-vibe-pink hover:bg-slate-50'}\`}
                  >
                    {m.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
};

export default GroupQuizPage;

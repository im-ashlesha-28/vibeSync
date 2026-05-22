import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import { friendshipQuestions, relationshipQuestions } from '../data/questions';

const QuizPage = () => {
  const navigate = useNavigate();
  const { inviteId } = useParams(); // If present, user is Person B in Remote mode
  
  // Steps: 'mode' -> 'playType' -> 'name' (A) -> 'quiz' (A) -> 'passPhone' -> 'nameB' -> 'quizB'
  const [setupStep, setSetupStep] = useState(inviteId ? 'name' : 'mode'); 
  const [mode, setMode] = useState(''); // 'friendship' or 'relationship'
  const [playType, setPlayType] = useState(''); // 'local' or 'remote'
  
  const [personName, setPersonName] = useState(''); // Person A (or Person B if remote invite)
  const [personBName, setPersonBName] = useState(''); // Person B (for local mode)
  
  const [inviteData, setInviteData] = useState(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [personAAnswers, setPersonAAnswers] = useState({}); // Used to store Person A's answers in local mode
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
            setPlayType('remote'); // Force remote mode for invite link
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
  const isPersonBTurn = setupStep === 'quizB';

  const handleSelect = (questionId, optionType) => {
    const updatedAnswers = { ...answers, [questionId]: optionType };
    setAnswers(updatedAnswers);
    
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        if (inviteId) {
          // Person B in Remote Mode finishes
          submitRemoteMatch(updatedAnswers);
        } else if (playType === 'local') {
          if (!isPersonBTurn) {
            // Person A in Local Mode finishes -> Switch to Person B
            setPersonAAnswers(updatedAnswers);
            setAnswers({});
            setCurrentStep(0);
            setSetupStep('passPhone');
          } else {
            // Person B in Local Mode finishes -> Submit Both
            submitLocalQuiz(updatedAnswers);
          }
        } else {
          // Person A in Remote Mode finishes -> Create Invite
          submitRemoteInvite(updatedAnswers);
        }
      }
    }, 400);
  };

  const submitRemoteInvite = async (finalAnswers) => {
    setIsSubmitting(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
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
    } catch (error) {
      alert(`Network Error: ${error.message}. Check VITE_API_URL.`);
      setIsSubmitting(false);
    }
  };

  const submitRemoteMatch = async (finalAnswers) => {
    setIsSubmitting(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
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
    } catch (error) {
      alert(`Network Error: ${error.message}. Check VITE_API_URL.`);
      setIsSubmitting(false);
    }
  };

  const submitLocalQuiz = async (personBFinalAnswers) => {
    setIsSubmitting(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      // Step 1: Create Invite for Person A behind the scenes
      const inviteResponse = await fetch(`${apiUrl}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personAName: personName, mode, answers: personAAnswers })
      });
      const inviteData = await inviteResponse.json();
      
      if (!inviteData.success) {
        alert("Failed to process local match.");
        setIsSubmitting(false);
        return;
      }

      // Step 2: Immediately match with Person B's answers
      const matchResponse = await fetch(`${apiUrl}/sync/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId: inviteData.inviteId, personBName: personBName, answers: personBFinalAnswers })
      });
      
      const matchData = await matchResponse.json();
      if (matchData.success) {
        navigate(`/result/${matchData.resultId}`);
      } else {
        alert(`Backend Error: ${matchData.message || "Failed to calculate match"}`);
        setIsSubmitting(false);
      }
    } catch (error) {
      alert(`Network Error: ${error.message}. Check VITE_API_URL.`);
      setIsSubmitting(false);
    }
  };

  // ---------------- UI RENDERING ----------------

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-16 h-16 border-4 border-vibe-indigo border-t-transparent rounded-full mb-6" />
        <h2 className="text-2xl font-bold text-gradient">
          {setupStep === 'quizB' || inviteId ? "Analyzing compatibility..." : "Generating your vibe link..."}
        </h2>
      </div>
    );
  }

  if (setupStep === 'mode') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-xl mx-auto w-full text-center">
        <h1 className="text-4xl font-black mb-8">What are we testing?</h1>
        <div className="flex flex-col gap-6 w-full">
          <GlassCard hover={true} className="cursor-pointer">
            <div onClick={() => { setMode('friendship'); setSetupStep('playType'); }} className="p-4">
              <h2 className="text-2xl font-bold mb-2">👯‍♀️ Friendship</h2>
              <p className="text-slate-500">Test if your friend group is emotionally synced or totally chaotic.</p>
            </div>
          </GlassCard>
          <GlassCard hover={true} className="cursor-pointer">
            <div onClick={() => { setMode('relationship'); setSetupStep('playType'); }} className="p-4">
              <h2 className="text-2xl font-bold mb-2">❤️ Relationship</h2>
              <p className="text-slate-500">Find out if you are soulmates or a walking red flag.</p>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (setupStep === 'playType') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-xl mx-auto w-full text-center">
        <h1 className="text-4xl font-black mb-8">How are you playing?</h1>
        <div className="flex flex-col gap-6 w-full">
          <GlassCard hover={true} className="cursor-pointer bg-vibe-lavender/10">
            <div onClick={() => { setPlayType('local'); setSetupStep('name'); }} className="p-4">
              <h2 className="text-2xl font-bold mb-2 text-vibe-indigo">📱 Pass the Phone</h2>
              <p className="text-slate-600">Take it together right now on the same device.</p>
            </div>
          </GlassCard>
          <GlassCard hover={true} className="cursor-pointer">
            <div onClick={() => { setPlayType('remote'); setSetupStep('name'); }} className="p-4">
              <h2 className="text-2xl font-bold mb-2">🌍 Send a Link</h2>
              <p className="text-slate-500">I will send them a link to take it on their own phone.</p>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (setupStep === 'name' || setupStep === 'nameB') {
    const isPersonB = setupStep === 'nameB';
    const value = isPersonB ? personBName : personName;
    const setValue = isPersonB ? setPersonBName : setPersonName;
    const nextStep = isPersonB ? 'quizB' : 'quiz';
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-md mx-auto w-full text-center">
        <GlassCard className="w-full">
          {inviteId && inviteData && !isPersonB && (
            <div className="mb-6 bg-vibe-lavender/20 p-4 rounded-xl">
              <p className="text-sm font-bold text-vibe-indigo uppercase tracking-wider">You've been invited!</p>
              <h2 className="text-xl font-bold">Match with {inviteData.personAName}</h2>
            </div>
          )}
          <h1 className="text-3xl font-black mb-6">{isPersonB ? "What's their name?" : "What's your name?"}</h1>
          <input 
            type="text" 
            placeholder="First name..."
            className="w-full px-6 py-4 rounded-xl border-2 border-vibe-lavender bg-white/50 focus:bg-white focus:outline-none focus:border-vibe-indigo transition-all mb-6 text-lg"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <GradientButton 
            onClick={() => value.trim() ? setSetupStep(nextStep) : alert('Enter a name!')}
            className="w-full"
          >
            Start Syncing ✨
          </GradientButton>
        </GlassCard>
      </div>
    );
  }

  if (setupStep === 'passPhone') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-md mx-auto w-full text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full">
          <GlassCard className="w-full py-12 bg-vibe-pink/10 border-vibe-pink">
            <h1 className="text-4xl font-black mb-4 text-vibe-indigo">Done!</h1>
            <p className="text-xl text-slate-600 mb-8 font-medium">Now pass the phone to your partner to see if you match.</p>
            <GradientButton onClick={() => setSetupStep('nameB')} className="w-full shadow-xl shadow-vibe-pink/30">
              I'm Ready 📱
            </GradientButton>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  // Quiz Step
  const currentQ = questions[currentStep];

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-2xl mx-auto w-full">
      <div className="w-full mb-8 flex flex-col sm:flex-row justify-between items-center px-4 gap-4">
        <span className="text-sm font-bold text-slate-400">
          Question {currentStep + 1} of {questions.length} <br/>
          <span className="text-vibe-indigo">{isPersonBTurn ? `${personBName}'s Turn` : `${personName}'s Turn`}</span>
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
            key={`${isPersonBTurn ? 'b' : 'a'}-${currentStep}`}
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

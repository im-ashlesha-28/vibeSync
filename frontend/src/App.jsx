import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import GroupMapPage from './pages/GroupMapPage';
import SharePage from './pages/SharePage';
import GroupLobbyPage from './pages/GroupLobbyPage';
import GroupQuizPage from './pages/GroupQuizPage';
import GroupResultsPage from './pages/GroupResultsPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans text-slate-800">
        <Navbar />
        <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sync" element={<QuizPage />} />
            <Route path="/sync/invite/:inviteId" element={<QuizPage />} />
            <Route path="/share/:inviteId" element={<SharePage />} />
            <Route path="/result/:id" element={<ResultsPage />} />
            <Route path="/group" element={<GroupMapPage />} />
            <Route path="/group-lobby" element={<GroupLobbyPage />} />
            <Route path="/group-lobby/:id" element={<GroupLobbyPage />} />
            <Route path="/group-quiz/:id" element={<GroupQuizPage />} />
            <Route path="/group-results/:id" element={<GroupResultsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

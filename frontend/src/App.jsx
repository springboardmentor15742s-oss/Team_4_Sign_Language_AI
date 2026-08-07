import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import NotificationToast from './components/NotificationToast';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import PracticeSessionPage from './pages/PracticeSessionPage';
import AssessmentQuizPage from './pages/AssessmentQuizPage';

function AppContent() {
  const [activeTab, setActiveTab] = useState('auth');

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'auth' && <AuthPage onLoginSuccess={() => setActiveTab('profile')} />}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'practice' && <PracticeSessionPage />}
        {activeTab === 'quiz' && <AssessmentQuizPage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060910] py-6 text-center text-xs text-slate-500">
        <p>Infosys Springboard Internship 2026 • Team 4 — Sign Language Learning & Assessment Platform</p>
        <p className="mt-1 text-[11px] text-slate-600">Built by Ankur Biswal (Frontend Lead) • Fast API + React.js Microservice Architecture</p>
      </footer>

      {/* System Toast Notification */}
      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

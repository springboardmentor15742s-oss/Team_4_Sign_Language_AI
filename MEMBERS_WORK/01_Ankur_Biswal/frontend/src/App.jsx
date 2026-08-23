import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import NotificationToast from './components/NotificationToast';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import PracticeSessionPage from './pages/PracticeSessionPage';
import AssessmentQuizPage from './pages/AssessmentQuizPage';
import DatasetLibraryPage from './pages/DatasetLibraryPage';
import CoursesPage from './pages/CoursesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import PracticeHistoryPage from './pages/PracticeHistoryPage';
import InstructorDashboardPage from './pages/InstructorDashboardPage';

// Protected pages — only rendered when authenticated
const PROTECTED_TABS = ['dashboard','practice','quiz','profile','datasets','courses','leaderboard','history','instructor'];

function AppContent() {
  const [activeTab, setActiveTab] = useState('auth');
  const { isAuthenticated } = useAuth();

  // If not authenticated and trying to access a protected tab, push back to auth
  useEffect(() => {
    if (!isAuthenticated && PROTECTED_TABS.includes(activeTab)) {
      setActiveTab('auth');
    }
  }, [isAuthenticated, activeTab]);

  // After login, redirect to dashboard
  const handleLoginSuccess = () => setActiveTab('dashboard');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        {/* Auth page — always accessible when not logged in */}
        {activeTab === 'auth' && <AuthPage onLoginSuccess={handleLoginSuccess} />}

        {/* Protected pages — only render when authenticated */}
        {isAuthenticated && (
          <>
            {activeTab === 'dashboard'   && (
              <DashboardPage
                onStartPractice={() => setActiveTab('practice')}
                onStartQuiz={() => setActiveTab('quiz')}
                onViewHistory={() => setActiveTab('history')}
              />
            )}
            {activeTab === 'practice'    && <PracticeSessionPage />}
            {activeTab === 'quiz'        && <AssessmentQuizPage />}
            {activeTab === 'profile'     && <ProfilePage />}
            {activeTab === 'datasets'    && <DatasetLibraryPage />}
            {activeTab === 'courses'     && <CoursesPage />}
            {activeTab === 'leaderboard' && <LeaderboardPage />}
            {activeTab === 'history'     && <PracticeHistoryPage />}
            {activeTab === 'instructor'  && <InstructorDashboardPage />}
          </>
        )}
      </main>

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

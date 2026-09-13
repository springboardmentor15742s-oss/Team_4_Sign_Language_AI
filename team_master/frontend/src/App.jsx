import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import NotificationToast from './components/NotificationToast';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import PracticeSessionPage from './pages/PracticeSessionPage';
import AssessmentQuizPage from './pages/AssessmentQuizPage';
import CoursesPage from './pages/CoursesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import PracticeHistoryPage from './pages/PracticeHistoryPage';
import InstructorDashboardPage from './pages/InstructorDashboardPage';

// Protected pages — only rendered when authenticated
const PROTECTED_TABS = ['dashboard','practice','quiz','profile','courses','leaderboard','history','instructor'];

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(() => isAuthenticated ? 'dashboard' : 'auth');

  // Handle cross-page SPA navigation events
  useEffect(() => {
    const handler = (e) => {
      const { tab, subTab } = e.detail || {};
      if (tab && PROTECTED_TABS.includes(tab)) {
        setActiveTab(tab);
        if (subTab) {
          try { localStorage.setItem("sl_profile_tab", subTab); } catch {}
          window.dispatchEvent(new CustomEvent("app-subtab", { detail: { subTab } }));
        }
      }
    };
    window.addEventListener("app-navigate", handler);
    return () => window.removeEventListener("app-navigate", handler);
  }, []);

  // If not authenticated and trying to access a protected tab, push back to auth
  useEffect(() => {
    if (!isAuthenticated && PROTECTED_TABS.includes(activeTab)) {
      setActiveTab('auth');
    } else if (isAuthenticated && activeTab === 'auth') {
      setActiveTab('dashboard');
    }
  }, [isAuthenticated, activeTab]);

  const navigateTo = (tab, subTab) => {
    if (PROTECTED_TABS.includes(tab)) {
      setActiveTab(tab);
      if (subTab) {
        try { localStorage.setItem("sl_profile_tab", subTab); } catch {}
        window.dispatchEvent(new CustomEvent("app-subtab", { detail: { subTab } }));
      }
    }
  };

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
            {activeTab === 'profile'     && <ProfilePage onNavigate={navigateTo} />}
            {activeTab === 'courses'     && <CoursesPage onNavigate={navigateTo} />}
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

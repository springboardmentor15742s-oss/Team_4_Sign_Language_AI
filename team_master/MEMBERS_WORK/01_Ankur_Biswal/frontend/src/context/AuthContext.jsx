import React, { createContext, useContext, useState } from 'react';

// Defined Roles per Project Architecture Document
export const ROLES = {
  LEARNER: {
    id: 'LEARNER',
    title: 'Learner',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    description: 'Students, individuals learning sign language & taking assessments',
    permissions: ['TAKE_LESSONS', 'PRACTICE_SIGNS', 'VIEW_PROFILE', 'EARN_CERTIFICATES']
  },
  INSTRUCTOR: {
    id: 'INSTRUCTOR',
    title: 'Instructor',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Teachers & trainers creating courses and monitoring student progress',
    permissions: ['TAKE_LESSONS', 'CREATE_COURSES', 'MANAGE_LESSONS', 'VIEW_STUDENT_ANALYTICS']
  },
  TRAINER: {
    id: 'TRAINER',
    title: 'Accessibility Trainer',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    description: 'Specialized educators evaluating accessibility engagement & skill growth',
    permissions: ['TAKE_LESSONS', 'EVALUATE_ACCESSIBILITY', 'AUDIT_CERTIFICATIONS', 'VIEW_ENGAGEMENT']
  },
  ADMIN: {
    id: 'ADMIN',
    title: 'Administrator',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'System manager controlling users, platform analytics & system logs',
    permissions: ['MANAGE_USERS', 'PLATFORM_ANALYTICS', 'SYSTEM_MONITORING', 'FULL_ACCESS']
  }
};

const DEFAULT_PROFILE = {
  id: 'usr_001',
  fullName: 'Ankur Biswal',
  email: 'ankurbiswal1968@gmail.com',
  role: 'LEARNER',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  learningLevel: 'Beginner',
  preferredLanguage: 'ASL (American Sign Language)',
  dailyTargetMins: 15,
  accessibilityNeeds: 'High contrast visual feedback preferred',
  learningGoals: [
    'Learn ASL Alphabet (A-Z)',
    'Master Everyday Conversation Signs',
    'Prepare for Certification Assessment'
  ],
  stats: {
    streakDays: 5,
    totalPracticeTimeMins: 140,
    signsLearnedCount: 18,
    averageAccuracyScore: 88.5,
    assessmentsPassed: 3,
    certificatesEarned: 1
  },
  skills: [
    { id: 'sk_1', name: 'Alphabet A-Z', category: 'Basics', masteryPercent: 92, status: 'Mastered' },
    { id: 'sk_2', name: 'Numbers 1-10', category: 'Basics', masteryPercent: 85, status: 'Proficient' },
    { id: 'sk_3', name: 'Greetings & Manners', category: 'Conversation', masteryPercent: 78, status: 'In Progress' },
    { id: 'sk_4', name: 'Emergency & Safety Signs', category: 'Advanced', masteryPercent: 45, status: 'Needs Practice' }
  ],
  practiceHistory: [
    { date: '2026-07-27', signName: 'Sign "A"', accuracy: 94, durationSeconds: 120, status: 'Success' },
    { date: '2026-07-26', signName: 'Sign "B"', accuracy: 89, durationSeconds: 180, status: 'Success' },
    { date: '2026-07-25', signName: 'Sign "C"', accuracy: 76, durationSeconds: 210, status: 'Needs Improvement' },
    { date: '2026-07-24', signName: 'Sign "D"', accuracy: 92, durationSeconds: 150, status: 'Success' }
  ]
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const login = (email, password) => {
    // Use DEFAULT_PROFILE as the demo logged-in user, but populate email from form
    const loggedInUser = { ...DEFAULT_PROFILE, email: email || DEFAULT_PROFILE.email };
    setUser(loggedInUser);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${loggedInUser.fullName}!`);
    return true;
  };

  const register = (data) => {
    const newUser = {
      ...DEFAULT_PROFILE,
      fullName: data.fullName,
      email: data.email,
      role: data.role || 'LEARNER',
      learningLevel: data.learningLevel || 'Beginner',
      preferredLanguage: data.preferredLanguage || 'ASL (American Sign Language)',
      learningGoals: data.learningGoals || ['Learn ASL Alphabet (A-Z)']
    };
    setUser(newUser);
    setIsAuthenticated(true);
    showToast(`Account created! Welcome, ${newUser.fullName}!`);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => ({
      ...prev,
      ...updatedFields
    }));
    showToast('Learner Profile updated successfully!');
  };

  const switchRole = (newRoleKey) => {
    if (!ROLES[newRoleKey]) return;
    setUser(prev => ({
      ...prev,
      role: newRoleKey
    }));
    showToast(`Switched active role view to: ${ROLES[newRoleKey].title}`);
  };

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    const userRole = ROLES[user.role];
    return userRole?.permissions.includes(permission) || userRole?.permissions.includes('FULL_ACCESS');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      toastMessage,
      login,
      register,
      logout,
      updateProfile,
      switchRole,
      hasPermission,
      showToast
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

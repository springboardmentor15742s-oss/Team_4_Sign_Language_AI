import React, { useState } from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import RoleBadge from '../components/RoleBadge';
import RBACNotice from '../components/RBACNotice';
import { Mail, Lock, User, ArrowRight, Shield, CheckCircle2, Sparkles, BookOpen, Users, Award } from 'lucide-react';

export default function AuthPage({ onLoginSuccess }) {
  const { login, register, user } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form State
  const [email, setEmail] = useState('ankurbiswal1968@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Ankur Biswal');
  const [selectedRole, setSelectedRole] = useState('LEARNER');
  const [learningLevel, setLearningLevel] = useState('Beginner');
  const [preferredLanguage, setPreferredLanguage] = useState('ASL (American Sign Language)');
  const [selectedGoals, setSelectedGoals] = useState([
    'Learn ASL Alphabet (A-Z)',
    'Master Everyday Conversation Signs'
  ]);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  const goalOptions = [
    'Learn ASL Alphabet (A-Z)',
    'Master Everyday Conversation Signs',
    'Professional & Workplace Vocabulary',
    'Prepare for Certification Exam',
    'Teach Sign Language to Others'
  ];

  const handleGoalToggle = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginMode) {
      login(email, password);
    } else {
      register({
        fullName,
        email,
        role: selectedRole,
        learningLevel,
        preferredLanguage,
        learningGoals: selectedGoals
      });
    }
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Module 1: User Authentication & Role-Based Access Control (RBAC)
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Sign Language Platform <span className="gradient-text">Authentication Portal</span>
        </h1>
        <p className="text-sm text-slate-400">
          Secure JWT authentication with role-specific access permissions for Learners, Instructors, Accessibility Trainers, and Administrators.
        </p>
      </div>

      {/* Main Grid: Auth Form + RBAC Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Container (7 Cols on desktop) */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 border-slate-800 shadow-2xl">
          
          {/* Tab Buttons */}
          <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 mb-8">
            <button
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                isLoginMode
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In to Account
            </button>
            <button
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                !isLoginMode
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create New Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name field (Register only) */}
            {!isLoginMode && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 block">Password</label>
                {isLoginMode && (
                  <button type="button" className="text-xs text-indigo-400 hover:underline font-medium">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* REGISTER MODE: Role Selection */}
            {!isLoginMode && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Select User Role <span className="text-indigo-400">(Role-Based Access Control)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys(ROLES).map((roleKey) => {
                    const role = ROLES[roleKey];
                    const isSelected = selectedRole === roleKey;
                    return (
                      <div
                        key={roleKey}
                        onClick={() => setSelectedRole(roleKey)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-950/50 border-indigo-500 shadow-md shadow-indigo-500/10'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-white">{role.title}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{role.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* REGISTER MODE: Learner Profile Extra Fields */}
            {!isLoginMode && selectedRole === 'LEARNER' && (
              <div className="space-y-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Learner Profile Setup</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400">Learning Level</label>
                    <select
                      value={learningLevel}
                      onChange={(e) => setLearningLevel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Beginner">Beginner (Alphabet & Basics)</option>
                      <option value="Intermediate">Intermediate (Conversations)</option>
                      <option value="Advanced">Advanced (Workplace & Fluency)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400">Preferred Language</label>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="ASL (American Sign Language)">ASL (American Sign Language)</option>
                      <option value="BSL (British Sign Language)">BSL (British Sign Language)</option>
                      <option value="ISL (Indian Sign Language)">ISL (Indian Sign Language)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-400">Learning Goals (Select All That Apply)</label>
                  <div className="space-y-1.5">
                    {goalOptions.map((goal, idx) => (
                      <label key={idx} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedGoals.includes(goal)}
                          onChange={() => handleGoalToggle(goal)}
                          className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Checkbox Options */}
            {isLoginMode ? (
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Keep me signed in for 7 days</span>
              </label>
            ) : (
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
                <span>I agree to the Platform Terms of Service & Privacy Policy</span>
              </label>
            )}

            {/* Submit Button */}
            <button type="submit" className="w-full btn-primary py-3.5 text-sm">
              {isLoginMode ? 'Sign In & Launch Platform' : 'Create Account & Set Up Profile'}
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Social Auth Simulation */}
            <div className="pt-4 border-t border-slate-800 text-center space-y-3">
              <p className="text-xs text-slate-500">Or authenticate using institutional provider</p>
              <button
                type="button"
                onClick={() => {
                  login(email, password);
                  if (onLoginSuccess) onLoginSuccess();
                }}
                className="w-full btn-secondary text-xs py-2.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Sign in with Google OAuth2
              </button>
            </div>

          </form>
        </div>

        {/* Right Container: RBAC Architecture Summary & Active Role Card */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Role Status Card */}
          <div className="glass-card p-6 border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Authenticated Role</span>
              <RoleBadge roleKey={user.role} />
            </div>
            
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <p className="text-sm font-bold text-white">{ROLES[user.role]?.title}</p>
              <p className="text-xs text-slate-400">{ROLES[user.role]?.description}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-300">Role Permissions Granted:</p>
              <div className="space-y-1.5">
                {ROLES[user.role]?.permissions.map((perm, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/30 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Spec Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
              <Shield className="w-4 h-4 text-indigo-400" />
              Security Specifications
            </div>
            <p className="text-xs text-slate-400">
              JWT Access Tokens (15 min expiry) + Refresh Tokens (7 days). All passwords hashed using bcrypt algorithm (cost factor 12).
            </p>
          </div>

        </div>

      </div>

      {/* Full RBAC Matrix Section */}
      <RBACNotice />

    </div>
  );
}

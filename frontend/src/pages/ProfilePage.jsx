import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import RoleBadge from '../components/RoleBadge';
import { User, Flame, Clock, Award, Target, BookOpen, CheckCircle2, TrendingUp, Edit3, Save, Sparkles, Sliders, Shield, Download, History } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [learningLevel, setLearningLevel] = useState(user.learningLevel);
  const [preferredLanguage, setPreferredLanguage] = useState(user.preferredLanguage);
  const [dailyTargetMins, setDailyTargetMins] = useState(user.dailyTargetMins);
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(user.accessibilityNeeds);
  const [selectedGoals, setSelectedGoals] = useState(user.learningGoals || []);

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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      fullName,
      learningLevel,
      preferredLanguage,
      dailyTargetMins: Number(dailyTargetMins),
      accessibilityNeeds,
      learningGoals: selectedGoals
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Module 2: Learner Profile Management & Skill Tracking
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Learner <span className="gradient-teal-text">Profile & Skill Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your personal learning goals, track skill mastery, practice history, and performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`btn-secondary text-xs ${isEditing ? 'border-amber-500/50 text-amber-300' : ''}`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? 'Cancel Editing' : 'Edit Profile Settings'}
          </button>
          
          <button
            onClick={() => alert('Downloading Learner Skill Progress PDF Report...')}
            className="btn-teal text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export Profile Report
          </button>
        </div>
      </div>

      {/* Top Banner Grid: User Info Header + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* User Card (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative shrink-0">
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#090D16]" title="Online Active"></span>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white">{user.fullName}</h2>
              <RoleBadge roleKey={user.role} />
            </div>
            <p className="text-xs text-slate-400">{user.email}</p>
            
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
                Level: <span className="text-indigo-400">{user.learningLevel}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
                Lang: <span className="text-teal-400">{user.preferredLanguage}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="glass-card p-4 border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <Flame className="w-4 h-4 fill-amber-400" />
              Practice Streak
            </div>
            <p className="text-2xl font-extrabold text-white">{user.stats.streakDays} <span className="text-xs font-semibold text-slate-400">Days</span></p>
            <p className="text-[11px] text-slate-500">Active consistency bonus</p>
          </div>

          <div className="glass-card p-4 border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <TrendingUp className="w-4 h-4" />
              Avg Accuracy
            </div>
            <p className="text-2xl font-extrabold text-white">{user.stats.averageAccuracyScore}%</p>
            <p className="text-[11px] text-slate-500">Across {user.stats.signsLearnedCount} signs learned</p>
          </div>
        </div>

      </div>

      {/* Editable Profile Form OR Profile View */}
      {isEditing ? (
        <form onSubmit={handleSaveProfile} className="glass-card p-6 border-indigo-500/40 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Edit Learner Profile & Learning Goals</h3>
            </div>
            <button type="submit" className="btn-primary text-xs py-2">
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Learning Level</label>
              <select
                value={learningLevel}
                onChange={(e) => setLearningLevel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Beginner">Beginner (Alphabet & Hand Shapes)</option>
                <option value="Intermediate">Intermediate (Conversational Signs)</option>
                <option value="Advanced">Advanced (Workplace & Fluency)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Preferred Sign Language</label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ASL (American Sign Language)">ASL (American Sign Language)</option>
                <option value="BSL (British Sign Language)">BSL (British Sign Language)</option>
                <option value="ISL (Indian Sign Language)">ISL (Indian Sign Language)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Daily Practice Target (Minutes/Day)</label>
              <select
                value={dailyTargetMins}
                onChange={(e) => setDailyTargetMins(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={10}>10 minutes / day (Casual)</option>
                <option value={15}>15 minutes / day (Recommended)</option>
                <option value={30}>30 minutes / day (Intensive)</option>
                <option value={45}>45 minutes / day (Fast Track)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-300">Learning Goals Management</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {goalOptions.map((goal, idx) => (
                <label key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 cursor-pointer">
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

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-300">Accessibility Needs & Preferences</label>
            <textarea
              rows={2}
              value={accessibilityNeeds}
              onChange={(e) => setAccessibilityNeeds(e.target.value)}
              placeholder="E.g., High contrast, visual feedback indicators..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

        </form>
      ) : null}

      {/* Main Grid: Goals & Skills (8 Cols) + Weighted Performance Scoring (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Skill Mastery Cards & Goals (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Learning Goals Card */}
          <div className="glass-card p-6 border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Active Learning Goals</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user.learningGoals?.map((goal, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{goal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Mastery Tracking Section */}
          <div className="glass-card p-6 border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Skill Mastery Tracking</h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">{user.skills?.length || 0} Modules Tracked</span>
            </div>

            <div className="space-y-4">
              {user.skills?.map((skill) => (
                <div key={skill.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{skill.name}</p>
                      <span className="text-[11px] text-slate-400 font-medium">{skill.category}</span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      skill.masteryPercent >= 90 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      skill.masteryPercent >= 75 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {skill.masteryPercent}% Mastery ({skill.status})
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        skill.masteryPercent >= 90 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                        skill.masteryPercent >= 75 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' :
                        'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}
                      style={{ width: `${skill.masteryPercent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice History Log */}
          <div className="glass-card p-6 border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Recent Practice Sessions</h3>
            </div>

            <div className="divide-y divide-slate-800/60 text-xs">
              {user.practiceHistory?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-200">{item.signName}</p>
                    <p className="text-[11px] text-slate-400">{item.date} • {item.durationSeconds}s duration</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-emerald-400">{item.accuracy}% Accuracy</span>
                    <span className="text-[10px] text-slate-500 block">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Performance Scoring Model Breakdown (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="glass-card p-6 border-slate-800 space-y-5">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Weighted Performance Score</h3>
            </div>

            <div className="text-center p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
              <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Overall Learning Score</span>
              <p className="text-4xl font-extrabold text-white">86.4 <span className="text-lg text-slate-400">/ 100</span></p>
            </div>

            <p className="text-xs text-slate-400 font-medium">Scoring formula specified in Project Architecture:</p>

            {/* Formula Components */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300 font-medium">Gesture Accuracy (40%)</span>
                <span className="font-bold text-white">92.0%</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300 font-medium">Assessment Score (25%)</span>
                <span className="font-bold text-white">88.5%</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300 font-medium">Lesson Completion (15%)</span>
                <span className="font-bold text-white">80.0%</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300 font-medium">Practice Consistency (10%)</span>
                <span className="font-bold text-white">90.0%</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300 font-medium">Skill Improvement (10%)</span>
                <span className="font-bold text-white">75.0%</span>
              </div>
            </div>

          </div>

          {/* Verification Badge */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-950/60 to-slate-900 border border-teal-500/30 text-xs space-y-2">
            <div className="flex items-center gap-2 text-teal-300 font-bold">
              <Shield className="w-4 h-4 text-teal-400" />
              Verified Learner Profile
            </div>
            <p className="text-slate-400">
              Profile details are verified and synchronized with the PostgreSQL database.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

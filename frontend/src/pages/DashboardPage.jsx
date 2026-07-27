import React from 'react';
import { useAuth } from '../context/AuthContext';
import RoleBadge from '../components/RoleBadge';
import { LayoutDashboard, Flame, Target, Award, Play, ChevronRight, Video, Sparkles, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 border-indigo-500/30 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <RoleBadge roleKey={user.role} />
              <span className="text-xs font-semibold text-slate-400">Welcome Back</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Hello, <span className="gradient-text">{user.fullName}</span>! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {user.role === 'LEARNER' && "You're on a 5-day practice streak! Ready to master new ASL signs today?"}
              {user.role === 'INSTRUCTOR' && "You have 24 active students across 3 sign language courses."}
              {user.role === 'TRAINER' && "Accessibility engagement is up 18% this week. Audit reports ready."}
              {user.role === 'ADMIN' && "All 12 backend microservices and databases are operating normally."}
            </p>
          </div>

          <button onClick={() => alert('Starting AI Gesture Camera Session...')} className="btn-teal text-xs py-3 px-5 shrink-0">
            <Video className="w-4 h-4" />
            Start AI Practice Session
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Daily Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{user.stats.streakDays} Days</p>
          <p className="text-[11px] text-emerald-400 font-semibold">🔥 Top 10% consistency</p>
        </div>

        <div className="glass-card p-5 border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Signs Learned</span>
            <Target className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{user.stats.signsLearnedCount} Signs</p>
          <p className="text-[11px] text-slate-400">Target: 30 signs this month</p>
        </div>

        <div className="glass-card p-5 border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Average Accuracy</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{user.stats.averageAccuracyScore}%</p>
          <p className="text-[11px] text-emerald-400 font-semibold">+4.2% improvement</p>
        </div>

        <div className="glass-card p-5 border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Certificates Passed</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{user.stats.certificatesEarned} Cert</p>
          <p className="text-[11px] text-slate-400">ASL Alphabet Level 1</p>
        </div>
      </div>

      {/* Recommended Lessons Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Play className="w-4 h-4 text-indigo-400" />
          Recommended Next Lessons
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card-interactive p-5 space-y-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Alphabet • Lesson 4</span>
            <h3 className="text-base font-bold text-white">Signs G, H, and I</h3>
            <p className="text-xs text-slate-400">Learn finger positions for letters G, H, and I with MediaPipe gesture feedback.</p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">Est. 10 mins</span>
              <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Start Lesson <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="glass-card-interactive p-5 space-y-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">Conversation • Lesson 2</span>
            <h3 className="text-base font-bold text-white">Basic Greetings & Courtesy</h3>
            <p className="text-xs text-slate-400">Practice signs for "Hello", "Thank You", "Please", and "Nice to meet you".</p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">Est. 15 mins</span>
              <button className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1">
                Start Lesson <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="glass-card-interactive p-5 space-y-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Quiz • Practice</span>
            <h3 className="text-base font-bold text-white">Weekly Speed Assessment</h3>
            <p className="text-xs text-slate-400">Evaluate gesture accuracy speed for letters A through F under 60 seconds.</p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">Est. 5 mins</span>
              <button className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                Take Quiz <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import RoleBadge from './RoleBadge';
import { Hand, User, ShieldCheck, ChevronDown, LogOut, Sparkles, LayoutDashboard, UserCheck, Award } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#090D16]/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('auth')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
              <Hand className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">SignLearn</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
            </div>
            <span className="text-[11px] text-slate-400 block -mt-0.5 font-medium">Infosys Team 4 Platform</span>
          </div>
        </div>

        {/* Center Nav Items */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('auth')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'auth'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Auth & RBAC
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <User className="w-4 h-4" />
            Learner Profile
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
        </nav>

        {/* Right Side: Role Switcher & User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Interactive Role Switcher Dropdown (Demonstrating RBAC Live) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all text-xs font-semibold text-slate-200"
              title="Click to test switching roles live!"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline text-slate-400">Role:</span>
              <RoleBadge roleKey={user.role} />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-[#131B2E] border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Test Role-Based Access (RBAC)</p>
                  <p className="text-[11px] text-slate-400">Switch role to simulate permissions live:</p>
                </div>
                <div className="py-1 space-y-1">
                  {Object.keys(ROLES).map((roleKey) => (
                    <button
                      key={roleKey}
                      onClick={() => {
                        switchRole(roleKey);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                        user.role === roleKey
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{ROLES[roleKey].title}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{ROLES[roleKey].description}</div>
                      </div>
                      {user.role === roleKey && <span className="w-2 h-2 rounded-full bg-indigo-400"></span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <span className="text-xs font-semibold text-slate-200 hidden md:inline">{user.fullName}</span>
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
              />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-[#131B2E] border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
                <div className="px-3 py-2.5 border-b border-slate-800">
                  <p className="text-sm font-bold text-white">{user.fullName}</p>
                  <p className="text-xs text-slate-400 line-clamp-1">{user.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-indigo-400" />
                    View & Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 rounded-xl flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}

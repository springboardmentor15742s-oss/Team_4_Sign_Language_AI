import React from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import RoleBadge from './RoleBadge';
import { ShieldCheck, Check, X, Info } from 'lucide-react';

export default function RBACNotice() {
  const { user } = useAuth();
  const currentRole = ROLES[user.role] || ROLES.LEARNER;

  const matrix = [
    { feature: 'Take Video Lessons & Practice Signs', learner: true, instructor: true, trainer: true, admin: true },
    { feature: 'Create & Manage Course Content', learner: false, instructor: true, trainer: true, admin: true },
    { feature: 'View Student Progress & Class Analytics', learner: false, instructor: true, trainer: true, admin: true },
    { feature: 'Audit Accessibility & Engagement Reports', learner: false, instructor: false, trainer: true, admin: true },
    { feature: 'User Management & Role Assignment', learner: false, instructor: false, trainer: false, admin: true },
    { feature: 'System Configuration & Security Monitoring', learner: false, instructor: false, trainer: false, admin: true },
    { feature: 'Earn & Export Verified Skill Certificates', learner: true, instructor: false, trainer: false, admin: false }
  ];

  return (
    <div className="glass-card p-6 border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Role-Based Access Control (RBAC) System</h3>
          </div>
          <p className="text-xs text-slate-400">
            Current active session role: <RoleBadge roleKey={user.role} />
          </p>
        </div>
        <div className="bg-indigo-950/40 border border-indigo-500/20 px-4 py-2.5 rounded-xl text-xs text-indigo-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>{currentRole.description}</span>
        </div>
      </div>

      {/* RBAC Feature Matrix Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
              <th className="py-3 px-4">Feature / Module Access</th>
              <th className="py-3 px-4 text-center">Learner</th>
              <th className="py-3 px-4 text-center">Instructor</th>
              <th className="py-3 px-4 text-center">Trainer</th>
              <th className="py-3 px-4 text-center">Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {matrix.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-200">{row.feature}</td>
                <td className="py-3 px-4 text-center">
                  {row.learner ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-slate-600 inline" />}
                </td>
                <td className="py-3 px-4 text-center">
                  {row.instructor ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-slate-600 inline" />}
                </td>
                <td className="py-3 px-4 text-center">
                  {row.trainer ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-slate-600 inline" />}
                </td>
                <td className="py-3 px-4 text-center">
                  {row.admin ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-slate-600 inline" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
    <div className="glass-card p-6 border-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-bold text-slate-900">Role-Based Access Control (RBAC) System</h3>
          </div>
          <p className="text-xs text-slate-500">
            Current active session role: <RoleBadge roleKey={user.role} />
          </p>
        </div>
        <div className="bg-sky-50 border border-sky-200 px-4 py-2.5 rounded-xl text-xs text-sky-800 flex items-start gap-2">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <span>{currentRole.description}</span>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
              <th className="py-3 px-4 rounded-l-lg">Feature / Module Access</th>
              <th className="py-3 px-4 text-center">Learner</th>
              <th className="py-3 px-4 text-center">Instructor</th>
              <th className="py-3 px-4 text-center">Trainer</th>
              <th className="py-3 px-4 text-center rounded-r-lg">Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {matrix.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900">{row.feature}</td>
                <td className="py-3 px-4 text-center">
                  {row.learner ? <Check className="w-4 h-4 text-emerald-600 inline font-bold" /> : <X className="w-4 h-4 text-slate-300 inline" />}
                </td>
                <td className="py-3 px-4 text-center">
                  {row.instructor ? <Check className="w-4 h-4 text-emerald-600 inline font-bold" /> : <X className="w-4 h-4 text-slate-300 inline" />}
                </td>
                <td className="py-3 px-4 text-center">
                  {row.trainer ? <Check className="w-4 h-4 text-emerald-600 inline font-bold" /> : <X className="w-4 h-4 text-slate-300 inline" />}
                </td>
                <td className="py-3 px-4 text-center">
                  {row.admin ? <Check className="w-4 h-4 text-emerald-600 inline font-bold" /> : <X className="w-4 h-4 text-slate-300 inline" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

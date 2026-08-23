import React from 'react';
import { ROLES } from '../context/AuthContext';
import { Shield, BookOpen, Users, Award } from 'lucide-react';

export default function RoleBadge({ roleKey }) {
  const role = ROLES[roleKey] || ROLES.LEARNER;

  const getBadgeStyle = () => {
    switch (roleKey) {
      case 'ADMIN': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'INSTRUCTOR': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'TRAINER': return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'LEARNER':
      default: return 'bg-sky-100 text-sky-700 border-sky-200';
    }
  };

  const getIcon = () => {
    switch (roleKey) {
      case 'ADMIN': return <Shield className="w-3.5 h-3.5" />;
      case 'INSTRUCTOR': return <Users className="w-3.5 h-3.5" />;
      case 'TRAINER': return <Award className="w-3.5 h-3.5" />;
      case 'LEARNER':
      default: return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}>
      {getIcon()}
      {role.title}
    </span>
  );
}

import React from 'react';
import { ROLES } from '../context/AuthContext';
import { Shield, BookOpen, Users, Award } from 'lucide-react';

export default function RoleBadge({ roleKey }) {
  const role = ROLES[roleKey] || ROLES.LEARNER;

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
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${role.badgeColor}`}>
      {getIcon()}
      {role.title}
    </span>
  );
}

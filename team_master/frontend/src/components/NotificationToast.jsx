import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, Bell } from 'lucide-react';

export default function NotificationToast() {
  const { notification } = useAuth();

  if (!notification) return null;

  const getStyle = () => {
    switch (notification.type) {
      case 'success': return 'bg-emerald-50 border-emerald-300 text-emerald-900';
      case 'warning': return 'bg-orange-50 border-orange-300 text-orange-900';
      case 'error': return 'bg-rose-50 border-rose-300 text-rose-900';
      case 'info':
      default: return 'bg-sky-50 border-sky-300 text-sky-900';
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case 'info':
      default: return <Info className="w-4 h-4 text-sky-600" />;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-fade-in max-w-md">
      <div className={`p-4 rounded-2xl border shadow-2xl flex items-center gap-3 text-xs font-semibold ${getStyle()}`}>
        {getIcon()}
        <span>{notification.message}</span>
      </div>
    </div>
  );
}

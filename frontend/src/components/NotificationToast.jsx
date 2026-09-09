import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast() {
  const { toastMessage } = useAuth();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  const getIcon = () => {
    switch (type) {
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'info': return <Info className="w-5 h-5 text-blue-400" />;
      case 'success':
      default: return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'error': return 'border-red-500/40 bg-red-950/80';
      case 'info': return 'border-blue-500/40 bg-blue-950/80';
      case 'success':
      default: return 'border-emerald-500/40 bg-emerald-950/80';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-md">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${getBorderColor()}`}>
        {getIcon()}
        <p className="text-sm font-medium text-slate-100 flex-1">{message}</p>
      </div>
    </div>
  );
}

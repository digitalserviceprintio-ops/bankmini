import React from 'react';
import { useSavings } from '../context/SavingsContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useSavings();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] w-80 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
        {toastMessage.type === 'warning' ? (
          <AlertCircle className="w-5 h-5 text-amber-400" />
        ) : toastMessage.type === 'info' ? (
          <Info className="w-5 h-5 text-sky-400" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        )}
      </div>
      <p className="text-xs font-medium text-slate-100 flex-1 leading-snug">
        {toastMessage.text}
      </p>
    </div>
  );
};

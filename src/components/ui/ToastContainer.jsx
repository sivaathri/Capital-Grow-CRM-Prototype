import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 z-50 flex flex-col gap-2 sm:max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-lg border-l-4 transition-all duration-200 ${
            t.type === 'err'
              ? 'bg-cg-navy text-white border-red-500'
              : 'bg-cg-navy text-white border-cg-orange'
          }`}
        >
          <div className="flex items-center gap-2.5 text-sm font-medium">
            {t.type === 'err' ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
            )}
            <span>{t.message}</span>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};


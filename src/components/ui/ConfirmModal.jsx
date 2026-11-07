import React from 'react';
import { useApp } from '../../context/AppContext';

export const ConfirmModal = () => {
  const { modal } = useApp();

  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cg-navy/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-cg-border">
        <h3 className="text-lg font-bold text-cg-navy">{modal.title}</h3>
        <p className="text-sm text-cg-muted mt-2 mb-6">{modal.message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={modal.onCancel}
            className="px-4 py-2 text-sm font-semibold text-cg-text bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={modal.onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cg-orange to-cg-orange-hover hover:brightness-95 rounded-xl shadow-orange transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};


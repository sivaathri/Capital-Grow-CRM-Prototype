import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '../ui/ToastContainer';
import { ConfirmModal } from '../ui/ConfirmModal';

export const Shell = ({ children }) => {
  const { isSidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-cg-bg flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-[76px]' : 'lg:ml-[272px]'
        }`}
      >
        <Topbar />
        <main className="flex-1 p-4 lg:p-8 max-w-full">
          {children}
        </main>
      </div>

      {/* Overlays */}
      <ToastContainer />
      <ConfirmModal />
    </div>
  );
};


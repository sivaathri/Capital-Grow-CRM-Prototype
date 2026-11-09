import React from 'react';
import { useApp } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { Shell } from './components/layout/Shell';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { EducationLoanPage } from './pages/EducationLoanPage';
import { LoginStatusPage } from './pages/LoginStatusPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

export const App = () => {
  const { user, route, navigate } = useApp();

  if (!user) {
    return <LoginPage />;
  }

  const isAdmin = Boolean(
    user?.role?.toLowerCase().includes('admin') ||
    user?.email?.toLowerCase().includes('admin')
  );

  const renderContent = () => {
    // Admin only pages protection
    if ((route.page === 'payments' || route.page === 'users') && !isAdmin) {
      return (
        <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl p-8 border border-cg-border shadow-card text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
            🔒
          </div>
          <h2 className="text-lg font-bold text-cg-navy">Access Restricted</h2>
          <p className="text-xs text-cg-muted leading-relaxed">
            The <b>Payments</b> and <b>User Management</b> modules are strictly restricted to Administrator accounts only. Your current role is <b>{user.role}</b>.
          </p>
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="px-4 py-2 bg-cg-blue text-white rounded-xl text-xs font-bold"
          >
            Back to Dashboard
          </button>
        </div>
      );
    }

    switch (route.page) {
      case 'dashboard':
        return <DashboardPage />;
      case 'customers':
        return <CustomersPage />;
      case 'education-loan':
      case 'enquiries':
        return <EducationLoanPage />;
      case 'login-status':
      case 'applications':
        return <LoginStatusPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'users':
        return <UserManagementPage />;
      default:
        return <PlaceholderPage pageId={route.page} />;
    }
  };

  return <Shell>{renderContent()}</Shell>;
};

export default App;


import React from 'react';
import { useApp } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { Shell } from './components/layout/Shell';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { EducationLoanPage } from './pages/EducationLoanPage';
import { LoginStatusPage } from './pages/LoginStatusPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

export const App = () => {
  const { user, route } = useApp();

  if (!user) {
    return <LoginPage />;
  }

  const renderContent = () => {
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
      default:
        return <PlaceholderPage pageId={route.page} />;
    }
  };

  return <Shell>{renderContent()}</Shell>;
};

export default App;


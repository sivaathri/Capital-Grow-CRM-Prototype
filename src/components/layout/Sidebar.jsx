import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Users,
  FileText,
  Landmark,
  Clock,
  CreditCard,
  BarChart3,
  Settings,
  ChevronDown,
  Building2,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'customers', label: 'Customers', icon: Users },
  {
    id: 'enquiries',
    label: 'Enquiries',
    icon: FileText,
    subItems: [
      { id: 'education-loan', label: 'Education Loan' },
      { id: 'insurance', label: 'Insurance Advisory' },
      { id: 'loans', label: 'Loans' }
    ]
  },
  { id: 'login-status', label: 'Login Status Details', icon: Building2 },
  { id: 'banks', label: 'Bank Management', icon: Landmark },
  { id: 'payments', label: 'Payments', icon: CreditCard, adminOnly: true },
  { id: 'users', label: 'User Management', icon: Users, adminOnly: true }
];

export const Sidebar = () => {
  const {
    user,
    route,
    navigate,
    customers,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileNavOpen,
    setIsMobileNavOpen
  } = useApp();

  const isAdmin = Boolean(
    user?.role?.toLowerCase().includes('admin') ||
    user?.email?.toLowerCase().includes('admin')
  );

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (item.adminOnly || item.id === 'payments' || item.id === 'users') {
      return isAdmin;
    }
    return true;
  });

  const loginCount = customers?.filter((c) => c.status === 'Login').length || 0;
  const paymentCount = customers?.filter((c) => c.status === 'Disbursement').length || 0;

  const [openSub, setOpenSub] = useState(() => {
    return route.page === 'education-loan' ||
      route.page === 'insurance' ||
      route.page === 'insurance-advisory' ||
      route.page === 'loans' ||
      route.page === 'Loans' ||
      route.page === 'enquiries'
      ? 'enquiries'
      : null;
  });

  useEffect(() => {
    if (
      route.page === 'insurance' ||
      route.page === 'insurance-advisory' ||
      route.page === 'loans' ||
      route.page === 'Loans' ||
      route.page === 'education-loan'
    ) {
      setOpenSub('enquiries');
    }
  }, [route.page]);

  const handleNavClick = (item) => {
    if (item.subItems) {
      if (isSidebarCollapsed) {
        setIsSidebarCollapsed(false);
        setOpenSub(item.id);
      } else {
        setOpenSub(openSub === item.id ? null : item.id);
      }
    } else {
      navigate(item.id);
      setIsMobileNavOpen(false);
    }
  };

  const isCurrentActive = (item) => {
    if (item.id === route.page) return true;
    if (
      item.subItems &&
      item.subItems.some((s) => {
        if (s.id === route.page) return true;
        if (s.id === 'loans' && (route.page === 'loans' || route.page === 'Loans')) return true;
        if (s.id === 'insurance' && (route.page === 'insurance' || route.page === 'insurance-advisory')) return true;
        return false;
      })
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-cg-navy/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white transition-all duration-300 ease-in-out border-r border-cg-border
          ${isSidebarCollapsed ? 'w-[76px]' : 'w-[272px]'}
          ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo header */}
        <div className="h-20 px-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigate('dashboard')}>
            <img
              src="/assets/logo.png"
              alt="Capital Grow"
              className={`object-contain transition-all duration-300 ${isSidebarCollapsed ? 'h-9 w-9' : 'max-h-12 w-auto'}`}
            />
          </div>
          <button
            className="lg:hidden p-1.5 text-cg-muted hover:text-cg-text rounded-lg"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto bg-gradient-to-b from-cg-navy to-cg-blue rounded-tr-3xl text-white">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item);
            const isSubOpen = openSub === item.id;

            return (
              <div key={item.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-left
                    ${active && !item.subItems
                      ? 'bg-gradient-to-r from-cg-orange to-cg-orange-hover text-white shadow-orange'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }
                    ${isSidebarCollapsed ? 'justify-center px-0' : ''}
                  `}
                  title={item.label}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isSidebarCollapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.id === 'login-status' && loginCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-cg-orange text-white shrink-0">
                          {loginCount}
                        </span>
                      )}
                      {item.id === 'payments' && paymentCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-white shrink-0">
                          {paymentCount}
                        </span>
                      )}
                      {item.subItems && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${isSubOpen ? 'rotate-180' : ''
                            }`}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Submenu */}
                {!isSidebarCollapsed && item.subItems && isSubOpen && (
                  <div className="pl-9 pr-2 py-1 space-y-1">
                    {item.subItems.map((sub) => {
                      const isSubActive =
                        route.page === sub.id ||
                        (sub.id === 'loans' && (route.page === 'loans' || route.page === 'Loans')) ||
                        (sub.id === 'insurance' && (route.page === 'insurance' || route.page === 'insurance-advisory'));

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            navigate(sub.id);
                            setIsMobileNavOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isSubActive
                              ? 'bg-white/20 text-white font-semibold'
                              : 'text-blue-100 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                          <span className="truncate">{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer art */}
        {!isSidebarCollapsed && (
          <div className="bg-cg-blue shrink-0 line-none overflow-hidden select-none" aria-hidden="true">
            <svg viewBox="0 0 260 120" className="w-full h-auto block">
              <path
                d="M0 120V70l14-8 10 10 10-18 10 14 12-24 10 20 14-10 8 12 10-8 12 14 16-8 12 10 24-16 18 12 22-6 14 8 14-4v40z"
                fill="#0866C6"
                opacity=".55"
              />
              <path d="M0 100C60 70 140 120 260 80v40H0z" fill="#FF7900" />
              <path d="M0 112C70 90 150 126 260 98v22H0z" fill="#fff" opacity=".9" />
              <g fill="#FF7900">
                <path d="M180 40l28-9 28 9-28 9z" />
                <path d="M194 46v12q14 6 28 0V46z" opacity=".85" />
              </g>
            </svg>
          </div>
        )}
      </aside>
    </>
  );
};


import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Search, Bell, Mail, ChevronDown, User, LogOut, Settings } from 'lucide-react';

export const Topbar = () => {
  const {
    user,
    logout,
    navigate,
    customers,
    followups,
    addToast,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    setIsMobileNavOpen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const searchResults = searchQuery.trim()
    ? customers
        .filter((c) =>
          (c.id + c.name + c.mobile + (c.email || '')).toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 lg:px-8 py-3 bg-cg-bg/90 backdrop-blur-md border-b border-cg-border">
      {/* Left: Burger / collapse buttons & search */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          type="button"
          onClick={() => {
            if (window.innerWidth >= 1024) {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            } else {
              setIsMobileNavOpen(true);
            }
          }}
          className="p-2 text-cg-navy hover:bg-white rounded-xl transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div ref={searchRef} className="relative flex-1">
          <div className="flex items-center gap-3 px-4 h-11 bg-white border border-cg-border rounded-xl shadow-card focus-within:border-cg-blue focus-within:ring-2 focus-within:ring-cg-blue/20 transition-all">
            <Search className="w-4 h-4 text-cg-muted shrink-0" />
            <input
              type="text"
              placeholder="Search by Customer ID, Name, Mobile, Email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full bg-transparent border-0 outline-none text-sm text-cg-text placeholder:text-cg-muted"
            />
          </div>

          {/* Search Dropdown */}
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-cg-border rounded-xl shadow-dropdown overflow-hidden max-h-80 overflow-y-auto z-50">
              {searchResults.length > 0 ? (
                searchResults.map((cust) => (
                  <button
                    key={cust.id}
                    type="button"
                    onClick={() => {
                      navigate('customers', cust.id);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex flex-col items-start px-4 py-2.5 text-left hover:bg-cg-light-blue border-b border-cg-border last:border-0 transition-colors"
                  >
                    <span className="text-sm font-semibold text-cg-navy">{cust.name}</span>
                    <span className="text-xs text-cg-muted">
                      {cust.id} · {cust.mobile} · {cust.type}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-cg-muted text-center">
                  No customers found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setHasNewNotifications(false);
            }}
            className="relative p-2.5 text-cg-navy hover:bg-white rounded-xl transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {hasNewNotifications && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-cg-orange rounded-full ring-2 ring-cg-bg" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-cg-border rounded-xl shadow-dropdown overflow-hidden z-50">
              <div className="px-4 py-3 bg-gray-50 border-b border-cg-border font-bold text-sm text-cg-navy">
                Scheduled Reminders & Follow-ups
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-cg-border">
                {followups.map((f) => (
                  <div key={f.id} className="p-3 hover:bg-gray-50 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
                      <span className="font-bold text-cg-navy">{f.time}</span>
                      <span className="text-cg-muted">· {f.name}</span>
                    </div>
                    <p className="mt-1 text-cg-text font-medium pl-4">{f.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message button */}
        <button
          type="button"
          onClick={() => addToast('No new messages', 'ok')}
          className="p-2.5 text-cg-navy hover:bg-white rounded-xl transition-colors"
          aria-label="Messages"
        >
          <Mail className="w-5 h-5" />
        </button>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 hover:bg-white rounded-xl transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full bg-cg-navy text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-cg-navy leading-tight">{user?.name || 'Admin'}</span>
              <span className="text-[11px] text-cg-muted">{user?.role || 'Super Admin'}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-cg-muted hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-cg-border rounded-xl shadow-dropdown overflow-hidden z-50 py-1">
              <button
                type="button"
                onClick={() => {
                  navigate('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-cg-text hover:bg-cg-light-blue transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-cg-muted" />
                <span>Settings</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


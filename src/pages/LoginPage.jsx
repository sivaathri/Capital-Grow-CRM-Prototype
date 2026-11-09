import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const { login, addToast } = useApp();
  const [username, setUsername] = useState('admin@capitalgrow.co.in');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both your email/username and password.');
      return;
    }

    const success = login(username, password, rememberMe);
    if (!success) {
      setError('Invalid username or password. Please use the demo credentials.');
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    addToast('Password reset is simulated. Use the demo credentials.', 'err');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Brand Banner */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-cg-navy via-cg-blue to-[#073B78] text-white relative overflow-hidden">
        <div className="relative z-10 max-w-lg mt-12">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Your students’ dreams, <span className="text-cg-orange">financed.</span>
          </h1>
          <p className="mt-4 text-lg text-blue-100 font-normal leading-relaxed">
            Education loans and overseas insurance for study-abroad families. Track every enquiry, bank application, and follow-up in one unified CRM.
          </p>

          <div className="flex flex-wrap gap-2 mt-8">
            {['USA 🇺🇸', 'UK 🇬🇧', 'Canada 🇨🇦', 'Australia 🇦🇺', 'Germany 🇩🇪', 'France 🇫🇷'].map((c) => (
              <span
                key={c}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-white border border-white/20"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative Graphic */}
        <div className="relative z-10 text-xs text-blue-200">
          Trusted by over 1,200+ students & education consultants nationwide.
        </div>

        {/* Background glow effects */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cg-orange/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Right Login Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-white">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <img src="/assets/logo.png" alt="Capital Grow Edu Loans" className="h-12 w-auto object-contain mb-6" />
            <h2 className="text-2xl font-bold text-cg-navy">Welcome back</h2>
            <p className="text-sm text-cg-muted mt-1">Sign in to continue to your CRM dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-xs font-bold text-cg-navy uppercase tracking-wider mb-2">
                Email or Username
              </label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@capitalgrow.co.in"
                className="w-full px-4 py-3 rounded-xl border border-cg-border text-sm text-cg-text focus:outline-none focus:border-cg-blue focus:ring-2 focus:ring-cg-blue/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-cg-navy uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-cg-border text-sm text-cg-text focus:outline-none focus:border-cg-blue focus:ring-2 focus:ring-cg-blue/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cg-muted hover:text-cg-text text-xs font-semibold flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-medium">
              <label className="flex items-center gap-2 cursor-pointer text-cg-text">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-cg-blue focus:ring-cg-blue border-cg-border cursor-pointer accent-cg-blue"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgot}
                className="text-cg-blue hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="p-3 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-cg-orange to-cg-orange-hover hover:brightness-95 shadow-orange transition-all duration-150 text-sm"
            >
              Log in
            </button>

            <div className="p-3.5 bg-cg-light-blue rounded-xl border border-blue-100 text-xs text-cg-blue space-y-2">
              <div className="font-bold text-center">Demo Quick Login Credentials:</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setUsername('admin@capitalgrow.co.in');
                    setPassword('Admin@123');
                  }}
                  className="p-2 bg-white rounded-lg border border-blue-200 text-left hover:bg-blue-50 transition-colors"
                >
                  <b className="block text-cg-navy font-bold">Admin (Full Access)</b>
                  <span className="text-[10px] text-cg-muted block truncate">admin@capitalgrow.co.in</span>
                  <span className="text-[10px] text-cg-blue font-bold">Admin@123</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUsername('user@capitalgrow.co.in');
                    setPassword('User@123');
                  }}
                  className="p-2 bg-white rounded-lg border border-blue-200 text-left hover:bg-blue-50 transition-colors"
                >
                  <b className="block text-cg-navy font-bold">User (Staff / Counselor)</b>
                  <span className="text-[10px] text-cg-muted block truncate">user@capitalgrow.co.in</span>
                  <span className="text-[10px] text-cg-blue font-bold">User@123</span>
                </button>
              </div>
              <div className="text-[10px] text-center text-cg-muted">
                (Click either box above to fill credentials instantly)
              </div>
            </div>

            <p className="text-center text-xs text-cg-muted mt-8">
              © {new Date().getFullYear()} Capital Grow Edu Loans. All rights reserved.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};


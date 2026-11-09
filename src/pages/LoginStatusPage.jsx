import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Filter,
  Eye,
  Edit2,
  FileCheck,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Percent,
  IndianRupee,
  UserCheck,
  Printer,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  BookOpen,
  Calendar,
  DollarSign,
  FileText,
  User,
  Users,
  Shield,
  ExternalLink,
  Award,
  Home
} from 'lucide-react';

const COMMON_BANKS = [
  'HDFC Credila',
  'State Bank of India (SBI)',
  'ICICI Bank',
  'Axis Bank',
  'Avanse Financial Services',
  'InCred Financial Services',
  'IDFC FIRST Bank',
  'Bank of Baroda',
  'Auxilo Finserve',
  'Punjab National Bank',
  'Tata Capital',
  'Union Bank of India',
  'Others'
];

export const LoginStatusPage = () => {
  const {
    customers,
    educationLoans,
    saveLoginDetails,
    declineLoan,
    sanctionLoan,
    navigate,
    addToast,
    simulateCall
  } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'disbursement', 'declined', 'all'
  const [bankFilter, setBankFilter] = useState('');

  // Modals state
  const [loginModal, setLoginModal] = useState({ isOpen: false, record: null });
  const [declineModal, setDeclineModal] = useState({ isOpen: false, record: null });
  const [sanctionModal, setSanctionModal] = useState({ isOpen: false, record: null });
  const [detailModal, setDetailModal] = useState({ isOpen: false, record: null });
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Form states for modals
  const [loginFormData, setLoginFormData] = useState({ bankName: '', smName: '', appNo: '' });
  const [declineFormData, setDeclineFormData] = useState({ notes: '' });
  const [sanctionFormData, setSanctionFormData] = useState({ loanAmount: '', interestRate: '' });
  const [selectedLeadId, setSelectedLeadId] = useState('');

  // Merge full student and academic enquiry data into customer login records
  const combinedRecords = customers
    .filter(
      (c) => c.status === 'Login' || c.status === 'Disbursement' || c.status === 'Declined' || c.bankName
    )
    .map((c) => {
      // Find corresponding education loan enquiry record if exists
      const edu = educationLoans.find(
        (e) =>
          e.mobile === c.mobile ||
          e.id === c.eduLoanId ||
          e.id === c.id ||
          (e.studentName && c.name && e.studentName.toLowerCase() === c.name.toLowerCase())
      );

      return {
        ...c,
        ...(edu || {}),
        // Preserve customer primary identifiers & status
        id: c.id,
        eduLoanId: edu?.id || c.eduLoanId || null,
        name: c.name || edu?.studentName,
        mobile: c.mobile || edu?.mobile,
        email: c.email || edu?.email,
        status: c.status || edu?.status || edu?.crmStatus,
        bankName: c.bankName || edu?.bankName,
        smName: c.smName || edu?.smName,
        appNo: c.appNo || edu?.appNo,
        loginDate: c.loginDate || edu?.loginDate || c.created,
        sanctionAmount: c.sanctionAmount || edu?.sanctionAmount,
        interestRate: c.interestRate || edu?.interestRate,
        sanctionDate: c.sanctionDate || edu?.sanctionDate,
        declineNotes: c.declineNotes || edu?.declineNotes,
        declineDate: c.declineDate || edu?.declineDate,
        bankPayout: c.bankPayout || edu?.bankPayout,
        customerPayout: c.customerPayout || edu?.customerPayout,
        vendorPayout: c.vendorPayout || edu?.vendorPayout,
        payoutStatus: c.payoutStatus || edu?.payoutStatus,
        payoutSavedAt: c.payoutSavedAt || edu?.payoutSavedAt,
        education: edu?.education || c.education || [],
        university: c.univ || edu?.university || 'University',
        courseName: c.course || edu?.courseName || 'Course',
        loanAmount: c.loanAmount || edu?.loanAmount || '₹ 40,00,000'
      };
    });

  // Available Leads that can be converted to Login
  const availableLeads = customers.filter(
    (c) => c.status === 'Lead' || c.status === 'Under Process' || (!c.status && !c.bankName)
  );

  // Filtered List
  const filteredRecords = combinedRecords.filter((rec) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      (
        rec.name +
        rec.mobile +
        (rec.bankName || '') +
        (rec.smName || '') +
        (rec.appNo || '') +
        (rec.courseName || '') +
        (rec.university || '') +
        (rec.id || '')
      )
        .toLowerCase()
        .includes(q);

    const matchesBank = !bankFilter || rec.bankName === bankFilter;

    let matchesTab = true;
    if (activeTab === 'login') matchesTab = rec.status === 'Login';
    else if (activeTab === 'disbursement') matchesTab = rec.status === 'Disbursement';
    else if (activeTab === 'declined') matchesTab = rec.status === 'Declined';

    return matchesSearch && matchesBank && matchesTab;
  });

  // KPI Metrics
  const loginCount = customers.filter((c) => c.status === 'Login').length;
  const disbursedCount = customers.filter((c) => c.status === 'Disbursement').length;
  const declinedCount = customers.filter((c) => c.status === 'Declined').length;

  // Handlers for Login Modal (Enter Bank Name, SM Name, App No)
  const openLoginModal = (record = null) => {
    if (record) {
      setLoginFormData({
        bankName: record.bankName || 'HDFC Credila',
        smName: record.smName || '',
        appNo: record.appNo || ''
      });
      setLoginModal({ isOpen: true, record });
    } else {
      setSelectedLeadId(availableLeads[0]?.id || '');
      setLoginFormData({
        bankName: 'HDFC Credila',
        smName: '',
        appNo: ''
      });
      setLoginModal({ isOpen: true, record: null });
    }
  };

  const handleSaveLogin = (e) => {
    e.preventDefault();
    if (!loginFormData.bankName.trim()) {
      addToast('Please specify Bank Name', 'error');
      return;
    }
    if (!loginFormData.smName.trim()) {
      addToast('Please enter SM Name (Sales Manager)', 'error');
      return;
    }
    if (!loginFormData.appNo.trim()) {
      addToast('Please enter Application Number (APP NO)', 'error');
      return;
    }

    const targetId = loginModal.record ? loginModal.record.id : selectedLeadId;
    if (!targetId) {
      addToast('Please select a customer/lead first', 'error');
      return;
    }

    saveLoginDetails(targetId, loginFormData);
    setLoginModal({ isOpen: false, record: null });
    // Also update detail modal record if it's currently open
    if (detailModal.isOpen && detailModal.record?.id === targetId) {
      setDetailModal((prev) => ({
        ...prev,
        record: {
          ...prev.record,
          ...loginFormData,
          status: 'Login',
          loginDate: new Date().toISOString().slice(0, 10)
        }
      }));
    }
  };

  // Handlers for Decline Modal (Enter Notes)
  const openDeclineModal = (record) => {
    setDeclineFormData({ notes: record.declineNotes || '' });
    setDeclineModal({ isOpen: true, record });
  };

  const handleSaveDecline = (e) => {
    e.preventDefault();
    if (!declineFormData.notes.trim()) {
      addToast('Please enter notes/reason for declining', 'error');
      return;
    }
    declineLoan(declineModal.record.id, declineFormData);
    setDeclineModal({ isOpen: false, record: null });
    if (detailModal.isOpen && detailModal.record?.id === declineModal.record.id) {
      setDetailModal((prev) => ({
        ...prev,
        record: {
          ...prev.record,
          status: 'Declined',
          declineNotes: declineFormData.notes,
          declineDate: new Date().toISOString().slice(0, 10)
        }
      }));
    }
  };

  // Handlers for Sanction Modal (Enter Loan Amount and Interest Rate -> moves to Disbursement)
  const openSanctionModal = (record) => {
    setSanctionFormData({
      loanAmount: record.sanctionAmount || record.loanAmount || '40,00,000',
      interestRate: record.interestRate || '9.85%'
    });
    setSanctionModal({ isOpen: true, record });
  };

  const handleSaveSanction = (e) => {
    e.preventDefault();
    if (!sanctionFormData.loanAmount) {
      addToast('Please enter Sanctioned Loan Amount', 'error');
      return;
    }
    if (!sanctionFormData.interestRate) {
      addToast('Please enter Interest Rate', 'error');
      return;
    }

    sanctionLoan(sanctionModal.record.id, sanctionFormData);
    setSanctionModal({ isOpen: false, record: null });
    if (detailModal.isOpen && detailModal.record?.id === sanctionModal.record.id) {
      setDetailModal((prev) => ({
        ...prev,
        record: {
          ...prev.record,
          status: 'Disbursement',
          sanctionAmount: String(sanctionFormData.loanAmount).startsWith('₹')
            ? sanctionFormData.loanAmount
            : `₹ ${sanctionFormData.loanAmount}`,
          interestRate: String(sanctionFormData.interestRate).includes('%')
            ? sanctionFormData.interestRate
            : `${sanctionFormData.interestRate}%`,
          sanctionDate: new Date().toISOString().slice(0, 10),
          payoutStatus: 'Pending'
        }
      }));
    }
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(parseFloat(val) || 0);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-cg-navy flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-cg-blue" />
            <span>Login Status Details</span>
          </h1>
          <p className="text-sm text-cg-muted mt-0.5">
            Bank Application Logins, SM Name mapping &amp; Application Tracking. Click any record to inspect all details.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => openLoginModal(null)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cg-orange to-cg-orange-hover text-white rounded-xl text-xs font-bold shadow-orange hover:brightness-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Move Lead to Login</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-cg-border shadow-card flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-cg-blue flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-cg-muted uppercase block">Active In Login</span>
            <div className="text-2xl font-black text-cg-navy">{loginCount}</div>
            <span className="text-[10px] text-cg-blue font-medium">Awaiting Sanction / Decision</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cg-border shadow-card flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-cg-muted uppercase block">Disbursement (End)</span>
            <div className="text-2xl font-black text-emerald-600">{disbursedCount}</div>
            <span className="text-[10px] text-emerald-700 font-medium">Sanctioned &gt; Payment Ready</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cg-border shadow-card flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-cg-muted uppercase block">Declined Applications</span>
            <div className="text-2xl font-black text-rose-600">{declinedCount}</div>
            <span className="text-[10px] text-rose-700 font-medium">With Rejection Notes</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cg-border shadow-card flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-orange-50 text-cg-orange flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-cg-muted uppercase block">Available Leads</span>
            <div className="text-2xl font-black text-cg-orange">{availableLeads.length}</div>
            <span className="text-[10px] text-cg-muted font-medium">Ready for Bank Login</span>
          </div>
        </div>
      </div>

      {/* Workflow Navigation Banner */}
      <div className="bg-gradient-to-r from-cg-navy via-cg-blue to-indigo-900 text-white rounded-2xl p-4 sm:p-5 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-300 uppercase tracking-wider">
              <span>Standard Loan Lifecycle</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/90">1. Enquiry Submit</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/90">2. Lead</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
              <span className="px-2.5 py-1 rounded-lg bg-cg-orange text-white shadow-orange">3. Login (Bank + SM + App No)</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/90">4. Sanction / Decline</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white">5. Disbursement &gt; Payments</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate('payments')}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-cg-navy rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors shadow-sm"
            >
              <span>Go to Payments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white rounded-2xl p-5 border border-cg-border shadow-card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tab buttons */}
          <div className="inline-flex bg-gray-100 p-1.5 rounded-xl gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-cg-navy shadow-sm'
                  : 'text-cg-muted hover:text-cg-text'
              }`}
            >
              In Login ({loginCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('disbursement')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'disbursement'
                  ? 'bg-white text-cg-navy shadow-sm'
                  : 'text-cg-muted hover:text-cg-text'
              }`}
            >
              Disbursement / Sanctioned ({disbursedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('declined')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'declined'
                  ? 'bg-white text-cg-navy shadow-sm'
                  : 'text-cg-muted hover:text-cg-text'
              }`}
            >
              Declined ({declinedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-cg-navy shadow-sm'
                  : 'text-cg-muted hover:text-cg-text'
              }`}
            >
              All Records ({combinedRecords.length})
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-cg-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student, bank, SM, app no..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-cg-border text-xs text-cg-text focus:outline-none focus:border-cg-blue"
              />
            </div>

            <select
              value={bankFilter}
              onChange={(e) => setBankFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-cg-border text-xs text-cg-text bg-white focus:outline-none focus:border-cg-blue"
            >
              <option value="">All Partner Banks</option>
              {COMMON_BANKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table of Records */}
        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-cg-border text-cg-muted font-bold uppercase tracking-wider">
                  <th className="py-3 px-3 w-8"></th>
                  <th className="py-3 px-3">Customer / Student</th>
                  <th className="py-3 px-3">Course &amp; University</th>
                  <th className="py-3 px-3">Bank Name</th>
                  <th className="py-3 px-3">SM Name</th>
                  <th className="py-3 px-3">APP NO</th>
                  <th className="py-3 px-3">Stage &amp; Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cg-border">
                {filteredRecords.map((item) => {
                  const isLogin = item.status === 'Login';
                  const isDisbursed = item.status === 'Disbursement';
                  const isDeclined = item.status === 'Declined';
                  const isExpanded = expandedRowId === item.id;

                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() => setDetailModal({ isOpen: true, record: item })}
                        className={`hover:bg-cg-light-blue/40 transition-colors cursor-pointer group ${
                          isExpanded ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        {/* Expand toggle */}
                        <td
                          className="py-3.5 px-2 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedRowId(isExpanded ? null : item.id);
                          }}
                        >
                          <button
                            type="button"
                            className="p-1 rounded text-cg-muted hover:text-cg-blue hover:bg-gray-100"
                            title={isExpanded ? 'Collapse preview' : 'Expand preview'}
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>

                        {/* Customer / Student */}
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-cg-navy text-sm group-hover:text-cg-blue flex items-center gap-1.5 transition-colors">
                            <span>{item.name}</span>
                            <Eye className="w-3.5 h-3.5 text-cg-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-[11px] text-cg-muted flex items-center gap-1.5 mt-0.5">
                            <span>{item.mobile}</span>
                            <span>•</span>
                            <span className="font-mono text-cg-blue">{item.id}</span>
                          </div>
                        </td>

                        {/* Course & University */}
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-cg-text max-w-[190px] truncate">
                            {item.courseName || item.course || 'Education Loan'}
                          </div>
                          <div className="text-[11px] text-cg-muted max-w-[190px] truncate mt-0.5">
                            {item.university || item.univ || item.country || '-'}
                          </div>
                        </td>

                        {/* Bank Name */}
                        <td className="py-3.5 px-3">
                          {item.bankName ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-cg-blue font-bold text-xs border border-blue-100">
                              <Building2 className="w-3.5 h-3.5 shrink-0" />
                              <span>{item.bankName}</span>
                            </div>
                          ) : (
                            <span className="text-cg-muted italic text-[11px]">Not assigned</span>
                          )}
                        </td>

                        {/* SM Name */}
                        <td className="py-3.5 px-3">
                          {item.smName ? (
                            <div className="font-semibold text-cg-navy flex items-center gap-1">
                              <UserCheck className="w-3.5 h-3.5 text-cg-muted shrink-0" />
                              <span>{item.smName}</span>
                            </div>
                          ) : (
                            <span className="text-cg-muted text-[11px]">-</span>
                          )}
                        </td>

                        {/* APP NO */}
                        <td className="py-3.5 px-3">
                          {item.appNo ? (
                            <span className="font-mono font-bold text-cg-navy px-2 py-0.5 bg-gray-100 rounded border border-gray-200 text-[11px]">
                              {item.appNo}
                            </span>
                          ) : (
                            <span className="text-cg-muted text-[11px]">-</span>
                          )}
                        </td>

                        {/* Stage & Status */}
                        <td className="py-3.5 px-3">
                          {isLogin && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-3 h-3" />
                              <span>In Login</span>
                            </span>
                          )}
                          {isDisbursed && (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Disbursement</span>
                              </span>
                              {item.sanctionAmount && (
                                <div className="text-[10px] text-emerald-700 font-bold">
                                  {item.sanctionAmount} @ {item.interestRate || 'ROI'}
                                </div>
                              )}
                            </div>
                          )}
                          {isDeclined && (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                <XCircle className="w-3 h-3" />
                                <span>Declined</span>
                              </span>
                              {item.declineNotes && (
                                <div className="text-[10px] text-rose-600 truncate max-w-[150px]" title={item.declineNotes}>
                                  {item.declineNotes}
                                </div>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Eye button for full details */}
                            <button
                              type="button"
                              onClick={() => setDetailModal({ isOpen: true, record: item })}
                              className="p-1.5 rounded-lg bg-blue-50 text-cg-blue hover:bg-blue-100 transition-colors shadow-sm"
                              title="View All Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {isLogin && (
                              <>
                                {/* Sanction button */}
                                <button
                                  type="button"
                                  onClick={() => openSanctionModal(item)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                                  title="Sanction loan and advance to Disbursement"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Sanction</span>
                                </button>

                                {/* Decline button */}
                                <button
                                  type="button"
                                  onClick={() => openDeclineModal(item)}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1 transition-all"
                                  title="Decline loan with notes"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Decline</span>
                                </button>

                                {/* Edit Login Info */}
                                <button
                                  type="button"
                                  onClick={() => openLoginModal(item)}
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-cg-navy transition-colors"
                                  title="Edit Bank, SM & App No"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}

                            {isDisbursed && (
                              <button
                                type="button"
                                onClick={() => navigate('payments')}
                                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cg-blue to-indigo-600 hover:brightness-105 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                              >
                                <span>Enter / View Payouts</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            {isDeclined && (
                              <button
                                type="button"
                                onClick={() => setDetailModal({ isOpen: true, record: item })}
                                className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-cg-navy text-xs font-semibold"
                              >
                                View Notes
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Inline Expandable Quick Preview Row */}
                      {isExpanded && (
                        <tr className="bg-blue-50/20 border-b border-cg-border">
                          <td colSpan={8} className="p-4">
                            <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm space-y-3 text-xs">
                              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <span className="font-bold text-cg-navy flex items-center gap-1.5">
                                  <FileText className="w-4 h-4 text-cg-blue" />
                                  Quick Record Summary for {item.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setDetailModal({ isOpen: true, record: item })}
                                  className="text-xs font-bold text-cg-blue hover:underline flex items-center gap-1"
                                >
                                  <span>View All Details in Modal</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                  <span className="text-[10px] text-cg-muted uppercase font-bold block">Contact</span>
                                  <span className="font-semibold text-cg-navy block">{item.mobile}</span>
                                  <span className="text-[11px] text-cg-muted truncate block">{item.email || '-'}</span>
                                </div>
                                <div className="p-2 bg-gray-50 rounded-lg">
                                  <span className="text-[10px] text-cg-muted uppercase font-bold block">Requested Loan</span>
                                  <span className="font-extrabold text-cg-orange block">{item.loanAmount}</span>
                                  <span className="text-[11px] text-cg-muted block">{item.country}</span>
                                </div>
                                <div className="p-2 bg-gray-50 rounded-lg">
                                  <span className="text-[10px] text-cg-muted uppercase font-bold block">Parents</span>
                                  <span className="font-semibold text-cg-navy block">Father: {item.fatherName || '-'}</span>
                                  <span className="text-[11px] text-cg-muted block">Mother: {item.motherName || '-'}</span>
                                </div>
                                <div className="p-2 bg-gray-50 rounded-lg">
                                  <span className="text-[10px] text-cg-muted uppercase font-bold block">Bank &amp; App</span>
                                  <span className="font-semibold text-cg-blue block">{item.bankName || 'Not Logged'}</span>
                                  <span className="text-[11px] text-cg-muted font-mono block">App: {item.appNo || '-'}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-cg-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-cg-navy mb-1">No Login records found in this view</h3>
            <p className="text-xs text-cg-muted mb-5 max-w-md mx-auto">
              Feed new enquiries to create leads, or click below to move any existing customer/lead to the Login stage.
            </p>
            <button
              type="button"
              onClick={() => openLoginModal(null)}
              className="px-4 py-2.5 bg-gradient-to-r from-cg-orange to-cg-orange-hover text-white rounded-xl text-xs font-bold shadow-orange"
            >
              + Move Lead to Login
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 0: FULL RECORD DETAILS (ALL DETAILS VIEW)           */}
      {/* ======================================================== */}
      {detailModal.isOpen && detailModal.record && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-cg-navy/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-6 max-h-[92vh] flex flex-col shadow-2xl border border-cg-border animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 border-b border-cg-border flex items-center justify-between shrink-0 bg-gradient-to-r from-cg-navy to-cg-blue text-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold text-lg border border-white/20">
                  {detailModal.record.name?.[0] || 'C'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{detailModal.record.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wide bg-cg-orange text-white">
                      {detailModal.record.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 mt-0.5">
                    Customer ID: <b className="font-mono">{detailModal.record.id}</b>
                    {detailModal.record.eduLoanId && ` • Enquiry ID: ${detailModal.record.eduLoanId}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDetailModal({ isOpen: false, record: null })}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable with all details */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs text-cg-text">
              {/* SECTION 1: Bank Login & Stage Processing Status */}
              <div className="bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 rounded-2xl p-4 border border-blue-200 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
                  <span className="text-xs font-bold text-cg-navy uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cg-blue" />
                    1. Bank Login &amp; Processing Details
                  </span>
                  <span className="text-[11px] font-semibold text-cg-blue">
                    Logged: {detailModal.record.loginDate || detailModal.record.created || 'Recently'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Bank Name</span>
                    <b className="text-sm text-cg-navy font-bold block mt-0.5">
                      {detailModal.record.bankName || 'Not Assigned'}
                    </b>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Sales Manager (SM)</span>
                    <b className="text-sm text-cg-navy font-bold block mt-0.5">
                      {detailModal.record.smName || '-'}
                    </b>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">APP NO (Bank Ref)</span>
                    <b className="text-sm text-cg-navy font-mono font-bold block mt-0.5">
                      {detailModal.record.appNo || '-'}
                    </b>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Current Stage</span>
                    <b
                      className={`text-sm font-bold block mt-0.5 ${
                        detailModal.record.status === 'Disbursement'
                          ? 'text-emerald-700'
                          : detailModal.record.status === 'Declined'
                          ? 'text-rose-600'
                          : 'text-amber-700'
                      }`}
                    >
                      {detailModal.record.status}
                    </b>
                  </div>
                </div>

                {/* If Sanctioned / Disbursement */}
                {detailModal.record.status === 'Disbursement' && (
                  <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Sanctioned Loan Information
                      </span>
                      {detailModal.record.sanctionDate && (
                        <span className="text-[11px] text-emerald-800">
                          Sanction Date: <b>{detailModal.record.sanctionDate}</b>
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                      <div>
                        <span className="text-[10px] text-emerald-800 uppercase font-bold block">Sanctioned Amount</span>
                        <b className="text-base text-emerald-900 font-black">
                          {detailModal.record.sanctionAmount || detailModal.record.loanAmount}
                        </b>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-800 uppercase font-bold block">Interest Rate (ROI)</span>
                        <b className="text-base text-emerald-900 font-black">
                          {detailModal.record.interestRate || 'Standard Bank Rate'}
                        </b>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-800 uppercase font-bold block">Payment Status</span>
                        <b className="text-xs text-emerald-800 font-bold block mt-1">
                          {detailModal.record.payoutStatus === 'Saved' ? '✓ Payouts Settled' : 'Pending Payout Entry'}
                        </b>
                      </div>
                    </div>

                    {/* Show saved payouts if entered */}
                    {detailModal.record.payoutStatus === 'Saved' && (
                      <div className="mt-2 pt-2 border-t border-emerald-200/80 grid grid-cols-4 gap-2 text-[11px]">
                        <div>
                          <span className="text-cg-muted block font-semibold">1. Bank Payout:</span>
                          <b className="text-cg-blue">{formatINR(detailModal.record.bankPayout)}</b>
                        </div>
                        <div>
                          <span className="text-cg-muted block font-semibold">2. Customer Payout:</span>
                          <b className="text-amber-700">(-) {formatINR(detailModal.record.customerPayout)}</b>
                        </div>
                        <div>
                          <span className="text-cg-muted block font-semibold">3. Vendor Payout:</span>
                          <b className="text-purple-700">(-) {formatINR(detailModal.record.vendorPayout)}</b>
                        </div>
                        <div>
                          <span className="text-cg-muted block font-semibold">Net Retained Profit:</span>
                          <b className="text-emerald-800 font-black">
                            {formatINR(
                              (parseFloat(detailModal.record.bankPayout) || 0) -
                                (parseFloat(detailModal.record.customerPayout) || 0) -
                                (parseFloat(detailModal.record.vendorPayout) || 0)
                            )}
                          </b>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* If Declined */}
                {detailModal.record.status === 'Declined' && (
                  <div className="bg-rose-50 rounded-xl p-3.5 border border-rose-200 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-900">
                      <span className="flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        Decline Notes &amp; Reason
                      </span>
                      {detailModal.record.declineDate && (
                        <span className="text-[11px] font-normal text-rose-800">
                          Date: {detailModal.record.declineDate}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-rose-800 leading-relaxed pt-1">
                      {detailModal.record.declineNotes || 'No specific decline remarks entered.'}
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION 2: Course & Target Institution Details */}
              <div className="bg-white rounded-2xl p-4 border border-cg-border space-y-3 shadow-card">
                <span className="text-xs font-bold text-cg-navy uppercase tracking-wider flex items-center gap-2 border-b border-cg-border pb-2">
                  <GraduationCap className="w-4 h-4 text-cg-orange" />
                  2. Target Institution &amp; Overseas Course
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Target Country</span>
                    <b className="text-cg-navy text-xs font-bold block">{detailModal.record.country || 'USA'}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">University / College</span>
                    <b className="text-cg-navy text-xs font-bold block">{detailModal.record.university || '-'}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Course Name</span>
                    <b className="text-cg-navy text-xs font-bold block">{detailModal.record.courseName || '-'}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Course Duration</span>
                    <b className="text-cg-navy text-xs font-bold block">{detailModal.record.courseDuration || '2 Years'}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Admission Status</span>
                    <b className="text-cg-navy text-xs font-bold block">{detailModal.record.admissionStatus || detailModal.record.adm || 'Offer Received'}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Requested Loan</span>
                    <b className="text-cg-orange text-sm font-extrabold block">{detailModal.record.loanAmount || '-'}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Consultancy / Partner</span>
                    <b className="text-cg-navy text-xs font-bold block">{detailModal.record.consultancyName || detailModal.record.refName || 'Direct'}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Lead Source</span>
                    <b className="text-cg-navy text-xs font-bold block">{detailModal.record.src || 'Referral'}</b>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Student Personal & Contact Details */}
              <div className="bg-white rounded-2xl p-4 border border-cg-border space-y-3 shadow-card">
                <span className="text-xs font-bold text-cg-navy uppercase tracking-wider flex items-center gap-2 border-b border-cg-border pb-2">
                  <User className="w-4 h-4 text-cg-blue" />
                  3. Student Personal, Family &amp; Residential Details
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Student Full Name</span>
                    <b className="text-cg-navy text-xs font-bold block">{detailModal.record.name}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Mobile Phone</span>
                    <b className="text-cg-navy text-xs font-bold flex items-center gap-1">
                      <span>{detailModal.record.mobile}</span>
                      <button
                        type="button"
                        onClick={() => simulateCall(detailModal.record.name)}
                        className="p-1 rounded bg-blue-50 text-cg-blue hover:bg-blue-100"
                        title="Simulate call"
                      >
                        <Phone className="w-3 h-3" />
                      </button>
                    </b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Email Address</span>
                    <b className="text-cg-navy text-xs font-bold block truncate">{detailModal.record.email || '-'}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Date of Birth</span>
                    <b className="text-cg-navy text-xs font-bold block">{detailModal.record.dob || '-'}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Father's Name</span>
                    <b className="text-cg-navy text-xs font-bold block">{detailModal.record.fatherName || '-'}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Mother's Name</span>
                    <b className="text-cg-navy text-xs font-bold block">{detailModal.record.motherName || '-'}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Gender &amp; Marital</span>
                    <b className="text-cg-navy text-xs font-bold block">
                      {detailModal.record.gender || 'Male'} • {detailModal.record.maritalStatus || 'Single'}
                    </b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Residence Type</span>
                    <b className="text-cg-navy text-xs font-bold block">
                      {detailModal.record.residenceType || 'Self Owned'}
                      {detailModal.record.monthlyRent ? ` (Rent: ₹${detailModal.record.monthlyRent})` : ''}
                    </b>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Current Address</span>
                    <p className="text-xs text-cg-navy">
                      {detailModal.record.currentAddress || detailModal.record.address || '-'}
                      {detailModal.record.currentPincode || detailModal.record.pin ? ` - ${detailModal.record.currentPincode || detailModal.record.pin}` : ''}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Permanent Address</span>
                    <p className="text-xs text-cg-navy">
                      {detailModal.record.permAddress || detailModal.record.currentAddress || detailModal.record.address || '-'}
                      {detailModal.record.permPincode ? ` - ${detailModal.record.permPincode}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Academic Background & Test Scores */}
              <div className="bg-white rounded-2xl p-4 border border-cg-border space-y-3 shadow-card">
                <span className="text-xs font-bold text-cg-navy uppercase tracking-wider flex items-center gap-2 border-b border-cg-border pb-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  4. Academic Qualification History &amp; Test Scores
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-2">
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Primary Degree</span>
                    <b className="text-cg-navy text-xs font-bold block">{detailModal.record.degreeA || detailModal.record.highest || '-'}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Secondary Degree / Minor</span>
                    <b className="text-cg-navy text-xs font-bold block">{detailModal.record.degreeB || '-'}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Entrance Exam</span>
                    <b className="text-cg-navy text-xs font-bold block">{detailModal.record.entranceTest || 'None'}</b>
                  </div>
                  <div>
                    <span className="text-[10px] text-cg-muted font-bold uppercase block">Exam Score Breakdown</span>
                    <b className="text-cg-blue text-xs font-bold block">{detailModal.record.entranceScore || '-'}</b>
                  </div>
                </div>

                {/* Academic qualification table */}
                {detailModal.record.education && detailModal.record.education.length > 0 && (
                  <div className="border border-cg-border rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100 font-bold text-cg-navy">
                        <tr>
                          <th className="p-2">Exam / Qualification</th>
                          <th className="p-2">Passing Year</th>
                          <th className="p-2">Marks / CGPA</th>
                          <th className="p-2">School / University / Board</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cg-border">
                        {detailModal.record.education.map((edu, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="p-2 font-bold text-cg-navy">{edu.exam || '-'}</td>
                            <td className="p-2 text-cg-muted">{edu.year || '-'}</td>
                            <td className="p-2 font-bold text-cg-blue">{edu.marks || '-'}</td>
                            <td className="p-2 text-cg-navy">{edu.school || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* SECTION 5: Counselor & Remarks */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-cg-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-cg-muted font-bold uppercase block">Assigned Counselor</span>
                  <b className="text-cg-navy font-bold">{detailModal.record.emp || 'Staff'}</b>
                </div>
                <div>
                  <span className="text-[10px] text-cg-muted font-bold uppercase block">Next Follow-up</span>
                  <b className="text-cg-navy font-bold">{detailModal.record.followup || '-'}</b>
                </div>
                <div>
                  <span className="text-[10px] text-cg-muted font-bold uppercase block">Remarks / Notes</span>
                  <p className="text-cg-muted">{detailModal.record.remarks || '-'}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-gray-50 border-t border-cg-border flex flex-wrap items-center justify-between gap-3 shrink-0 rounded-b-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cg-muted">Quick Actions:</span>
                {detailModal.record.status === 'Login' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        openSanctionModal(detailModal.record);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sanction Loan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        openDeclineModal(detailModal.record);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Decline Loan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        openLoginModal(detailModal.record);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white text-cg-navy border border-cg-border font-bold text-xs flex items-center gap-1 hover:bg-gray-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Bank / SM</span>
                    </button>
                  </>
                )}

                {detailModal.record.status === 'Disbursement' && (
                  <button
                    type="button"
                    onClick={() => {
                      setDetailModal({ isOpen: false, record: null });
                      navigate('payments');
                    }}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cg-blue to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Manage Payouts in Payments</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {detailModal.record.status === 'Declined' && (
                  <button
                    type="button"
                    onClick={() => {
                      openLoginModal(detailModal.record);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cg-blue text-white font-bold text-xs"
                  >
                    Re-login to Another Bank
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setDetailModal({ isOpen: false, record: null })}
                className="px-5 py-2 rounded-xl text-xs font-bold text-cg-navy bg-white hover:bg-gray-100 border border-cg-border shadow-sm"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: Login Details (Bank Name, SM Name, APP NO)     */}
      {/* ======================================================== */}
      {loginModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cg-navy/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-cg-border space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-cg-border pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cg-blue" />
                <h3 className="text-base font-bold text-cg-navy">
                  {loginModal.record ? `Login Details for ${loginModal.record.name}` : 'Move Lead to Bank Login'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLoginModal({ isOpen: false, record: null })}
                className="text-cg-muted hover:text-cg-text font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLogin} className="space-y-4">
              {/* Select Customer / Lead if creating fresh */}
              {!loginModal.record && (
                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1">
                    Select Customer / Lead <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-text bg-white focus:outline-none focus:border-cg-blue font-medium"
                  >
                    {availableLeads.map((lead) => (
                      <option key={lead.id} value={lead.id}>
                        {lead.name} ({lead.mobile}) - {lead.course || lead.type}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Input 1: Bank Name */}
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <select
                    value={loginFormData.bankName}
                    onChange={(e) => setLoginFormData((prev) => ({ ...prev, bankName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-text bg-white focus:outline-none focus:border-cg-blue font-medium"
                  >
                    {COMMON_BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  {loginFormData.bankName === 'Others' && (
                    <input
                      type="text"
                      placeholder="Enter other bank name"
                      onChange={(e) => setLoginFormData((prev) => ({ ...prev, bankName: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-cg-border text-xs text-cg-text focus:outline-none focus:border-cg-blue"
                    />
                  )}
                </div>
              </div>

              {/* Input 2: SM Name */}
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1">
                  SM Name (Sales Manager Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={loginFormData.smName}
                  onChange={(e) => setLoginFormData((prev) => ({ ...prev, smName: e.target.value }))}
                  placeholder="e.g. Rajesh Kumar, Anand Sharma, Suresh Iyer"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-text focus:outline-none focus:border-cg-blue font-medium"
                />
              </div>

              {/* Input 3: APP NO */}
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1">
                  APP NO (Bank Application / File Reference Number) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={loginFormData.appNo}
                  onChange={(e) => setLoginFormData((prev) => ({ ...prev, appNo: e.target.value }))}
                  placeholder="e.g. CRED-2026-88192 or SBI-EL-44821"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs font-mono text-cg-text focus:outline-none focus:border-cg-blue font-bold"
                />
              </div>

              <div className="bg-blue-50/70 rounded-xl p-3 border border-blue-100 text-[11px] text-cg-muted">
                Saving will set this customer's status to <b>Login</b>. From there, you will be able to Sanction or Decline the application.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setLoginModal({ isOpen: false, record: null })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-cg-muted hover:text-cg-text border border-cg-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-cg-blue hover:bg-cg-blue/90 shadow-sm"
                >
                  Save Login Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: Decline Modal (Enter Notes)                     */}
      {/* ======================================================== */}
      {declineModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cg-navy/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-cg-border space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-cg-border pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <XCircle className="w-5 h-5" />
                <h3 className="text-base font-bold text-cg-navy">Decline Application</h3>
              </div>
              <button
                type="button"
                onClick={() => setDeclineModal({ isOpen: false, record: null })}
                className="text-cg-muted hover:text-cg-text font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-rose-50/70 rounded-xl p-3 border border-rose-100 text-xs">
              <span className="font-bold text-cg-navy block">{declineModal.record?.name}</span>
              <span className="text-[11px] text-cg-muted">
                Bank: <b>{declineModal.record?.bankName}</b> • App No: <b>{declineModal.record?.appNo}</b>
              </span>
            </div>

            <form onSubmit={handleSaveDecline} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">
                  Decline Notes / Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={declineFormData.notes}
                  onChange={(e) => setDeclineFormData({ notes: e.target.value })}
                  placeholder="Enter detailed reason for loan decline (e.g. Low CIBIL score, collateral valuation deficit, co-applicant income irregular, university not recognized)..."
                  required
                  className="w-full p-3 rounded-xl border border-cg-border text-xs text-cg-text focus:outline-none focus:border-rose-500 leading-relaxed"
                />
              </div>

              {/* Quick Reason Chips */}
              <div>
                <span className="text-[10px] text-cg-muted font-bold uppercase block mb-1.5">Quick Reason Chips:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Low CIBIL score (<650)',
                    'Collateral valuation insufficient',
                    'Co-applicant income insufficient',
                    'University not in approved bank list',
                    'Student opted for alternative funding',
                    'Multiple EMI defaults on bureau'
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() =>
                        setDeclineFormData((prev) => ({
                          notes: prev.notes ? `${prev.notes}. ${chip}` : chip
                        }))
                      }
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-rose-50 text-[11px] text-cg-navy hover:text-rose-700 font-medium transition-colors border border-gray-200"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDeclineModal({ isOpen: false, record: null })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-cg-muted hover:text-cg-text border border-cg-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm"
                >
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: Sanction Modal (Loan Amount & Interest Rate)    */}
      {/* ======================================================== */}
      {sanctionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cg-navy/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-cg-border space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-cg-border pb-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-base font-bold text-cg-navy">Sanction Loan Application</h3>
              </div>
              <button
                type="button"
                onClick={() => setSanctionModal({ isOpen: false, record: null })}
                className="text-cg-muted hover:text-cg-text font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-100 text-xs">
              <span className="font-bold text-cg-navy block">{sanctionModal.record?.name}</span>
              <span className="text-[11px] text-cg-muted">
                Bank: <b>{sanctionModal.record?.bankName}</b> • SM: <b>{sanctionModal.record?.smName}</b> • App No: <b>{sanctionModal.record?.appNo}</b>
              </span>
            </div>

            <form onSubmit={handleSaveSanction} className="space-y-4">
              {/* Input 1: Loan Amount */}
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1">
                  Sanctioned Loan Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cg-muted font-bold text-xs">₹</span>
                  <input
                    type="text"
                    value={sanctionFormData.loanAmount}
                    onChange={(e) => setSanctionFormData((prev) => ({ ...prev, loanAmount: e.target.value }))}
                    placeholder="e.g. 45,00,000"
                    required
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-cg-border text-xs font-bold text-cg-navy focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Input 2: Interest Rate */}
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1">
                  Interest Rate (ROI % p.a.) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Percent className="w-4 h-4 text-cg-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={sanctionFormData.interestRate}
                    onChange={(e) => setSanctionFormData((prev) => ({ ...prev, interestRate: e.target.value }))}
                    placeholder="e.g. 9.75%"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-cg-border text-xs font-bold text-cg-navy focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3.5 border border-emerald-200 text-xs space-y-1">
                <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Auto-advance to Disbursement stage
                </span>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Upon sanctioning, the record's status will change to <b>Disbursement</b> (the end option). It will immediately show up in the <b>Payments</b> menu to record Bank Payout, Customer Payout, and Vendor Payout.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSanctionModal({ isOpen: false, record: null })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-cg-muted hover:text-cg-text border border-cg-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                >
                  Sanction &amp; Move to Disbursement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

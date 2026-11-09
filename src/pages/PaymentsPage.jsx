import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Printer,
  Edit2,
  DollarSign,
  Building2,
  User,
  Users,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle,
  Percent,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const PaymentsPage = () => {
  const { customers, savePayoutDetails, addToast, navigate } = useApp();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [payoutFilter, setPayoutFilter] = useState('all'); // 'all', 'pending', 'saved'

  // Modal State for Entering / Editing the 3 payouts
  const [payoutModal, setPayoutModal] = useState({ isOpen: false, record: null });
  const [voucherModal, setVoucherModal] = useState({ isOpen: false, record: null });

  // 3 Inputs form state
  const [payoutForm, setPayoutForm] = useState({
    bankPayout: '',
    customerPayout: '',
    vendorPayout: '',
    payoutNotes: ''
  });

  // Get records that have reached "Disbursement" (the end option)
  const disbursedRecords = customers.filter(
    (c) => c.status === 'Disbursement' || c.crmStatus === 'Disbursement'
  );

  // Filtered records
  const filteredRecords = disbursedRecords.filter((rec) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      (rec.name + rec.mobile + (rec.bankName || '') + (rec.appNo || '') + (rec.smName || '')).toLowerCase().includes(q);

    let matchesStatus = true;
    if (payoutFilter === 'pending') {
      matchesStatus = rec.payoutStatus !== 'Saved';
    } else if (payoutFilter === 'saved') {
      matchesStatus = rec.payoutStatus === 'Saved';
    }

    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  let totalDisbursedAmountNum = 0;
  let totalBankPayout = 0;
  let totalCustomerPayout = 0;
  let totalVendorPayout = 0;

  disbursedRecords.forEach((r) => {
    // Clean loan amount string
    const loanNum = parseFloat(String(r.sanctionAmount || r.loanAmount || '0').replace(/[^0-9.]/g, '')) || 0;
    totalDisbursedAmountNum += loanNum;

    if (r.payoutStatus === 'Saved') {
      totalBankPayout += parseFloat(r.bankPayout) || 0;
      totalCustomerPayout += parseFloat(r.customerPayout) || 0;
      totalVendorPayout += parseFloat(r.vendorPayout) || 0;
    }
  });

  const totalNetMargin = totalBankPayout - totalCustomerPayout - totalVendorPayout;

  // Open modal to enter the 3 inputs
  const handleOpenPayoutModal = (record) => {
    setPayoutForm({
      bankPayout: record.bankPayout || '',
      customerPayout: record.customerPayout || '',
      vendorPayout: record.vendorPayout || '',
      payoutNotes: record.payoutNotes || ''
    });
    setPayoutModal({ isOpen: true, record });
  };

  // Live calculation inside modal
  const modalBankPayout = parseFloat(payoutForm.bankPayout) || 0;
  const modalCustomerPayout = parseFloat(payoutForm.customerPayout) || 0;
  const modalVendorPayout = parseFloat(payoutForm.vendorPayout) || 0;
  const modalNetProfit = modalBankPayout - modalCustomerPayout - modalVendorPayout;

  const handleSavePayouts = (e) => {
    e.preventDefault();
    if (!payoutForm.bankPayout && payoutForm.bankPayout !== '0') {
      addToast('Please enter Bank Payout amount', 'error');
      return;
    }
    if (!payoutForm.customerPayout && payoutForm.customerPayout !== '0') {
      addToast('Please enter Customer Payout amount', 'error');
      return;
    }
    if (!payoutForm.vendorPayout && payoutForm.vendorPayout !== '0') {
      addToast('Please enter Vendor Payout amount', 'error');
      return;
    }

    savePayoutDetails(payoutModal.record.id, payoutForm);
    setPayoutModal({ isOpen: false, record: null });
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-cg-navy flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-cg-orange" />
            <span>Payments &amp; Commission Settlement</span>
          </h1>
          <p className="text-sm text-cg-muted mt-0.5">
            Disbursed Loans Payout Registry: Enter Bank Payout, Customer Payout, and Vendor Payout for each record.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('login-status')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-cg-navy border border-cg-border rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Building2 className="w-4 h-4 text-cg-blue" />
            <span>Login Status Details</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-cg-border shadow-card space-y-1">
          <span className="text-[10px] font-bold text-cg-muted uppercase tracking-wider block">Disbursed Loans</span>
          <div className="text-2xl font-black text-cg-navy">{disbursedRecords.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">End stage reached</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cg-border shadow-card space-y-1">
          <span className="text-[10px] font-bold text-cg-muted uppercase tracking-wider block">Total Bank Payout</span>
          <div className="text-2xl font-black text-cg-blue">{formatINR(totalBankPayout)}</div>
          <span className="text-[11px] text-cg-muted">Gross Commission</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cg-border shadow-card space-y-1">
          <span className="text-[10px] font-bold text-cg-muted uppercase tracking-wider block">Customer Payout</span>
          <div className="text-2xl font-black text-amber-600">{formatINR(totalCustomerPayout)}</div>
          <span className="text-[11px] text-cg-muted">Rebates &amp; Subvention</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cg-border shadow-card space-y-1">
          <span className="text-[10px] font-bold text-cg-muted uppercase tracking-wider block">Vendor Payout</span>
          <div className="text-2xl font-black text-purple-600">{formatINR(totalVendorPayout)}</div>
          <span className="text-[11px] text-cg-muted">Consultancy Referral</span>
        </div>

        <div className="bg-gradient-to-br from-cg-navy to-cg-blue text-white p-4 rounded-2xl shadow-card space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[10px] font-bold text-orange-300 uppercase tracking-wider block">Net Retained Profit</span>
          <div className="text-2xl font-black text-white">{formatINR(totalNetMargin)}</div>
          <span className="text-[11px] text-emerald-300 font-semibold">Company Margin</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl p-5 border border-cg-border shadow-card space-y-4">
        {/* Sub-header & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex bg-gray-100 p-1.5 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setPayoutFilter('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                payoutFilter === 'all'
                  ? 'bg-white text-cg-navy shadow-sm'
                  : 'text-cg-muted hover:text-cg-text'
              }`}
            >
              All Disbursed ({disbursedRecords.length})
            </button>
            <button
              type="button"
              onClick={() => setPayoutFilter('pending')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                payoutFilter === 'pending'
                  ? 'bg-white text-cg-navy shadow-sm'
                  : 'text-cg-muted hover:text-cg-text'
              }`}
            >
              Pending Payouts ({disbursedRecords.filter((r) => r.payoutStatus !== 'Saved').length})
            </button>
            <button
              type="button"
              onClick={() => setPayoutFilter('saved')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                payoutFilter === 'saved'
                  ? 'bg-white text-cg-navy shadow-sm'
                  : 'text-cg-muted hover:text-cg-text'
              }`}
            >
              Payout Saved ({disbursedRecords.filter((r) => r.payoutStatus === 'Saved').length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-cg-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customer, bank, app no..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-cg-border text-xs text-cg-text focus:outline-none focus:border-cg-blue"
            />
          </div>
        </div>

        {/* Records Table */}
        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-cg-border text-cg-muted font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Disbursed Customer</th>
                  <th className="py-3 px-3">Bank &amp; App No</th>
                  <th className="py-3 px-3">Loan &amp; ROI</th>
                  <th className="py-3 px-3">Bank Payout</th>
                  <th className="py-3 px-3">Customer Payout</th>
                  <th className="py-3 px-3">Vendor Payout</th>
                  <th className="py-3 px-3">Net Profit</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cg-border">
                {filteredRecords.map((item) => {
                  const isSaved = item.payoutStatus === 'Saved';
                  const bankVal = parseFloat(item.bankPayout) || 0;
                  const custVal = parseFloat(item.customerPayout) || 0;
                  const vendVal = parseFloat(item.vendorPayout) || 0;
                  const netVal = bankVal - custVal - vendVal;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleOpenPayoutModal(item)}
                      className="hover:bg-cg-light-blue/40 transition-colors cursor-pointer group"
                    >
                      {/* Customer Info */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-cg-navy text-sm group-hover:text-cg-blue transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-cg-muted flex items-center gap-1.5 mt-0.5">
                          <span>{item.mobile}</span>
                          <span>•</span>
                          <span className="font-mono text-cg-blue">{item.id}</span>
                        </div>
                      </td>

                      {/* Bank & App No */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-cg-navy flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-cg-blue shrink-0" />
                          <span>{item.bankName || 'Partner Bank'}</span>
                        </div>
                        <div className="text-[11px] text-cg-muted font-mono mt-0.5">
                          App #{item.appNo || 'Pending'}
                        </div>
                      </td>

                      {/* Loan Amount & ROI */}
                      <td className="py-3.5 px-3">
                        <div className="font-extrabold text-cg-navy">
                          {item.sanctionAmount || item.loanAmount || '-'}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                          ROI: {item.interestRate || 'Standard'}
                        </div>
                      </td>

                      {/* Input 1: Bank Payout */}
                      <td className="py-3.5 px-3">
                        {isSaved ? (
                          <span className="font-bold text-cg-blue">{formatINR(bankVal)}</span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Input 2: Customer Payout */}
                      <td className="py-3.5 px-3">
                        {isSaved ? (
                          <span className="font-semibold text-amber-700">{formatINR(custVal)}</span>
                        ) : (
                          <span className="text-cg-muted text-[11px]">-</span>
                        )}
                      </td>

                      {/* Input 3: Vendor Payout */}
                      <td className="py-3.5 px-3">
                        {isSaved ? (
                          <span className="font-semibold text-purple-700">{formatINR(vendVal)}</span>
                        ) : (
                          <span className="text-cg-muted text-[11px]">-</span>
                        )}
                      </td>

                      {/* Net Margin */}
                      <td className="py-3.5 px-3">
                        {isSaved ? (
                          <span
                            className={`font-black ${
                              netVal >= 0 ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {formatINR(netVal)}
                          </span>
                        ) : (
                          <span className="text-cg-muted text-[11px]">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenPayoutModal(item)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 ${
                              isSaved
                                ? 'bg-gray-100 hover:bg-gray-200 text-cg-navy'
                                : 'bg-gradient-to-r from-cg-orange to-cg-orange-hover text-white shadow-orange'
                            }`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>{isSaved ? 'Edit Payouts' : 'Enter 3 Payouts'}</span>
                          </button>

                          {isSaved && (
                            <button
                              type="button"
                              onClick={() => setVoucherModal({ isOpen: true, record: item })}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-cg-blue transition-colors"
                              title="Print Payout Voucher"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-cg-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-cg-navy mb-1">No Disbursed Loan records found</h3>
            <p className="text-xs text-cg-muted mb-5 max-w-md mx-auto">
              Records reach this Payment menu automatically when a loan application in <b>Login Status Details</b> is Sanctioned and moved to <b>Disbursement</b> (the end option).
            </p>
            <button
              type="button"
              onClick={() => navigate('login-status')}
              className="px-4 py-2.5 bg-cg-blue text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Open Login Status Details
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: Enter 3 Payouts (Bank, Customer, Vendor)          */}
      {/* ======================================================== */}
      {payoutModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cg-navy/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-cg-border space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-cg-border pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cg-orange" />
                <h3 className="text-base font-bold text-cg-navy">
                  Payout Details for {payoutModal.record?.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPayoutModal({ isOpen: false, record: null })}
                className="text-cg-muted hover:text-cg-text font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Customer & Loan Overview Card */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl p-3.5 border border-cg-border grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <span className="text-[10px] text-cg-muted font-bold uppercase block">Bank &amp; App No</span>
                <span className="font-bold text-cg-navy">
                  {payoutModal.record?.bankName} ({payoutModal.record?.appNo})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-cg-muted font-bold uppercase block">Sanctioned Loan</span>
                <span className="font-bold text-cg-orange">
                  {payoutModal.record?.sanctionAmount || payoutModal.record?.loanAmount}
                </span>
                <span className="text-[10px] text-cg-muted ml-1">@ {payoutModal.record?.interestRate}</span>
              </div>
            </div>

            <form onSubmit={handleSavePayouts} className="space-y-4">
              <div className="text-xs font-semibold text-cg-navy flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cg-orange" />
                <span>Enter the 3 Payout inputs:</span>
              </div>

              {/* INPUT 1: Bank Payout */}
              <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-cg-navy">
                    1. Bank Payout (₹) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-cg-blue font-semibold uppercase">Gross Bank Commission</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cg-blue font-bold text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={payoutForm.bankPayout}
                    onChange={(e) => setPayoutForm((prev) => ({ ...prev, bankPayout: e.target.value }))}
                    placeholder="e.g. 48000"
                    required
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-cg-border text-sm font-bold text-cg-navy focus:outline-none focus:border-cg-blue bg-white"
                  />
                </div>
                <span className="text-[10px] text-cg-muted block">
                  Commission earned from bank or NBFC for processing this loan.
                </span>
              </div>

              {/* INPUT 2: Customer Payout */}
              <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/40 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-cg-navy">
                    2. Customer Payout (₹) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-amber-700 font-semibold uppercase">Rebate / Cashback</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-700 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={payoutForm.customerPayout}
                    onChange={(e) => setPayoutForm((prev) => ({ ...prev, customerPayout: e.target.value }))}
                    placeholder="e.g. 10000"
                    required
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-cg-border text-sm font-bold text-cg-navy focus:outline-none focus:border-amber-500 bg-white"
                  />
                </div>
                <span className="text-[10px] text-cg-muted block">
                  Subvention, interest subsidy, or direct cashback provided to the student/customer.
                </span>
              </div>

              {/* INPUT 3: Vendor Payout */}
              <div className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/40 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-cg-navy">
                    3. Vendor Payout (₹) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-purple-700 font-semibold uppercase">Consultancy / Partner</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-700 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={payoutForm.vendorPayout}
                    onChange={(e) => setPayoutForm((prev) => ({ ...prev, vendorPayout: e.target.value }))}
                    placeholder="e.g. 15000"
                    required
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-cg-border text-sm font-bold text-cg-navy focus:outline-none focus:border-purple-500 bg-white"
                  />
                </div>
                <span className="text-[10px] text-cg-muted block">
                  Referral payout given to overseas education consultant, lead source, or vendor.
                </span>
              </div>

              {/* Live Net Profit Summary */}
              <div className="bg-gradient-to-r from-cg-navy to-cg-blue text-white rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                  <span className="text-white/80">Calculation:</span>
                  <span className="font-mono text-xs">
                    {formatINR(modalBankPayout)} - {formatINR(modalCustomerPayout)} - {formatINR(modalVendorPayout)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-300">Net Retained Margin:</span>
                  <span
                    className={`text-lg font-black ${
                      modalNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatINR(modalNetProfit)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setPayoutModal({ isOpen: false, record: null })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-cg-muted hover:text-cg-text border border-cg-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cg-orange to-cg-orange-hover hover:brightness-105 shadow-orange"
                >
                  Save Payout Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: Printable Payout Voucher / Settlement Statement   */}
      {/* ======================================================== */}
      {voucherModal.isOpen && voucherModal.record && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cg-navy/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-cg-border space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-cg-border pb-3 no-print">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-cg-blue" />
                <h3 className="text-base font-bold text-cg-navy">Payout Settlement Statement</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-cg-blue text-white text-xs font-bold hover:bg-cg-blue/90"
                >
                  Print Voucher
                </button>
                <button
                  type="button"
                  onClick={() => setVoucherModal({ isOpen: false, record: null })}
                  className="text-cg-muted hover:text-cg-text font-bold text-sm px-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Voucher printable area */}
            <div className="p-6 border border-cg-border rounded-xl space-y-5 text-xs text-cg-text bg-white">
              <div className="flex items-center justify-between border-b-2 border-cg-navy pb-3">
                <div>
                  <img src="/assets/logo.png" alt="Capital Grow" className="h-9 w-auto object-contain mb-1" />
                  <h4 className="text-sm font-black text-cg-navy">LOAN DISBURSEMENT &amp; PAYOUT VOUCHER</h4>
                  <p className="text-[10px] text-cg-muted">Capital Grow Financial Services • Commission Settlement</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-cg-blue font-bold block">{voucherModal.record.id}</span>
                  <span className="text-[10px] text-cg-muted">
                    Settled on: {voucherModal.record.payoutSavedAt || new Date().toISOString().slice(0, 10)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl">
                <div>
                  <span className="text-[10px] text-cg-muted font-bold uppercase block">Customer</span>
                  <span className="font-bold text-cg-navy text-sm">{voucherModal.record.name}</span>
                  <span className="text-[11px] text-cg-muted block">{voucherModal.record.mobile}</span>
                </div>
                <div>
                  <span className="text-[10px] text-cg-muted font-bold uppercase block">Bank &amp; Application</span>
                  <span className="font-bold text-cg-navy text-sm">{voucherModal.record.bankName}</span>
                  <span className="text-[11px] text-cg-muted block">App #{voucherModal.record.appNo}</span>
                </div>
              </div>

              {/* 3 inputs table breakdown */}
              <div className="border border-cg-border rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 font-bold text-cg-navy text-[11px]">
                    <tr>
                      <th className="p-2.5">Payout Component</th>
                      <th className="p-2.5">Recipient / Source</th>
                      <th className="p-2.5 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cg-border text-xs">
                    <tr>
                      <td className="p-2.5 font-bold text-cg-blue">1. Bank Payout</td>
                      <td className="p-2.5 text-cg-muted">{voucherModal.record.bankName}</td>
                      <td className="p-2.5 font-bold text-right text-cg-blue">
                        {formatINR(parseFloat(voucherModal.record.bankPayout) || 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-amber-700">2. Customer Payout</td>
                      <td className="p-2.5 text-cg-muted">{voucherModal.record.name} (Rebate/Cashback)</td>
                      <td className="p-2.5 font-bold text-right text-amber-700">
                        (-) {formatINR(parseFloat(voucherModal.record.customerPayout) || 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-purple-700">3. Vendor Payout</td>
                      <td className="p-2.5 text-cg-muted">
                        {voucherModal.record.refName || 'Channel Partner'}
                      </td>
                      <td className="p-2.5 font-bold text-right text-purple-700">
                        (-) {formatINR(parseFloat(voucherModal.record.vendorPayout) || 0)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50 font-black text-sm">
                      <td colSpan={2} className="p-2.5 text-cg-navy uppercase">
                        Net Retained Company Profit
                      </td>
                      <td className="p-2.5 text-right text-emerald-700">
                        {formatINR(
                          (parseFloat(voucherModal.record.bankPayout) || 0) -
                            (parseFloat(voucherModal.record.customerPayout) || 0) -
                            (parseFloat(voucherModal.record.vendorPayout) || 0)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-4 flex justify-between items-end text-[10px] text-cg-muted">
                <div>
                  <p>Authorized Signatory</p>
                  <p className="font-bold text-cg-navy mt-4">Capital Grow Advisory Services</p>
                </div>
                <div className="text-right">
                  <p>Status: <b className="text-emerald-700">DISBURSED &amp; SETTLED</b></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


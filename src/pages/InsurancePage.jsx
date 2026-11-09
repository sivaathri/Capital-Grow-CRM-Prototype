import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Heart,
  Activity,
  Car,
  FileCheck,
  Check,
  Copy,
  Plus,
  Search,
  Eye,
  Printer,
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  User,
  Users,
  Calendar,
  Building2,
  Sparkles,
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';

const LIFE_INSURERS = ['HDFC Life', 'ICICI Prudential Life', 'SBI Life', 'Max Life', 'Tata AIA Life', 'LIC of India'];
const HEALTH_INSURERS = ['Star Health & Allied', 'HDFC ERGO Health', 'Care Health Insurance', 'Niva Bupa Health', 'ICICI Lombard'];
const MOTOR_INSURERS = ['HDFC ERGO', 'ICICI Lombard', 'Bajaj Allianz', 'Tata AIG', 'Go Digit', 'New India Assurance'];

export const InsurancePage = () => {
  const { customers, addCustomer, route, navigate, addToast, confirm, simulateCall } = useApp();

  // If route.action is 'life', 'health', or 'motor', initialize with it
  const initialCat = (route.action === 'health' || route.action === 'motor' || route.action === 'life')
    ? route.action
    : 'life';

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'list'
  const [viewRecord, setViewRecord] = useState(null);

  // Synchronize active category when route.action changes (e.g. from sidebar choices)
  React.useEffect(() => {
    if (route.action === 'life' || route.action === 'health' || route.action === 'motor') {
      setActiveCategory(route.action);
    }
  }, [route.action]);

  // List filters
  const [listSearch, setListSearch] = useState('');
  const [listCategoryFilter, setListCategoryFilter] = useState('all');

  // Next Unique Reference No
  const getNextInsuranceId = () => {
    const year = new Date().getFullYear();
    const existingInsCount = customers.filter((c) => c.type?.includes('Insurance')).length;
    return `CG-INS-${year}-${String(existingInsCount + 1).padStart(4, '0')}`;
  };

  const [formUniqueId, setFormUniqueId] = useState(getNextInsuranceId);
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard?.writeText(formUniqueId);
    setCopiedId(true);
    addToast(`Copied Reference No: ${formUniqueId}`, 'ok');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  // Form State: Life Insurance
  const [lifeForm, setLifeForm] = useState({
    name: '',
    dob: '1995-06-15',
    gender: 'Male',
    mobile: '',
    email: '',
    annualIncome: '12,00,000',
    occupation: 'Salaried Professional',
    smoker: 'No',
    policyType: 'Term Life Insurance',
    sumAssured: '₹ 1 Crore',
    policyTerm: '30 Years',
    premiumMode: 'Yearly',
    preferredInsurer: 'HDFC Life',
    nomineeName: '',
    nomineeRelation: 'Spouse',
    nomineeAge: '28',
    notes: 'Pure protection term cover with critical illness rider.'
  });

  // Form State: Health Insurance
  const [healthForm, setHealthForm] = useState({
    name: '',
    dob: '1994-08-20',
    gender: 'Male',
    mobile: '',
    email: '',
    pincode: '600020',
    coverType: 'Family Floater (Self + Spouse + Children)',
    adultsCount: '2',
    childrenCount: '1',
    eldestAge: '32',
    sumInsured: '₹ 25 Lakh',
    preExisting: 'None',
    hospitalPreference: 'Max Cashless Network Hospitals',
    preferredInsurer: 'Star Health & Allied',
    maternityCover: false,
    opdCover: true,
    zeroCopay: true,
    notes: 'Comprehensive cashless health plan with restore benefit.'
  });

  // Form State: Motor Insurance
  const [motorForm, setMotorForm] = useState({
    ownerName: '',
    mobile: '',
    email: '',
    city: 'Chennai',
    vehicleCategory: 'Private 4-Wheeler Car',
    regNumber: '',
    makeModel: 'Hyundai Creta SX(O)',
    fuelType: 'Petrol',
    manufactureYear: '2024',
    policyType: 'Comprehensive (Own Damage + 3rd Party)',
    existingStatus: 'Expiring in 30 Days',
    ncbPercentage: '35%',
    preferredInsurer: 'HDFC ERGO',
    zeroDep: true,
    engineProtect: true,
    rsa: true,
    consumables: true,
    notes: 'Zero depreciation bumper-to-bumper renewal with NCB transfer.'
  });

  const [formErrors, setFormErrors] = useState({});

  // Filter existing insurance customers from CRM
  const insuranceCustomers = customers.filter(
    (c) => c.type?.toLowerCase().includes('insurance') || c.type?.toLowerCase().includes('life') || c.type?.toLowerCase().includes('health') || c.type?.toLowerCase().includes('motor')
  );

  const filteredInsuranceList = insuranceCustomers.filter((item) => {
    const q = listSearch.toLowerCase();
    const matchesSearch =
      !q || (item.name + item.mobile + (item.email || '') + (item.id || '') + (item.type || '')).toLowerCase().includes(q);

    let matchesCat = true;
    if (listCategoryFilter === 'life') matchesCat = item.type?.toLowerCase().includes('life');
    else if (listCategoryFilter === 'health') matchesCat = item.type?.toLowerCase().includes('health');
    else if (listCategoryFilter === 'motor') matchesCat = item.type?.toLowerCase().includes('motor');

    return matchesSearch && matchesCat;
  });

  // Category switch handler
  const handleCategorySwitch = (cat) => {
    setActiveCategory(cat);
    setFormErrors({});
    navigate('insurance', cat);
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    let targetData;
    let customerType;
    let amountStr;
    let remarksStr;

    if (activeCategory === 'life') {
      if (!lifeForm.name.trim()) errs.name = 'Please enter insured person name.';
      if (!lifeForm.mobile.trim() || !/^[6-9]\d{9}$/.test(lifeForm.mobile)) {
        errs.mobile = 'Enter a valid 10-digit mobile number.';
      }
      customerType = 'Insurance (Life)';
      amountStr = lifeForm.sumAssured;
      remarksStr = `Life Cover: ${lifeForm.policyType} of ${lifeForm.sumAssured} (${lifeForm.policyTerm}). Insurer: ${lifeForm.preferredInsurer}. Nominee: ${lifeForm.nomineeName} (${lifeForm.nomineeRelation}).`;
      targetData = { ...lifeForm };
    } else if (activeCategory === 'health') {
      if (!healthForm.name.trim()) errs.name = 'Please enter proposer name.';
      if (!healthForm.mobile.trim() || !/^[6-9]\d{9}$/.test(healthForm.mobile)) {
        errs.mobile = 'Enter a valid 10-digit mobile number.';
      }
      customerType = 'Insurance (Health)';
      amountStr = healthForm.sumInsured;
      remarksStr = `Health Cover: ${healthForm.coverType} with ${healthForm.sumInsured} cover. Preferred Insurer: ${healthForm.preferredInsurer}. Pre-existing: ${healthForm.preExisting}.`;
      targetData = { ...healthForm };
    } else {
      if (!motorForm.ownerName.trim()) errs.name = 'Please enter vehicle owner name.';
      if (!motorForm.mobile.trim() || !/^[6-9]\d{9}$/.test(motorForm.mobile)) {
        errs.mobile = 'Enter a valid 10-digit mobile number.';
      }
      if (!motorForm.regNumber.trim()) errs.regNumber = 'Please enter vehicle registration number.';
      customerType = 'Insurance (Motor)';
      amountStr = `IDV / NCB: ${motorForm.ncbPercentage}`;
      remarksStr = `Motor Cover for ${motorForm.makeModel} (${motorForm.regNumber}). Type: ${motorForm.policyType}. Insurer: ${motorForm.preferredInsurer}. ZeroDep: ${motorForm.zeroDep ? 'Yes' : 'No'}.`;
      targetData = { ...motorForm, name: motorForm.ownerName };
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Create CRM Lead
    const newLead = addCustomer({
      name: targetData.name || targetData.ownerName,
      mobile: targetData.mobile,
      email: targetData.email,
      type: customerType,
      status: 'Lead',
      followup: '12 Nov 2026',
      emp: 'Meena R',
      city: targetData.city || 'Chennai',
      country: 'India',
      pin: targetData.pincode || '600020',
      loanAmount: amountStr,
      src: 'Insurance Advisory Portal',
      refName: 'Direct Walk-in',
      remarks: `[${formUniqueId}] ${remarksStr}`
    });

    addToast(`Insurance Advisory Lead Created! Reference: ${formUniqueId}`, 'ok');
    setViewRecord({ ...targetData, id: formUniqueId, customerType, amountStr, remarksStr, date: todayStr });
    setFormUniqueId(getNextInsuranceId());
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-cg-navy flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-cg-orange" />
            <span>Insurance Advisory</span>
          </h1>
          <p className="text-sm text-cg-muted mt-0.5">
            Comprehensive Life Protection, Family Health Mediclaim &amp; Motor Vehicle Insurance Advisory
          </p>
        </div>

        {/* Tab switchers: Form vs All Enquiries */}
        <div className="inline-flex bg-gray-200/60 p-1.5 rounded-xl gap-1 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('form');
              setViewRecord(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'form' && !viewRecord
                ? 'bg-white text-cg-navy shadow-sm'
                : 'text-cg-muted hover:text-cg-text'
            }`}
          >
            + New Advisory Enquiry
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('list');
              setViewRecord(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'list'
                ? 'bg-white text-cg-navy shadow-sm'
                : 'text-cg-muted hover:text-cg-text'
            }`}
          >
            All Enquiries ({insuranceCustomers.length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW QUOTATION / ADVISORY SLIP                           */}
      {/* ======================================================== */}
      {viewRecord && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between no-print">
            <button
              type="button"
              onClick={() => setViewRecord(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-cg-blue hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Insurance Advisory</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-cg-navy bg-white hover:bg-gray-50 border border-cg-border shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Advisory Slip</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewRecord(null);
                  setActiveTab('list');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cg-blue hover:bg-cg-blue/90"
              >
                Done
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cg-border shadow-card space-y-6 text-xs text-cg-text">
            {/* Slip Header */}
            <div className="flex items-center justify-between border-b-2 border-cg-orange pb-4">
              <div>
                <img src="/assets/logo.png" alt="Capital Grow" className="h-10 w-auto object-contain mb-2" />
                <h2 className="text-lg font-extrabold text-cg-navy uppercase tracking-wide">
                  INSURANCE ADVISORY PROPOSAL &amp; ENQUIRY SLIP
                </h2>
                <p className="text-[11px] text-cg-muted">Capital Grow Financial &amp; Insurance Advisory Services</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-cg-orange border border-orange-200">
                  {viewRecord.id}
                </span>
                <span className="block text-cg-muted text-[11px] mt-1.5">
                  Date: <b className="text-cg-navy">{viewRecord.date}</b>
                </span>
              </div>
            </div>

            {/* Overview Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-orange-50/40 rounded-xl border border-orange-200">
              <div>
                <span className="text-[10px] text-cg-muted font-bold uppercase block">Client Name</span>
                <b className="text-xs font-bold text-cg-navy">{viewRecord.name || viewRecord.ownerName}</b>
              </div>
              <div>
                <span className="text-[10px] text-cg-muted font-bold uppercase block">Mobile</span>
                <b className="text-xs font-bold text-cg-navy">+91 {viewRecord.mobile}</b>
              </div>
              <div>
                <span className="text-[10px] text-cg-muted font-bold uppercase block">Insurance Category</span>
                <b className="text-xs font-bold text-cg-blue">{viewRecord.customerType}</b>
              </div>
              <div>
                <span className="text-[10px] text-cg-muted font-bold uppercase block">Coverage / Sum</span>
                <b className="text-sm font-extrabold text-cg-orange">{viewRecord.amountStr}</b>
              </div>
            </div>

            {/* Advisory Remarks */}
            <div className="p-4 bg-gray-50 rounded-xl border border-cg-border space-y-2">
              <span className="text-xs font-bold text-cg-navy uppercase tracking-wider block">Advisory &amp; Policy Plan Details:</span>
              <p className="text-xs text-cg-navy leading-relaxed">{viewRecord.remarksStr}</p>
            </div>

            <div className="pt-6 border-t border-dashed border-cg-border flex items-center justify-between text-cg-muted text-[11px]">
              <span>Lead registered into Capital Grow CRM • Status: Lead</span>
              <span>Advisor Signature: _______________________</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FORM TAB: CATEGORY CHOOSER (LIFE, HEALTH, MOTOR)        */}
      {/* ======================================================== */}
      {activeTab === 'form' && !viewRecord && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Unique Application Ref Banner */}
          <div className="bg-gradient-to-r from-cg-navy via-[#0d2a4d] to-cg-blue rounded-2xl p-4 sm:p-5 text-white shadow-card border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-cg-orange border border-white/20 shrink-0">
                <Sparkles className="w-6 h-6 text-cg-orange" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-300">
                    Insurance Advisory Reference No.
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Auto-Generated Unique ID
                  </span>
                </div>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="font-mono text-xl sm:text-2xl font-black tracking-wider text-white select-all">
                    {formUniqueId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="p-1.5 px-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs transition-all flex items-center gap-1.5 border border-white/20"
                    title="Copy Unique ID to clipboard"
                  >
                    {copiedId ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] font-bold text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-semibold">Copy ID</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-white/70 mt-0.5">
                  Select policy category below: <b>Life Insurance</b>, <b>Health Insurance</b>, or <b>Motor Insurance</b>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
              <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-center min-w-[120px]">
                <span className="text-[10px] text-white/70 uppercase font-bold block">Selected Category</span>
                <b className="text-xs font-bold text-orange-300 block mt-0.5 uppercase">
                  {activeCategory} Insurance
                </b>
              </div>
            </div>
          </div>

          {/* 3 Prominent Category Chooser Cards */}
          <div>
            <label className="block text-xs font-bold text-cg-navy uppercase tracking-wider mb-2.5">
              Choose Insurance Category:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Option 1: Life Insurance */}
              <button
                type="button"
                onClick={() => handleCategorySwitch('life')}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-3.5 ${
                  activeCategory === 'life'
                    ? 'border-cg-orange bg-orange-50/60 shadow-orange ring-2 ring-cg-orange/20'
                    : 'border-cg-border bg-white hover:border-gray-300 hover:shadow-card'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    activeCategory === 'life'
                      ? 'bg-cg-orange text-white'
                      : 'bg-orange-100 text-cg-orange'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <b className="text-sm font-bold text-cg-navy">Life Insurance</b>
                    {activeCategory === 'life' && (
                      <span className="w-4 h-4 rounded-full bg-cg-orange text-white text-[10px] flex items-center justify-center font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-cg-muted mt-0.5 leading-snug">
                    Term life cover, wealth plans &amp; student abroad protection
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white text-cg-orange border border-orange-200">
                    From ₹1 Cr Cover @ ₹490/mo
                  </span>
                </div>
              </button>

              {/* Option 2: Health Insurance */}
              <button
                type="button"
                onClick={() => handleCategorySwitch('health')}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-3.5 ${
                  activeCategory === 'health'
                    ? 'border-cg-blue bg-blue-50/60 shadow-md ring-2 ring-cg-blue/20'
                    : 'border-cg-border bg-white hover:border-gray-300 hover:shadow-card'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    activeCategory === 'health'
                      ? 'bg-cg-blue text-white'
                      : 'bg-blue-100 text-cg-blue'
                  }`}
                >
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <b className="text-sm font-bold text-cg-navy">Health Insurance</b>
                    {activeCategory === 'health' && (
                      <span className="w-4 h-4 rounded-full bg-cg-blue text-white text-[10px] flex items-center justify-center font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-cg-muted mt-0.5 leading-snug">
                    Family floater, mediclaim, critical illness &amp; overseas health
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white text-cg-blue border border-blue-200">
                    100% Cashless Hospitals
                  </span>
                </div>
              </button>

              {/* Option 3: Motor Insurance */}
              <button
                type="button"
                onClick={() => handleCategorySwitch('motor')}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-3.5 ${
                  activeCategory === 'motor'
                    ? 'border-emerald-500 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-cg-border bg-white hover:border-gray-300 hover:shadow-card'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    activeCategory === 'motor'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  <Car className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <b className="text-sm font-bold text-cg-navy">Motor Insurance</b>
                    {activeCategory === 'motor' && (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-cg-muted mt-0.5 leading-snug">
                    Car, bike &amp; commercial vehicle comprehensive &amp; zero-dep cover
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200">
                    Up to 50% NCB Discount
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* ======================================================== */}
            {/* CATEGORY 1: LIFE INSURANCE FORM                          */}
            {/* ======================================================== */}
            {activeCategory === 'life' && (
              <div className="space-y-6 animate-fade-in">
                {/* 1. Proposer & Insured Details */}
                <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
                  <div className="flex items-center justify-between border-b border-cg-border pb-3">
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-5 h-5 text-cg-orange" />
                      <h3 className="text-base font-bold text-cg-navy">1. Insured Personal &amp; Lifestyle Details</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-cg-orange">
                      Life Insurance
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Insured Full Name: *</label>
                      <input
                        type="text"
                        required
                        value={lifeForm.name}
                        onChange={(e) => setLifeForm({ ...lifeForm, name: e.target.value })}
                        placeholder="e.g. Anand Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                      />
                      {formErrors.name && (
                        <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.name}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Mobile Number: *</label>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={lifeForm.mobile}
                        onChange={(e) => setLifeForm({ ...lifeForm, mobile: e.target.value })}
                        placeholder="10-digit mobile"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                      />
                      {formErrors.mobile && (
                        <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.mobile}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Email Address:</label>
                      <input
                        type="email"
                        value={lifeForm.email}
                        onChange={(e) => setLifeForm({ ...lifeForm, email: e.target.value })}
                        placeholder="anand@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Date of Birth:</label>
                      <input
                        type="date"
                        value={lifeForm.dob}
                        onChange={(e) => setLifeForm({ ...lifeForm, dob: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Gender:</label>
                      <select
                        value={lifeForm.gender}
                        onChange={(e) => setLifeForm({ ...lifeForm, gender: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Annual Income (₹):</label>
                      <input
                        type="text"
                        value={lifeForm.annualIncome}
                        onChange={(e) => setLifeForm({ ...lifeForm, annualIncome: e.target.value })}
                        placeholder="e.g. 15,00,000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Smoker / Tobacco User?</label>
                      <div className="flex gap-2">
                        {['No', 'Yes'].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setLifeForm({ ...lifeForm, smoker: val })}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                              lifeForm.smoker === val
                                ? 'bg-orange-50 text-cg-orange border-cg-orange shadow-sm'
                                : 'bg-white text-cg-text border-cg-border hover:bg-gray-50'
                            }`}
                          >
                            {val === 'No' ? 'Non-Smoker (Lower Premium)' : 'Smoker'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Occupation &amp; Nature of Work:</label>
                      <input
                        type="text"
                        value={lifeForm.occupation}
                        onChange={(e) => setLifeForm({ ...lifeForm, occupation: e.target.value })}
                        placeholder="e.g. IT Software Consultant / Business Owner"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Policy Specification */}
                <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
                  <h3 className="text-base font-bold text-cg-navy border-b border-cg-border pb-3">
                    2. Life Policy Coverage &amp; Term Preferences
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Life Policy Plan:</label>
                      <select
                        value={lifeForm.policyType}
                        onChange={(e) => setLifeForm({ ...lifeForm, policyType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-medium"
                      >
                        <option value="Term Life Insurance">Pure Term Life Insurance (Highest Cover)</option>
                        <option value="Whole Life Protection">Whole Life Cover (Coverage till 99 yrs)</option>
                        <option value="ULIP Wealth Plan">ULIP (Market Linked Growth + Cover)</option>
                        <option value="Endowment Savings">Guaranteed Return Endowment Plan</option>
                        <option value="Overseas Student Cover">Overseas Student Term &amp; Travel Cover</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Sum Assured (Life Cover):</label>
                      <select
                        value={lifeForm.sumAssured}
                        onChange={(e) => setLifeForm({ ...lifeForm, sumAssured: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-bold text-cg-orange"
                      >
                        <option value="₹ 50 Lakh">₹ 50 Lakh</option>
                        <option value="₹ 75 Lakh">₹ 75 Lakh</option>
                        <option value="₹ 1 Crore">₹ 1 Crore (Recommended)</option>
                        <option value="₹ 1.5 Crore">₹ 1.5 Crore</option>
                        <option value="₹ 2 Crore">₹ 2 Crore</option>
                        <option value="₹ 5 Crore">₹ 5 Crore</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Policy Tenure:</label>
                      <select
                        value={lifeForm.policyTerm}
                        onChange={(e) => setLifeForm({ ...lifeForm, policyTerm: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                      >
                        <option value="10 Years">10 Years</option>
                        <option value="20 Years">20 Years</option>
                        <option value="30 Years">30 Years</option>
                        <option value="Coverage Till Age 75">Coverage Till Age 75</option>
                        <option value="Coverage Till Age 85">Coverage Till Age 85</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Preferred Life Insurer:</label>
                      <select
                        value={lifeForm.preferredInsurer}
                        onChange={(e) => setLifeForm({ ...lifeForm, preferredInsurer: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-medium"
                      >
                        {LIFE_INSURERS.map((ins) => (
                          <option key={ins} value={ins}>{ins}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Premium Payment Frequency:</label>
                      <select
                        value={lifeForm.premiumMode}
                        onChange={(e) => setLifeForm({ ...lifeForm, premiumMode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                      >
                        <option value="Yearly">Yearly (5% Discount)</option>
                        <option value="Half-Yearly">Half-Yearly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Nominee Name &amp; Relation:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={lifeForm.nomineeName}
                          onChange={(e) => setLifeForm({ ...lifeForm, nomineeName: e.target.value })}
                          placeholder="Nominee Name"
                          className="w-full px-3 py-2 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                        />
                        <select
                          value={lifeForm.nomineeRelation}
                          onChange={(e) => setLifeForm({ ...lifeForm, nomineeRelation: e.target.value })}
                          className="w-full px-2 py-2 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                        >
                          <option value="Spouse">Spouse</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Brother">Brother</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* CATEGORY 2: HEALTH INSURANCE FORM                        */}
            {/* ======================================================== */}
            {activeCategory === 'health' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
                  <div className="flex items-center justify-between border-b border-cg-border pb-3">
                    <div className="flex items-center gap-2.5">
                      <Activity className="w-5 h-5 text-cg-blue" />
                      <h3 className="text-base font-bold text-cg-navy">1. Health Proposer &amp; Family Structure</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-cg-blue">
                      Health Insurance
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Proposer Name: *</label>
                      <input
                        type="text"
                        required
                        value={healthForm.name}
                        onChange={(e) => setHealthForm({ ...healthForm, name: e.target.value })}
                        placeholder="e.g. Ramesh K"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                      />
                      {formErrors.name && (
                        <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.name}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Mobile Number: *</label>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={healthForm.mobile}
                        onChange={(e) => setHealthForm({ ...healthForm, mobile: e.target.value })}
                        placeholder="10-digit mobile"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                      />
                      {formErrors.mobile && (
                        <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.mobile}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Email Address:</label>
                      <input
                        type="email"
                        value={healthForm.email}
                        onChange={(e) => setHealthForm({ ...healthForm, email: e.target.value })}
                        placeholder="ramesh@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Residential Pincode:</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={healthForm.pincode}
                        onChange={(e) => setHealthForm({ ...healthForm, pincode: e.target.value })}
                        placeholder="6-digit pincode"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Plan Type:</label>
                      <select
                        value={healthForm.coverType}
                        onChange={(e) => setHealthForm({ ...healthForm, coverType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-medium"
                      >
                        <option value="Family Floater (Self + Spouse + Children)">Family Floater (Self + Spouse + Children)</option>
                        <option value="Individual Health Cover">Individual Health Cover</option>
                        <option value="Senior Citizen Plan (Parents)">Parents / Senior Citizen Plan</option>
                        <option value="Overseas Student Health Cover">Overseas Student Health &amp; Travel</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Eldest Member Age:</label>
                      <input
                        type="number"
                        value={healthForm.eldestAge}
                        onChange={(e) => setHealthForm({ ...healthForm, eldestAge: e.target.value })}
                        placeholder="e.g. 35"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
                  <h3 className="text-base font-bold text-cg-navy border-b border-cg-border pb-3">
                    2. Sum Insured &amp; Coverage Features
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Health Sum Insured:</label>
                      <select
                        value={healthForm.sumInsured}
                        onChange={(e) => setHealthForm({ ...healthForm, sumInsured: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-bold text-cg-blue"
                      >
                        <option value="₹ 5 Lakh">₹ 5 Lakh</option>
                        <option value="₹ 10 Lakh">₹ 10 Lakh</option>
                        <option value="₹ 15 Lakh">₹ 15 Lakh</option>
                        <option value="₹ 25 Lakh">₹ 25 Lakh (Most Popular)</option>
                        <option value="₹ 50 Lakh">₹ 50 Lakh</option>
                        <option value="₹ 1 Crore">₹ 1 Crore (Super Shield)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Preferred Health Insurer:</label>
                      <select
                        value={healthForm.preferredInsurer}
                        onChange={(e) => setHealthForm({ ...healthForm, preferredInsurer: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-medium"
                      >
                        {HEALTH_INSURERS.map((ins) => (
                          <option key={ins} value={ins}>{ins}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Existing Medical Conditions:</label>
                      <select
                        value={healthForm.preExisting}
                        onChange={(e) => setHealthForm({ ...healthForm, preExisting: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                      >
                        <option value="None">None (Zero Pre-existing)</option>
                        <option value="Diabetes">Diabetes</option>
                        <option value="Hypertension / BP">Hypertension / Blood Pressure</option>
                        <option value="Thyroid">Thyroid</option>
                        <option value="Asthma">Asthma / Respiratory</option>
                        <option value="Other">Other condition</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3 pt-2">
                      <label className="block text-xs font-bold text-cg-navy mb-2">Recommended Health Add-ons:</label>
                      <div className="flex flex-wrap gap-3">
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-cg-border text-xs cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={healthForm.zeroCopay}
                            onChange={(e) => setHealthForm({ ...healthForm, zeroCopay: e.target.checked })}
                            className="rounded text-cg-blue"
                          />
                          <span className="font-semibold text-cg-navy">Zero Co-Payment Rider</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-cg-border text-xs cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={healthForm.opdCover}
                            onChange={(e) => setHealthForm({ ...healthForm, opdCover: e.target.checked })}
                            className="rounded text-cg-blue"
                          />
                          <span className="font-semibold text-cg-navy">OPD Consultation &amp; Medicine Cover</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-cg-border text-xs cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={healthForm.maternityCover}
                            onChange={(e) => setHealthForm({ ...healthForm, maternityCover: e.target.checked })}
                            className="rounded text-cg-blue"
                          />
                          <span className="font-semibold text-cg-navy">Maternity &amp; Newborn Cover</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* CATEGORY 3: MOTOR INSURANCE FORM                         */}
            {/* ======================================================== */}
            {activeCategory === 'motor' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
                  <div className="flex items-center justify-between border-b border-cg-border pb-3">
                    <div className="flex items-center gap-2.5">
                      <Car className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-base font-bold text-cg-navy">1. Vehicle Ownership &amp; Registration</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      Motor Insurance
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Vehicle Owner Name: *</label>
                      <input
                        type="text"
                        required
                        value={motorForm.ownerName}
                        onChange={(e) => setMotorForm({ ...motorForm, ownerName: e.target.value })}
                        placeholder="e.g. Vignesh P"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                      />
                      {formErrors.name && (
                        <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.name}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Mobile Number: *</label>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={motorForm.mobile}
                        onChange={(e) => setMotorForm({ ...motorForm, mobile: e.target.value })}
                        placeholder="10-digit mobile"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                      />
                      {formErrors.mobile && (
                        <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.mobile}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Vehicle Registration No: *</label>
                      <input
                        type="text"
                        required
                        value={motorForm.regNumber}
                        onChange={(e) => setMotorForm({ ...motorForm, regNumber: e.target.value.toUpperCase() })}
                        placeholder="e.g. TN-07-CB-4421"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs font-mono font-bold text-cg-navy uppercase focus:outline-none focus:border-cg-blue"
                      />
                      {formErrors.regNumber && (
                        <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.regNumber}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Vehicle Type:</label>
                      <select
                        value={motorForm.vehicleCategory}
                        onChange={(e) => setMotorForm({ ...motorForm, vehicleCategory: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-medium"
                      >
                        <option value="Private 4-Wheeler Car">Private 4-Wheeler Car</option>
                        <option value="Two-Wheeler Bike / Scooter">Two-Wheeler Bike / Scooter</option>
                        <option value="Commercial Vehicle">Commercial Goods / Passenger Vehicle</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Make, Model &amp; Variant:</label>
                      <input
                        type="text"
                        value={motorForm.makeModel}
                        onChange={(e) => setMotorForm({ ...motorForm, makeModel: e.target.value })}
                        placeholder="e.g. Hyundai Creta SX(O) / Swift VXi"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Fuel Type:</label>
                      <select
                        value={motorForm.fuelType}
                        onChange={(e) => setMotorForm({ ...motorForm, fuelType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric (EV)">Electric Vehicle (EV)</option>
                        <option value="CNG / Hybrid">CNG / Hybrid</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
                  <h3 className="text-base font-bold text-cg-navy border-b border-cg-border pb-3">
                    2. Policy Coverage, No Claim Bonus (NCB) &amp; Add-ons
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Coverage Type:</label>
                      <select
                        value={motorForm.policyType}
                        onChange={(e) => setMotorForm({ ...motorForm, policyType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-medium"
                      >
                        <option value="Comprehensive (Own Damage + 3rd Party)">Comprehensive (Own Damage + 3rd Party)</option>
                        <option value="Standalone Own Damage">Standalone Own Damage Cover</option>
                        <option value="Third Party Liability Only">Third Party Liability Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">Current Policy Status:</label>
                      <select
                        value={motorForm.existingStatus}
                        onChange={(e) => setMotorForm({ ...motorForm, existingStatus: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                      >
                        <option value="Expiring in 30 Days">Expiring in next 30 Days</option>
                        <option value="Expired < 90 Days">Expired less than 90 Days (NCB Valid)</option>
                        <option value="Expired > 90 Days">Expired more than 90 Days</option>
                        <option value="Brand New Vehicle">Brand New Vehicle Registration</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cg-navy mb-1.5">No Claim Bonus (NCB):</label>
                      <select
                        value={motorForm.ncbPercentage}
                        onChange={(e) => setMotorForm({ ...motorForm, ncbPercentage: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-bold text-emerald-700"
                      >
                        <option value="0%">0% (No previous bonus)</option>
                        <option value="20%">20% (1 Claim-Free Year)</option>
                        <option value="25%">25% (2 Claim-Free Years)</option>
                        <option value="35%">35% (3 Claim-Free Years)</option>
                        <option value="45%">45% (4 Claim-Free Years)</option>
                        <option value="50%">50% (Max 5 Years Claim-Free)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3 pt-2">
                      <label className="block text-xs font-bold text-cg-navy mb-2">Recommended Motor Add-on Riders:</label>
                      <div className="flex flex-wrap gap-3">
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-cg-border text-xs cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={motorForm.zeroDep}
                            onChange={(e) => setMotorForm({ ...motorForm, zeroDep: e.target.checked })}
                            className="rounded text-emerald-600"
                          />
                          <span className="font-semibold text-cg-navy">Zero Depreciation (Bumper to Bumper)</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-cg-border text-xs cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={motorForm.engineProtect}
                            onChange={(e) => setMotorForm({ ...motorForm, engineProtect: e.target.checked })}
                            className="rounded text-emerald-600"
                          />
                          <span className="font-semibold text-cg-navy">Engine &amp; Gearbox Protection</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-cg-border text-xs cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={motorForm.rsa}
                            onChange={(e) => setMotorForm({ ...motorForm, rsa: e.target.checked })}
                            className="rounded text-emerald-600"
                          />
                          <span className="font-semibold text-cg-navy">24x7 Roadside Assistance (RSA)</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-cg-border text-xs cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={motorForm.consumables}
                            onChange={(e) => setMotorForm({ ...motorForm, consumables: e.target.checked })}
                            className="rounded text-emerald-600"
                          />
                          <span className="font-semibold text-cg-navy">Consumables &amp; Nut-Bolt Cover</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sticky Submit Bar */}
            <div className="sticky bottom-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/95 backdrop-blur-md border border-cg-border rounded-2xl shadow-dropdown">
              <div className="flex items-center gap-2 text-xs text-cg-muted">
                <Shield className="w-4 h-4 text-cg-orange" />
                <span>
                  Advisory Category: <b className="capitalize text-cg-navy">{activeCategory} Insurance</b> • Submitting registers enquiry directly into CRM as a Lead
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cg-orange to-cg-orange-hover hover:brightness-95 shadow-orange transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit {activeCategory.toUpperCase()} Advisory Lead</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* ALL INSURANCE ENQUIRIES LIST VIEW                        */}
      {/* ======================================================== */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-2xl border border-cg-border shadow-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cg-muted" />
              <input
                type="text"
                placeholder="Search insurance leads by name, mobile, ID, type..."
                value={listSearch}
                onChange={(e) => setListSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cg-border text-xs text-cg-text focus:outline-none focus:border-cg-blue"
              />
            </div>

            <div className="inline-flex bg-gray-100 p-1 rounded-xl gap-1 shrink-0 w-full sm:w-auto">
              {['all', 'life', 'health', 'motor'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setListCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    listCategoryFilter === cat ? 'bg-white text-cg-navy shadow-sm' : 'text-cg-muted hover:text-cg-text'
                  }`}
                >
                  {cat === 'all' ? 'All Policies' : `${cat}`}
                </button>
              ))}
            </div>
          </div>

          {filteredInsuranceList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-cg-border text-cg-muted font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Lead ID</th>
                    <th className="py-3 px-3">Client Name</th>
                    <th className="py-3 px-3">Mobile &amp; Email</th>
                    <th className="py-3 px-3">Insurance Category</th>
                    <th className="py-3 px-3">Cover / Plan</th>
                    <th className="py-3 px-3">Stage / Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cg-border">
                  {filteredInsuranceList.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-cg-blue">{item.id}</td>
                      <td className="py-3 px-3">
                        <b className="font-bold text-cg-navy block">{item.name}</b>
                        <span className="text-[11px] text-cg-muted">{item.city || item.address || 'Chennai'}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-cg-navy block font-semibold">{item.mobile}</span>
                        <span className="text-[11px] text-cg-muted block truncate max-w-[150px]">{item.email || '-'}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.type?.toLowerCase().includes('life')
                              ? 'bg-orange-50 text-cg-orange border-orange-200'
                              : item.type?.toLowerCase().includes('health')
                              ? 'bg-blue-50 text-cg-blue border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <b className="text-xs font-bold text-cg-navy block">{item.loanAmount || '₹ 25 Lakh'}</b>
                        <p className="text-[10px] text-cg-muted truncate max-w-[200px] mt-0.5">{item.remarks}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          {item.status || 'Lead'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => simulateCall(item.name)}
                            className="p-1.5 rounded-lg bg-blue-50 text-cg-blue hover:bg-blue-100"
                            title="Call client"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setViewRecord({
                                id: item.id,
                                name: item.name,
                                mobile: item.mobile,
                                customerType: item.type,
                                amountStr: item.loanAmount,
                                remarksStr: item.remarks,
                                date: item.created || todayStr
                              });
                            }}
                            className="p-1.5 rounded-lg bg-gray-100 text-cg-navy hover:bg-gray-200"
                            title="View proposal slip"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-base font-bold text-cg-navy mb-1">No insurance leads found</h3>
              <p className="text-xs text-cg-muted mb-4">Click below to start a new Life, Health, or Motor insurance enquiry.</p>
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="px-4 py-2.5 bg-cg-orange text-white rounded-xl text-xs font-bold shadow-orange"
              >
                + New Insurance Advisory
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Landmark,
  Home,
  Building2,
  Car,
  Coins,
  Briefcase,
  KeyRound,
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
  Sparkles,
  AlertCircle,
  FileText,
  DollarSign,
  Building,
  Percent,
  CheckCircle2,
  HelpCircle,
  Compass
} from 'lucide-react';

const HOME_LENDERS = ['HDFC Bank', 'State Bank of India (SBI)', 'ICICI Bank', 'Axis Bank', 'Bank of Baroda', 'Kotak Mahindra Bank', 'PNB Housing', 'LIC Housing Finance'];
const CAR_LENDERS = ['HDFC Bank Auto Loan', 'SBI Car Loan', 'ICICI Bank Car Loan', 'Kotak Mahindra Prime', 'Axis Bank Auto', 'Bank of Baroda Car Loan'];
const PERSONAL_LENDERS = ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI Personal Banking', 'Tata Capital', 'Bajaj Finserv'];
const BUSINESS_LENDERS = ['HDFC Bank MSME', 'SBI SME', 'ICICI Bank Commercial', 'Axis Bank MSME', 'Bajaj Finance SME'];
const LAP_LENDERS = ['HDFC Bank Mortgage', 'SBI LAP', 'ICICI Bank Property Loan', 'Axis Bank LAP', 'Tata Capital Mortgage'];

export const LoansPage = () => {
  const { customers, addCustomer, route, navigate, addToast, confirm, simulateCall } = useApp();

  // Active Category: 'home' | 'housing' | 'car' | 'personal' | 'business' | 'lap'
  const validCategories = ['home', 'housing', 'car', 'personal', 'business', 'lap'];
  const initialCategory = validCategories.includes(route.action) ? route.action : 'home';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'list'
  const [viewRecord, setViewRecord] = useState(null);

  // Synchronize category with route.action from sidebar clicks
  useEffect(() => {
    if (validCategories.includes(route.action)) {
      setActiveCategory(route.action);
    }
  }, [route.action]);

  // List filters
  const [listSearch, setListSearch] = useState('');
  const [listCategoryFilter, setListCategoryFilter] = useState('all');

  // Next Unique Reference No: CG-LN-YYYY-XXXX
  const getNextLoanId = () => {
    const year = new Date().getFullYear();
    const existingLoanCount = customers.filter(
      (c) =>
        c.type?.includes('Home') ||
        c.type?.includes('Housing') ||
        c.type?.includes('Car') ||
        c.type?.includes('Personal') ||
        c.type?.includes('Business') ||
        c.type?.includes('Property') ||
        c.type?.includes('Loan')
    ).length;
    return `CG-LN-${year}-${String(existingLoanCount + 101).padStart(4, '0')}`;
  };

  const [formUniqueId, setFormUniqueId] = useState(getNextLoanId);
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard?.writeText(formUniqueId);
    setCopiedId(true);
    addToast(`Copied Loan Application Reference: ${formUniqueId}`, 'ok');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  // Common Applicant Info State
  const [applicantInfo, setApplicantInfo] = useState({
    name: '',
    mobile: '',
    email: '',
    dob: '1992-05-14',
    gender: 'Male',
    pan: '',
    aadhaar: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600020',
    residenceType: 'Owned by Self / Parents',
    address: ''
  });

  // Employment & Income State
  const [financialInfo, setFinancialInfo] = useState({
    employmentType: 'Salaried - Corporate / MNC',
    employerName: 'Tata Consultancy Services',
    monthlyIncome: '1,25,000',
    experienceYears: '6 Years',
    existingEmis: '15,000',
    salaryBank: 'HDFC Bank',
    cibilScore: '785'
  });

  // 1. Home Loan Specific State
  const [homeLoanData, setHomeLoanData] = useState({
    propertyType: 'Ready to Move Apartment / Flat',
    builderProjectName: 'Casagrand Primrose, Chennai',
    propertyLocation: 'Perungalathur, Chennai',
    totalPropertyValue: '85,00,000',
    downPaymentAmount: '17,00,000',
    loanAmount: '68,00,000',
    tenureYears: '20',
    preferredBank: 'HDFC Bank',
    coApplicant: 'Yes - Spouse',
    coApplicantName: '',
    coApplicantIncome: '65,000'
  });

  // 2. Housing Loan (Plot + Construction / Renovation)
  const [housingLoanData, setHousingLoanData] = useState({
    housingPurpose: 'Construction on Own Plot',
    plotLocation: 'Tambaram East, Chennai',
    plotAreaSqFt: '1,800 sq.ft',
    estimatedConstructionCost: '55,00,000',
    loanAmount: '45,00,000',
    tenureYears: '18',
    approvedPlanStatus: 'Approved CMDA / DTCP Plan Available',
    contractorEstimationReady: 'Yes',
    preferredBank: 'State Bank of India (SBI)'
  });

  // 3. Car Loan State
  const [carLoanData, setCarLoanData] = useState({
    vehicleCondition: 'Brand New Car',
    makeModel: 'Hyundai Creta SX(O) Petrol',
    fuelType: 'Petrol',
    dealerShowroom: 'DSC Hyundai, Guindy, Chennai',
    onRoadPrice: '21,50,000',
    downPaymentAmount: '3,50,000',
    loanAmount: '18,00,000',
    tenureYears: '5',
    preferredBank: 'HDFC Bank Auto Loan',
    zeroForeclosure: true
  });

  // 4. Personal Loan State
  const [personalLoanData, setPersonalLoanData] = useState({
    loanPurpose: 'Home Renovation & Furnishing',
    loanAmount: '8,00,000',
    tenureYears: '3',
    preApprovedOffer: 'Yes',
    preferredBank: 'ICICI Bank'
  });

  // 5. Business Loan State
  const [businessLoanData, setBusinessLoanData] = useState({
    businessConstitution: 'Private Limited Company',
    businessNature: 'IT Services & Software Consulting',
    vintageYears: '5 Years',
    annualTurnover: '2,80,00,000',
    gstNumber: '33AABCT1234F1Z5',
    loanFacility: 'Working Capital Term Loan',
    loanAmount: '35,00,000',
    tenureYears: '4',
    preferredBank: 'HDFC Bank MSME'
  });

  // 6. Loan Against Property (LAP) State
  const [lapData, setLapData] = useState({
    propertyCategory: 'Residential House / Apartment',
    propertyUsage: 'Self-Occupied Residential',
    marketValue: '1,60,00,000',
    isFreehold: 'Yes, Freehold with Clear Title',
    loanAmount: '90,00,000',
    tenureYears: '15',
    existingLoanTransfer: 'No',
    preferredBank: 'State Bank of India (SBI)'
  });

  // Advisor & Internal Remarks
  const [advisorNotes, setAdvisorNotes] = useState({
    assignedEmp: 'Meena R',
    leadSource: 'Direct Consultation',
    remarks: 'Customer has clear banking track record. Eligible for high LTV sanction.'
  });

  const [formErrors, setFormErrors] = useState({});

  // Category switch handler
  const handleCategorySwitch = (cat) => {
    setActiveCategory(cat);
    setFormErrors({});
    navigate('loans', cat);
  };

  // Filter existing loan customers from CRM
  const loanCustomers = customers.filter(
    (c) =>
      c.type?.toLowerCase().includes('home') ||
      c.type?.toLowerCase().includes('housing') ||
      c.type?.toLowerCase().includes('car') ||
      c.type?.toLowerCase().includes('personal') ||
      c.type?.toLowerCase().includes('business') ||
      c.type?.toLowerCase().includes('property') ||
      (c.type?.toLowerCase().includes('loan') && !c.type?.toLowerCase().includes('education'))
  );

  const filteredLoanList = loanCustomers.filter((item) => {
    const q = listSearch.toLowerCase();
    const matchesSearch =
      !q || (item.name + item.mobile + (item.email || '') + (item.id || '') + (item.type || '')).toLowerCase().includes(q);

    let matchesCat = true;
    if (listCategoryFilter === 'home') matchesCat = item.type?.toLowerCase().includes('home');
    else if (listCategoryFilter === 'housing') matchesCat = item.type?.toLowerCase().includes('housing');
    else if (listCategoryFilter === 'car') matchesCat = item.type?.toLowerCase().includes('car');
    else if (listCategoryFilter === 'personal') matchesCat = item.type?.toLowerCase().includes('personal');
    else if (listCategoryFilter === 'business') matchesCat = item.type?.toLowerCase().includes('business');
    else if (listCategoryFilter === 'lap') matchesCat = item.type?.toLowerCase().includes('property') || item.type?.toLowerCase().includes('lap');

    return matchesSearch && matchesCat;
  });

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!applicantInfo.name.trim()) errs.name = 'Please enter applicant full name.';
    if (!applicantInfo.mobile.trim() || !/^[6-9]\d{9}$/.test(applicantInfo.mobile)) {
      errs.mobile = 'Enter a valid 10-digit Indian mobile number.';
    }

    let customerType = 'Home Loan';
    let requestedAmount = '₹ 50,00,000';
    let remarksStr = '';
    let categoryDetails = {};

    if (activeCategory === 'home') {
      customerType = 'Home Loan';
      requestedAmount = `₹ ${homeLoanData.loanAmount}`;
      remarksStr = `[${formUniqueId}] Home Loan for ${homeLoanData.propertyType} (${homeLoanData.builderProjectName}). Property Cost: ₹${homeLoanData.totalPropertyValue}, Required: ₹${homeLoanData.loanAmount} (${homeLoanData.tenureYears} yrs). Preferred Bank: ${homeLoanData.preferredBank}.`;
      categoryDetails = { ...homeLoanData };
    } else if (activeCategory === 'housing') {
      customerType = 'Housing Loan';
      requestedAmount = `₹ ${housingLoanData.loanAmount}`;
      remarksStr = `[${formUniqueId}] Housing Loan: ${housingLoanData.housingPurpose} at ${housingLoanData.plotLocation}. Construction Cost: ₹${housingLoanData.estimatedConstructionCost}, Loan: ₹${housingLoanData.loanAmount} (${housingLoanData.tenureYears} yrs). Bank: ${housingLoanData.preferredBank}.`;
      categoryDetails = { ...housingLoanData };
    } else if (activeCategory === 'car') {
      customerType = 'Car Loan';
      requestedAmount = `₹ ${carLoanData.loanAmount}`;
      remarksStr = `[${formUniqueId}] Car Loan for ${carLoanData.makeModel} (${carLoanData.vehicleCondition}). On-road: ₹${carLoanData.onRoadPrice}, Loan: ₹${carLoanData.loanAmount} (${carLoanData.tenureYears} yrs). Lender: ${carLoanData.preferredBank}.`;
      categoryDetails = { ...carLoanData };
    } else if (activeCategory === 'personal') {
      customerType = 'Personal Loan';
      requestedAmount = `₹ ${personalLoanData.loanAmount}`;
      remarksStr = `[${formUniqueId}] Personal Loan for ${personalLoanData.loanPurpose}. Amount: ₹${personalLoanData.loanAmount} (${personalLoanData.tenureYears} yrs). Bank: ${personalLoanData.preferredBank}.`;
      categoryDetails = { ...personalLoanData };
    } else if (activeCategory === 'business') {
      customerType = 'Business Loan';
      requestedAmount = `₹ ${businessLoanData.loanAmount}`;
      remarksStr = `[${formUniqueId}] Business Loan for ${businessLoanData.businessConstitution} (${businessLoanData.businessNature}). Annual Turnover: ₹${businessLoanData.annualTurnover}, Loan: ₹${businessLoanData.loanAmount}. Lender: ${businessLoanData.preferredBank}.`;
      categoryDetails = { ...businessLoanData };
    } else if (activeCategory === 'lap') {
      customerType = 'Loan Against Property';
      requestedAmount = `₹ ${lapData.loanAmount}`;
      remarksStr = `[${formUniqueId}] Loan Against Property (${lapData.propertyCategory}). Property Valuation: ₹${lapData.marketValue}, Loan Required: ₹${lapData.loanAmount} (${lapData.tenureYears} yrs). Lender: ${lapData.preferredBank}.`;
      categoryDetails = { ...lapData };
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Add into CRM
    const newLead = addCustomer({
      name: applicantInfo.name,
      mobile: applicantInfo.mobile,
      email: applicantInfo.email,
      type: customerType,
      status: 'Lead',
      followup: '12 Nov 2026',
      emp: advisorNotes.assignedEmp,
      city: applicantInfo.city,
      country: 'India',
      pin: applicantInfo.pincode,
      loanAmount: requestedAmount,
      src: advisorNotes.leadSource || 'Loan Desk Walk-in',
      refName: 'Direct',
      remarks: `${remarksStr} Notes: ${advisorNotes.remarks}`
    });

    addToast(`New ${customerType} Application Registered! Ref: ${formUniqueId}`, 'ok');

    setViewRecord({
      id: formUniqueId,
      customerType,
      applicantInfo: { ...applicantInfo },
      financialInfo: { ...financialInfo },
      categoryDetails,
      requestedAmount,
      advisorNotes: { ...advisorNotes },
      date: todayStr
    });

    setFormUniqueId(getNextLoanId());
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-cg-navy flex items-center gap-2.5">
            <Landmark className="w-7 h-7 text-cg-orange" />
            <span>Retail &amp; Commercial Loans</span>
          </h1>
          
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
            + New Loan Application
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
            All Loan Enquiries ({loanCustomers.length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW LOAN PROPOSAL / SANCTION ADVISORY SLIP               */}
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
              <span>Back to Loan Applications</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-cg-navy bg-white hover:bg-gray-50 border border-cg-border shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Application Slip</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewRecord(null);
                  setActiveTab('list');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cg-blue hover:bg-cg-blue/90"
              >
                View in CRM
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cg-border shadow-card space-y-6 text-xs text-cg-text">
            {/* Slip Header */}
            <div className="flex items-center justify-between border-b-2 border-cg-orange pb-4">
              <div>
                <img src="/assets/logo.png" alt="Capital Grow" className="h-10 w-auto object-contain mb-2" />
                <h2 className="text-lg font-extrabold text-cg-navy uppercase tracking-wide">
                  CAPITAL GROW LOAN ADVISORY &amp; SANCTION DESK
                </h2>
                <p className="text-[11px] text-cg-muted">Direct Selling Associate (DSA) &amp; Authorized Lending Partner</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-cg-orange border border-orange-200">
                  {viewRecord.id}
                </span>
                <span className="block text-cg-muted text-[11px] mt-1.5">
                  Application Date: <b className="text-cg-navy">{viewRecord.date}</b>
                </span>
              </div>
            </div>

            {/* Overview Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-orange-50/40 rounded-xl border border-orange-200">
              <div>
                <span className="text-[10px] text-cg-muted font-bold uppercase block">Applicant Name</span>
                <b className="text-xs font-bold text-cg-navy">{viewRecord.applicantInfo.name}</b>
              </div>
              <div>
                <span className="text-[10px] text-cg-muted font-bold uppercase block">Mobile Number</span>
                <b className="text-xs font-bold text-cg-navy">+91 {viewRecord.applicantInfo.mobile}</b>
              </div>
              <div>
                <span className="text-[10px] text-cg-muted font-bold uppercase block">Loan Product</span>
                <b className="text-xs font-bold text-cg-blue">{viewRecord.customerType}</b>
              </div>
              <div>
                <span className="text-[10px] text-cg-muted font-bold uppercase block">Requested Amount</span>
                <b className="text-sm font-extrabold text-cg-orange">{viewRecord.requestedAmount}</b>
              </div>
            </div>

            {/* Applicant Financial Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl border border-cg-border">
              <div>
                <span className="text-[10px] text-cg-muted font-bold uppercase block">Employment</span>
                <p className="text-xs font-semibold text-cg-navy">{viewRecord.financialInfo.employmentType}</p>
                <span className="text-[10px] text-cg-muted">{viewRecord.financialInfo.employerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-cg-muted font-bold uppercase block">Monthly Income / Salary</span>
                <p className="text-xs font-bold text-cg-navy">₹ {viewRecord.financialInfo.monthlyIncome}</p>
                <span className="text-[10px] text-cg-muted">Existing EMIs: ₹{viewRecord.financialInfo.existingEmis}/mo</span>
              </div>
              <div>
                <span className="text-[10px] text-cg-muted font-bold uppercase block">CIBIL Track &amp; Salary Bank</span>
                <p className="text-xs font-bold text-emerald-700">{viewRecord.financialInfo.cibilScore} (Excellent)</p>
                <span className="text-[10px] text-cg-muted">{viewRecord.financialInfo.salaryBank}</span>
              </div>
            </div>

            {/* Product Specific Summary */}
            <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-200 space-y-2">
              <span className="text-xs font-bold text-cg-navy uppercase tracking-wider block">
                Loan Specification &amp; Collateral Details:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {Object.entries(viewRecord.categoryDetails).map(([key, value]) => {
                  if (typeof value === 'boolean') value = value ? 'Yes' : 'No';
                  if (!value) return null;
                  return (
                    <div key={key}>
                      <span className="text-[10px] text-cg-muted font-bold uppercase block">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <b className="text-cg-navy">{String(value)}</b>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Advisor Notes */}
            <div className="p-3.5 bg-gray-50 rounded-xl border border-cg-border flex items-center justify-between text-[11px]">
              <div>
                <span className="text-cg-muted font-bold uppercase block text-[10px]">Relationship Manager</span>
                <b className="text-cg-navy">{viewRecord.advisorNotes.assignedEmp}</b>
              </div>
              <div>
                <span className="text-cg-muted font-bold uppercase block text-[10px]">Lead Source</span>
                <b className="text-cg-navy">{viewRecord.advisorNotes.leadSource}</b>
              </div>
              <div>
                <span className="text-cg-muted font-bold uppercase block text-[10px]">Status</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  Lead Created (Ready for Login)
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-dashed border-cg-border flex items-center justify-between text-cg-muted text-[11px]">
              <span>Customer Application File registered in Capital Grow CRM • Multi-Bank Submission</span>
              <span>Authorized Officer Signature: _______________________</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FORM TAB: CATEGORY CHOOSER (HOME, HOUSING, CAR, ETC)    */}
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
                    Loan Application Reference No.
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
                  Select loan product below: <b>Home Loan</b>, <b>Housing Loan</b>, <b>Car Loan</b>, <b>Personal</b>, <b>Business</b>, or <b>LAP</b>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
              <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-center min-w-[130px]">
                <span className="text-[10px] text-white/70 uppercase font-bold block">Selected Loan Type</span>
                <b className="text-xs font-bold text-orange-300 block mt-0.5 uppercase">
                  {activeCategory === 'home'
                    ? 'Home Loan'
                    : activeCategory === 'housing'
                    ? 'Housing Loan'
                    : activeCategory === 'car'
                    ? 'Car Loan'
                    : activeCategory === 'personal'
                    ? 'Personal Loan'
                    : activeCategory === 'business'
                    ? 'Business Loan'
                    : 'Loan Against Property'}
                </b>
              </div>
            </div>
          </div>

          {/* Quick Category Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'home', label: 'Home Loan', icon: Home },
              { id: 'housing', label: 'Housing Loan', icon: Building2 },
              { id: 'car', label: 'Car Loan', icon: Car },
              { id: 'personal', label: 'Personal Loan', icon: Coins },
              { id: 'business', label: 'Business Loan', icon: Briefcase },
              { id: 'lap', label: 'Loan Against Property', icon: KeyRound }
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySwitch(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-cg-orange text-white shadow-orange'
                      : 'bg-white text-cg-navy hover:bg-gray-100 border border-cg-border'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-cg-muted'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

       
      

          {/* Form Container */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Section 1: Applicant Personal Details */}
            <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-cg-border pb-3">
                <div className="flex items-center gap-2.5">
                  <User className="w-5 h-5 text-cg-orange" />
                  <h3 className="text-base font-bold text-cg-navy">1. Primary Applicant Personal &amp; KYC Details</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-cg-orange">
                  KYC &amp; Contact
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">Applicant Full Name: *</label>
                  <input
                    type="text"
                    required
                    value={applicantInfo.name}
                    onChange={(e) => setApplicantInfo({ ...applicantInfo, name: e.target.value })}
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
                    value={applicantInfo.mobile}
                    onChange={(e) => setApplicantInfo({ ...applicantInfo, mobile: e.target.value })}
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
                    value={applicantInfo.email}
                    onChange={(e) => setApplicantInfo({ ...applicantInfo, email: e.target.value })}
                    placeholder="anand@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">Date of Birth:</label>
                  <input
                    type="date"
                    value={applicantInfo.dob}
                    onChange={(e) => setApplicantInfo({ ...applicantInfo, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">Gender:</label>
                  <select
                    value={applicantInfo.gender}
                    onChange={(e) => setApplicantInfo({ ...applicantInfo, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">PAN Card Number:</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={applicantInfo.pan}
                    onChange={(e) => setApplicantInfo({ ...applicantInfo, pan: e.target.value.toUpperCase() })}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy uppercase focus:outline-none focus:border-cg-blue font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">City &amp; State:</label>
                  <input
                    type="text"
                    value={applicantInfo.city}
                    onChange={(e) => setApplicantInfo({ ...applicantInfo, city: e.target.value })}
                    placeholder="e.g. Chennai, Tamil Nadu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">PIN Code:</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={applicantInfo.pincode}
                    onChange={(e) => setApplicantInfo({ ...applicantInfo, pincode: e.target.value })}
                    placeholder="e.g. 600020"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">Current Residence Status:</label>
                  <select
                    value={applicantInfo.residenceType}
                    onChange={(e) => setApplicantInfo({ ...applicantInfo, residenceType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                  >
                    <option value="Owned by Self / Parents">Owned by Self / Parents</option>
                    <option value="Rented House">Rented House</option>
                    <option value="Company Provided Accommodation">Company Provided Accommodation</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Financial & Employment Information */}
            <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-cg-border pb-3">
                <div className="flex items-center gap-2.5">
                  <Coins className="w-5 h-5 text-cg-blue" />
                  <h3 className="text-base font-bold text-cg-navy">2. Employment &amp; Financial Eligibility</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-cg-blue">
                  Income &amp; CIBIL
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">Employment Profile:</label>
                  <select
                    value={financialInfo.employmentType}
                    onChange={(e) => setFinancialInfo({ ...financialInfo, employmentType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                  >
                    <option value="Salaried - Corporate / MNC">Salaried - Corporate / MNC</option>
                    <option value="Salaried - Govt / Public Sector">Salaried - Govt / Public Sector</option>
                    <option value="Self-Employed Professional (Doctor, CA, Lawyer)">Self-Employed Professional (Doctor, CA, Lawyer)</option>
                    <option value="Self-Employed Business Owner / Trader">Self-Employed Business Owner / Trader</option>
                    <option value="NRI (Non-Resident Indian)">NRI (Non-Resident Indian)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">Employer / Company Name:</label>
                  <input
                    type="text"
                    value={financialInfo.employerName}
                    onChange={(e) => setFinancialInfo({ ...financialInfo, employerName: e.target.value })}
                    placeholder="e.g. TCS / Infosys / Own Enterprise"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">Net Monthly Salary / Profit (₹):</label>
                  <input
                    type="text"
                    value={financialInfo.monthlyIncome}
                    onChange={(e) => setFinancialInfo({ ...financialInfo, monthlyIncome: e.target.value })}
                    placeholder="e.g. 1,25,000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">Existing Monthly EMIs (₹):</label>
                  <input
                    type="text"
                    value={financialInfo.existingEmis}
                    onChange={(e) => setFinancialInfo({ ...financialInfo, existingEmis: e.target.value })}
                    placeholder="0 if none"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">Salary / Primary Bank Account:</label>
                  <select
                    value={financialInfo.salaryBank}
                    onChange={(e) => setFinancialInfo({ ...financialInfo, salaryBank: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Other Commercial Bank">Other Commercial Bank</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">Estimated CIBIL Score:</label>
                  <select
                    value={financialInfo.cibilScore}
                    onChange={(e) => setFinancialInfo({ ...financialInfo, cibilScore: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-semibold"
                  >
                    <option value="785+ (Excellent)">785+ (Excellent - Best Rates)</option>
                    <option value="750 - 784 (Very Good)">750 - 784 (Very Good)</option>
                    <option value="700 - 749 (Good)">700 - 749 (Good)</option>
                    <option value="650 - 699 (Average)">650 - 699 (Average)</option>
                    <option value="Below 650 / New to Credit">Below 650 / New to Credit</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* SECTION 3: PRODUCT-SPECIFIC FORM FIELDS                   */}
            {/* ======================================================== */}

            {/* 3A: HOME LOAN SPECIFIC */}
            {activeCategory === 'home' && (
              <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-cg-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <Home className="w-5 h-5 text-cg-orange" />
                    <h3 className="text-base font-bold text-cg-navy">3. Home Loan Property &amp; Financing Details</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-cg-orange">
                    Home Loan Form
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Property Purchase Type:</label>
                    <select
                      value={homeLoanData.propertyType}
                      onChange={(e) => setHomeLoanData({ ...homeLoanData, propertyType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-medium"
                    >
                      <option value="Ready to Move Apartment / Flat">Ready to Move Apartment / Flat</option>
                      <option value="Under-Construction Builder Project">Under-Construction Builder Project</option>
                      <option value="Resale Flat / Independent Villa">Resale Flat / Independent Villa</option>
                      <option value="Home Loan Balance Transfer + Top-Up">Home Loan Balance Transfer + Top-Up</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Builder / Project / Society Name:</label>
                    <input
                      type="text"
                      value={homeLoanData.builderProjectName}
                      onChange={(e) => setHomeLoanData({ ...homeLoanData, builderProjectName: e.target.value })}
                      placeholder="e.g. Casagrand, Prestige, Godrej"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Property Location / Area:</label>
                    <input
                      type="text"
                      value={homeLoanData.propertyLocation}
                      onChange={(e) => setHomeLoanData({ ...homeLoanData, propertyLocation: e.target.value })}
                      placeholder="e.g. OMR / Adyar, Chennai"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Total Property Cost / Value (₹):</label>
                    <input
                      type="text"
                      value={homeLoanData.totalPropertyValue}
                      onChange={(e) => setHomeLoanData({ ...homeLoanData, totalPropertyValue: e.target.value })}
                      placeholder="e.g. 85,00,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Applicant Down Payment Planned (₹):</label>
                    <input
                      type="text"
                      value={homeLoanData.downPaymentAmount}
                      onChange={(e) => setHomeLoanData({ ...homeLoanData, downPaymentAmount: e.target.value })}
                      placeholder="e.g. 17,00,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Loan Amount Required (₹): *</label>
                    <input
                      type="text"
                      value={homeLoanData.loanAmount}
                      onChange={(e) => setHomeLoanData({ ...homeLoanData, loanAmount: e.target.value })}
                      placeholder="e.g. 68,00,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-orange focus:outline-none focus:border-cg-blue font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Repayment Tenure (Years):</label>
                    <select
                      value={homeLoanData.tenureYears}
                      onChange={(e) => setHomeLoanData({ ...homeLoanData, tenureYears: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-semibold"
                    >
                      <option value="10">10 Years</option>
                      <option value="15">15 Years</option>
                      <option value="20">20 Years (Popular)</option>
                      <option value="25">25 Years</option>
                      <option value="30">30 Years (Lowest EMI)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Preferred Lending Partner:</label>
                    <select
                      value={homeLoanData.preferredBank}
                      onChange={(e) => setHomeLoanData({ ...homeLoanData, preferredBank: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-semibold"
                    >
                      {HOME_LENDERS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Co-Applicant Status:</label>
                    <select
                      value={homeLoanData.coApplicant}
                      onChange={(e) => setHomeLoanData({ ...homeLoanData, coApplicant: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                    >
                      <option value="Yes - Spouse">Yes - Spouse (Higher Eligibility)</option>
                      <option value="Yes - Father / Mother">Yes - Father / Mother</option>
                      <option value="Yes - Brother / Co-owner">Yes - Brother / Co-owner</option>
                      <option value="No - Single Applicant">No - Single Applicant</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3B: HOUSING LOAN (CONSTRUCTION / PLOT + BUILDING) */}
            {activeCategory === 'housing' && (
              <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-cg-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-5 h-5 text-cg-blue" />
                    <h3 className="text-base font-bold text-cg-navy">3. Housing Construction &amp; Plot Details</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-cg-blue">
                    Housing Loan Form
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Housing Loan Purpose:</label>
                    <select
                      value={housingLoanData.housingPurpose}
                      onChange={(e) => setHousingLoanData({ ...housingLoanData, housingPurpose: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-medium"
                    >
                      <option value="Construction on Own Plot">Self-Construction on Own Land/Plot</option>
                      <option value="Plot Purchase + House Construction">Plot Purchase + House Construction (Combined)</option>
                      <option value="Home Extension / Additional Floor">Home Extension / Additional Floor</option>
                      <option value="Major Structural Renovation & Remodeling">Major Structural Renovation &amp; Remodeling</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Plot Location &amp; Survey No.:</label>
                    <input
                      type="text"
                      value={housingLoanData.plotLocation}
                      onChange={(e) => setHousingLoanData({ ...housingLoanData, plotLocation: e.target.value })}
                      placeholder="e.g. Tambaram East, Survey No. 412/1"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Land / Plot Area (sq ft):</label>
                    <input
                      type="text"
                      value={housingLoanData.plotAreaSqFt}
                      onChange={(e) => setHousingLoanData({ ...housingLoanData, plotAreaSqFt: e.target.value })}
                      placeholder="e.g. 1,800 sq.ft (Ground + 1)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Estimated Construction Cost (₹):</label>
                    <input
                      type="text"
                      value={housingLoanData.estimatedConstructionCost}
                      onChange={(e) => setHousingLoanData({ ...housingLoanData, estimatedConstructionCost: e.target.value })}
                      placeholder="e.g. 55,00,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Loan Amount Required (₹): *</label>
                    <input
                      type="text"
                      value={housingLoanData.loanAmount}
                      onChange={(e) => setHousingLoanData({ ...housingLoanData, loanAmount: e.target.value })}
                      placeholder="e.g. 45,00,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-blue focus:outline-none focus:border-cg-blue font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Repayment Tenure (Years):</label>
                    <select
                      value={housingLoanData.tenureYears}
                      onChange={(e) => setHousingLoanData({ ...housingLoanData, tenureYears: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-semibold"
                    >
                      <option value="10">10 Years</option>
                      <option value="15">15 Years</option>
                      <option value="18">18 Years</option>
                      <option value="20">20 Years</option>
                      <option value="25">25 Years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Building Plan Approval:</label>
                    <select
                      value={housingLoanData.approvedPlanStatus}
                      onChange={(e) => setHousingLoanData({ ...housingLoanData, approvedPlanStatus: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                    >
                      <option value="Approved CMDA / DTCP Plan Available">Approved CMDA / DTCP Plan Available</option>
                      <option value="Approval in Progress">Approval in Progress</option>
                      <option value="Architect Blueprint Ready (Approval Pending)">Architect Blueprint Ready (Approval Pending)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Architect / Civil Estimation Ready?</label>
                    <select
                      value={housingLoanData.contractorEstimationReady}
                      onChange={(e) => setHousingLoanData({ ...housingLoanData, contractorEstimationReady: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                    >
                      <option value="Yes">Yes, Detailed Cost Estimate Signed</option>
                      <option value="Draft Available">Draft Available</option>
                      <option value="Capital Grow to Assist with Valuer">Capital Grow to Assist with Valuer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Preferred Lending Bank / HFC:</label>
                    <select
                      value={housingLoanData.preferredBank}
                      onChange={(e) => setHousingLoanData({ ...housingLoanData, preferredBank: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-semibold"
                    >
                      {HOME_LENDERS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3C: CAR LOAN SPECIFIC */}
            {activeCategory === 'car' && (
              <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-cg-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <Car className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-bold text-cg-navy">3. Vehicle &amp; Auto Loan Specifics</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                    Car Loan Form
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Vehicle Condition:</label>
                    <select
                      value={carLoanData.vehicleCondition}
                      onChange={(e) => setCarLoanData({ ...carLoanData, vehicleCondition: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-medium"
                    >
                      <option value="Brand New Car">Brand New Showroom Car</option>
                      <option value="Certified Pre-Owned / Used Car">Certified Pre-Owned / Used Car</option>
                      <option value="Refinance / Loan on Existing Car">Refinance / Loan on Existing Car</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Car Make &amp; Model: *</label>
                    <input
                      type="text"
                      value={carLoanData.makeModel}
                      onChange={(e) => setCarLoanData({ ...carLoanData, makeModel: e.target.value })}
                      placeholder="e.g. Hyundai Creta, Mahindra XUV700, Tata Nexon"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Fuel &amp; Powertrain Type:</label>
                    <select
                      value={carLoanData.fuelType}
                      onChange={(e) => setCarLoanData({ ...carLoanData, fuelType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric (EV)">Electric (EV - Green Car Rate)</option>
                      <option value="Strong Hybrid">Strong Hybrid</option>
                      <option value="CNG">CNG</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Dealer / Showroom Name:</label>
                    <input
                      type="text"
                      value={carLoanData.dealerShowroom}
                      onChange={(e) => setCarLoanData({ ...carLoanData, dealerShowroom: e.target.value })}
                      placeholder="e.g. DSC Hyundai, Guindy"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">On-Road Quotation Price (₹):</label>
                    <input
                      type="text"
                      value={carLoanData.onRoadPrice}
                      onChange={(e) => setCarLoanData({ ...carLoanData, onRoadPrice: e.target.value })}
                      placeholder="e.g. 21,50,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Down Payment / Margin Money (₹):</label>
                    <input
                      type="text"
                      value={carLoanData.downPaymentAmount}
                      onChange={(e) => setCarLoanData({ ...carLoanData, downPaymentAmount: e.target.value })}
                      placeholder="e.g. 3,50,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Auto Loan Amount Required (₹): *</label>
                    <input
                      type="text"
                      value={carLoanData.loanAmount}
                      onChange={(e) => setCarLoanData({ ...carLoanData, loanAmount: e.target.value })}
                      placeholder="e.g. 18,00,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-emerald-700 focus:outline-none focus:border-cg-blue font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Loan Tenure:</label>
                    <select
                      value={carLoanData.tenureYears}
                      onChange={(e) => setCarLoanData({ ...carLoanData, tenureYears: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-semibold"
                    >
                      <option value="1">1 Year</option>
                      <option value="3">3 Years</option>
                      <option value="5">5 Years (Standard)</option>
                      <option value="7">7 Years (Lowest EMI)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Preferred Auto Financer:</label>
                    <select
                      value={carLoanData.preferredBank}
                      onChange={(e) => setCarLoanData({ ...carLoanData, preferredBank: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-semibold"
                    >
                      {CAR_LENDERS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3D: PERSONAL LOAN SPECIFIC */}
            {activeCategory === 'personal' && (
              <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-cg-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <Coins className="w-5 h-5 text-purple-600" />
                    <h3 className="text-base font-bold text-cg-navy">3. Personal Loan Requirements</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700">
                    Personal Loan Form
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Primary Loan Purpose:</label>
                    <select
                      value={personalLoanData.loanPurpose}
                      onChange={(e) => setPersonalLoanData({ ...personalLoanData, loanPurpose: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-medium"
                    >
                      <option value="Home Renovation & Furnishing">Home Renovation &amp; Furnishing</option>
                      <option value="Family Wedding / Function">Family Wedding / Function</option>
                      <option value="Medical Emergency / Hospitalization">Medical Emergency / Hospitalization</option>
                      <option value="International Travel / Vacation">International Travel / Vacation</option>
                      <option value="Debt Consolidation / Credit Card Payoff">Debt Consolidation / Credit Card Payoff</option>
                      <option value="Child Higher Education Expense">Child Higher Education Expense</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Loan Amount Required (₹): *</label>
                    <input
                      type="text"
                      value={personalLoanData.loanAmount}
                      onChange={(e) => setPersonalLoanData({ ...personalLoanData, loanAmount: e.target.value })}
                      placeholder="e.g. 8,00,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-purple-700 focus:outline-none focus:border-cg-blue font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Tenure:</label>
                    <select
                      value={personalLoanData.tenureYears}
                      onChange={(e) => setPersonalLoanData({ ...personalLoanData, tenureYears: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-semibold"
                    >
                      <option value="1">1 Year (12 Months)</option>
                      <option value="2">2 Years (24 Months)</option>
                      <option value="3">3 Years (36 Months)</option>
                      <option value="4">4 Years (48 Months)</option>
                      <option value="5">5 Years (60 Months)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Preferred Bank / NBFC:</label>
                    <select
                      value={personalLoanData.preferredBank}
                      onChange={(e) => setPersonalLoanData({ ...personalLoanData, preferredBank: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-semibold"
                    >
                      {PERSONAL_LENDERS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Pre-Approved Offer Available?</label>
                    <select
                      value={personalLoanData.preApprovedOffer}
                      onChange={(e) => setPersonalLoanData({ ...personalLoanData, preApprovedOffer: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                    >
                      <option value="Yes">Yes, Bank Sent SMS / Netbanking Offer</option>
                      <option value="No">No, Regular Underwriting Required</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3E: BUSINESS LOAN SPECIFIC */}
            {activeCategory === 'business' && (
              <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-cg-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-5 h-5 text-amber-600" />
                    <h3 className="text-base font-bold text-cg-navy">3. Business Firm &amp; Financial Turnover</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
                    Business Loan Form
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Business Constitution:</label>
                    <select
                      value={businessLoanData.businessConstitution}
                      onChange={(e) => setBusinessLoanData({ ...businessLoanData, businessConstitution: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-medium"
                    >
                      <option value="Private Limited Company">Private Limited Company</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Partnership Firm">Partnership Firm</option>
                      <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Industry / Business Nature:</label>
                    <input
                      type="text"
                      value={businessLoanData.businessNature}
                      onChange={(e) => setBusinessLoanData({ ...businessLoanData, businessNature: e.target.value })}
                      placeholder="e.g. Manufacturing, IT Services, Wholesale Trading"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Years in Operation (Vintage):</label>
                    <select
                      value={businessLoanData.vintageYears}
                      onChange={(e) => setBusinessLoanData({ ...businessLoanData, vintageYears: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                    >
                      <option value="Over 5 Years">Over 5 Years (Lowest Rates)</option>
                      <option value="3 to 5 Years">3 to 5 Years</option>
                      <option value="1 to 3 Years">1 to 3 Years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Annual GST / ITR Turnover (₹):</label>
                    <input
                      type="text"
                      value={businessLoanData.annualTurnover}
                      onChange={(e) => setBusinessLoanData({ ...businessLoanData, annualTurnover: e.target.value })}
                      placeholder="e.g. 2,80,00,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">GST Registration Number:</label>
                    <input
                      type="text"
                      maxLength={15}
                      value={businessLoanData.gstNumber}
                      onChange={(e) => setBusinessLoanData({ ...businessLoanData, gstNumber: e.target.value.toUpperCase() })}
                      placeholder="e.g. 33AABCT1234F1Z5"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy uppercase focus:outline-none focus:border-cg-blue font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Loan Facility Needed:</label>
                    <select
                      value={businessLoanData.loanFacility}
                      onChange={(e) => setBusinessLoanData({ ...businessLoanData, loanFacility: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-medium"
                    >
                      <option value="Working Capital Term Loan">Unsecured Working Capital Term Loan</option>
                      <option value="Cash Credit / Overdraft Facility (CC/OD)">Cash Credit / Overdraft Facility (CC/OD)</option>
                      <option value="Machinery & Equipment Finance">Machinery &amp; Equipment Finance</option>
                      <option value="Invoice Discounting / Trade Finance">Invoice Discounting / Trade Finance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Business Loan Amount (₹): *</label>
                    <input
                      type="text"
                      value={businessLoanData.loanAmount}
                      onChange={(e) => setBusinessLoanData({ ...businessLoanData, loanAmount: e.target.value })}
                      placeholder="e.g. 35,00,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-amber-700 focus:outline-none focus:border-cg-blue font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Preferred MSME Lender:</label>
                    <select
                      value={businessLoanData.preferredBank}
                      onChange={(e) => setBusinessLoanData({ ...businessLoanData, preferredBank: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-semibold"
                    >
                      {BUSINESS_LENDERS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3F: LOAN AGAINST PROPERTY (LAP) SPECIFIC */}
            {activeCategory === 'lap' && (
              <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-cg-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <KeyRound className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-base font-bold text-cg-navy">3. Mortgage Property &amp; Valuation Details</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-700">
                    LAP Mortgage Form
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Property Category:</label>
                    <select
                      value={lapData.propertyCategory}
                      onChange={(e) => setLapData({ ...lapData, propertyCategory: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-medium"
                    >
                      <option value="Residential House / Apartment">Residential House / Apartment</option>
                      <option value="Commercial Office / Shop / Showroom">Commercial Office / Shop / Showroom</option>
                      <option value="Industrial Shed / Factory Building">Industrial Shed / Factory Building</option>
                      <option value="Open Commercial / Residential Plot">Open Commercial / Residential Plot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Current Occupancy / Usage:</label>
                    <select
                      value={lapData.propertyUsage}
                      onChange={(e) => setLapData({ ...lapData, propertyUsage: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                    >
                      <option value="Self-Occupied Residential">Self-Occupied Residential</option>
                      <option value="Self-Occupied Business / Office">Self-Occupied Business / Office</option>
                      <option value="Rented Out (Rental Income Yielding)">Rented Out (Rental Income Yielding)</option>
                      <option value="Vacant Property">Vacant Property</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Estimated Market Value (₹):</label>
                    <input
                      type="text"
                      value={lapData.marketValue}
                      onChange={(e) => setLapData({ ...lapData, marketValue: e.target.value })}
                      placeholder="e.g. 1,60,00,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Loan Amount Required (₹): *</label>
                    <input
                      type="text"
                      value={lapData.loanAmount}
                      onChange={(e) => setLapData({ ...lapData, loanAmount: e.target.value })}
                      placeholder="e.g. 90,00,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-indigo-700 focus:outline-none focus:border-cg-blue font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Desired Tenure:</label>
                    <select
                      value={lapData.tenureYears}
                      onChange={(e) => setLapData({ ...lapData, tenureYears: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-semibold"
                    >
                      <option value="5">5 Years</option>
                      <option value="10">10 Years</option>
                      <option value="15">15 Years (Standard)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1.5">Preferred Mortgage Lender:</label>
                    <select
                      value={lapData.preferredBank}
                      onChange={(e) => setLapData({ ...lapData, preferredBank: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-semibold"
                    >
                      {LAP_LENDERS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Advisor & Follow-up Assignment */}
            <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-cg-border pb-3">
                <div className="flex items-center gap-2.5">
                  <Compass className="w-5 h-5 text-cg-navy" />
                  <h3 className="text-base font-bold text-cg-navy">4. CRM Assignment &amp; Special Processing Notes</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-cg-navy">
                  CRM Workflow
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">Assigned Relationship Manager:</label>
                  <select
                    value={advisorNotes.assignedEmp}
                    onChange={(e) => setAdvisorNotes({ ...advisorNotes, assignedEmp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-semibold"
                  >
                    <option value="Meena R">Meena R (Senior Loan Specialist)</option>
                    <option value="Arun K">Arun K (Mortgage & Auto Manager)</option>
                    <option value="Kavitha S">Kavitha S (Retail Underwriting)</option>
                    <option value="Rajesh M">Rajesh M (Commercial Head)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">Lead Acquisition Channel:</label>
                  <select
                    value={advisorNotes.leadSource}
                    onChange={(e) => setAdvisorNotes({ ...advisorNotes, leadSource: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                  >
                    <option value="Direct Consultation">Direct Walk-in Consultation</option>
                    <option value="Builder / Dealer Referral">Builder / Automobile Dealer Referral</option>
                    <option value="Website & Digital Ads">Website &amp; Digital Campaign</option>
                    <option value="Chartered Accountant Channel">Chartered Accountant Channel</option>
                    <option value="Existing Client Referral">Existing Client Referral</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">Special Processing Instructions:</label>
                  <input
                    type="text"
                    value={advisorNotes.remarks}
                    onChange={(e) => setAdvisorNotes({ ...advisorNotes, remarks: e.target.value })}
                    placeholder="e.g. Fast-track approval needed for builder agreement"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-cg-border shadow-card">
              <div className="flex items-center gap-2 text-xs text-cg-muted">
                <AlertCircle className="w-4 h-4 text-cg-orange shrink-0" />
                <span>
                  Clicking submit registers the application in Capital Grow CRM under <b>Leads</b> with Unique ID <b>{formUniqueId}</b>.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setApplicantInfo({
                      name: '',
                      mobile: '',
                      email: '',
                      dob: '1992-05-14',
                      gender: 'Male',
                      pan: '',
                      aadhaar: '',
                      city: 'Chennai',
                      state: 'Tamil Nadu',
                      pincode: '600020',
                      residenceType: 'Owned by Self / Parents',
                      address: ''
                    });
                    setFormErrors({});
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-cg-muted hover:text-cg-text bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Reset Form
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cg-orange to-cg-orange-hover hover:opacity-95 shadow-orange transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Loan Application</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* ALL LOAN ENQUIRIES TABLE VIEW                            */}
      {/* ======================================================== */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-cg-border">
            <div>
              <h2 className="text-base font-bold text-cg-navy">All Active Loan Applications</h2>
              <p className="text-xs text-cg-muted">
                Showing all Home, Housing, Car, Personal, Business &amp; LAP leads in the pipeline
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter Chips */}
              <div className="inline-flex bg-gray-100 p-1 rounded-xl gap-1 text-[11px] font-bold">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'home', label: 'Home' },
                  { id: 'housing', label: 'Housing' },
                  { id: 'car', label: 'Car' },
                  { id: 'personal', label: 'Personal' },
                  { id: 'business', label: 'Business' },
                  { id: 'lap', label: 'LAP' }
                ].map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setListCategoryFilter(chip.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      listCategoryFilter === chip.id
                        ? 'bg-cg-navy text-white shadow-xs'
                        : 'text-cg-muted hover:text-cg-navy'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-cg-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={listSearch}
                  onChange={(e) => setListSearch(e.target.value)}
                  placeholder="Search name, phone, loan ID..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-cg-border text-xs text-cg-navy focus:outline-none focus:border-cg-blue"
                />
              </div>
            </div>
          </div>

          {/* Leads Table */}
          {filteredLoanList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-cg-border text-cg-muted font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3">Applicant Name</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Loan Product</th>
                    <th className="py-3 px-3">Loan Amount</th>
                    <th className="py-3 px-3">Current Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cg-border">
                  {filteredLoanList.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3 px-3">
                        <b className="text-xs font-bold text-cg-navy block">{item.name}</b>
                        <span className="text-[10px] text-cg-muted font-mono">{item.id}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs font-medium text-cg-navy block">+91 {item.mobile}</span>
                        <span className="text-[10px] text-cg-muted truncate max-w-[150px] block">
                          {item.email || item.city || 'Chennai'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.type?.toLowerCase().includes('home')
                              ? 'bg-orange-50 text-cg-orange border-orange-200'
                              : item.type?.toLowerCase().includes('housing')
                              ? 'bg-blue-50 text-cg-blue border-blue-200'
                              : item.type?.toLowerCase().includes('car')
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : item.type?.toLowerCase().includes('personal')
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <b className="text-xs font-bold text-cg-navy block">{item.loanAmount || '₹ 50 Lakh'}</b>
                        <p className="text-[10px] text-cg-muted truncate max-w-[220px] mt-0.5">{item.remarks}</p>
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
                            title="Call applicant"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setViewRecord({
                                id: item.id,
                                customerType: item.type,
                                applicantInfo: {
                                  name: item.name,
                                  mobile: item.mobile,
                                  email: item.email,
                                  city: item.city || 'Chennai'
                                },
                                financialInfo: {
                                  employmentType: 'Salaried Professional',
                                  employerName: 'Corporate',
                                  monthlyIncome: '1,20,000',
                                  existingEmis: '15,000',
                                  salaryBank: 'HDFC Bank',
                                  cibilScore: '780'
                                },
                                categoryDetails: {
                                  loanAmount: item.loanAmount,
                                  remarks: item.remarks
                                },
                                requestedAmount: item.loanAmount,
                                advisorNotes: {
                                  assignedEmp: item.emp || 'Meena R',
                                  leadSource: item.src || 'Direct Walk-in'
                                },
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
              <h3 className="text-base font-bold text-cg-navy mb-1">No loan enquiries found</h3>
              <p className="text-xs text-cg-muted mb-4">Click below to start a new Home, Housing, Car, Personal, or Business loan application.</p>
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="px-4 py-2.5 bg-cg-orange text-white rounded-xl text-xs font-bold shadow-orange"
              >
                + New Loan Application
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoansPage;


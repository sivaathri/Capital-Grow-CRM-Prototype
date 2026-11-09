import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Plus,
  Printer,
  Trash2,
  Eye,
  Check,
  Search,
  ArrowLeft,
  ArrowRight,
  Shield,
  Building,
  Building2,
  User,
  Users,
  GraduationCap,
  Briefcase,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  FileCheck,
  Copy
} from 'lucide-react';

const COUNTRIES = [
  { code: 'India', flag: '🇮🇳', name: 'India' },
  { code: 'USA', flag: '🇺🇸', name: 'USA' },
  { code: 'Canada', flag: '🇨🇦', name: 'Canada' },
  { code: 'UK', flag: '🇬🇧', name: 'UK' },
  { code: 'France', flag: '🇫🇷', name: 'France' },
  { code: 'Others', flag: '🌐', name: 'Others.' }
];

const CO_APP_RELATIONSHIPS = [
  'Father',
  'Mother',
  'Brother',
  'Sister',
  'Spouse',
  'Self',
  'Relative (Specify)'
];

const CO_APP_OCCUPATIONS = [
  'Employed',
  'Self Employed',
  'Professional (i.e. Lawyer, Doctor, CA, etc.)',
  'Retired',
  'Others (Specify)'
];

export const EducationLoanPage = () => {
  const { educationLoans, addEducationLoan, deleteEducationLoan, saveLoginDetails, route, navigate, confirm, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'list'
  const [formStep, setFormStep] = useState(1); // 1 = Form 1: Student Details & Academics, 2 = Form 2: Co-Applicant & References
  const [viewSlipId, setViewSlipId] = useState(null);

  // Helper to calculate the next unique sequential enquiry number (e.g. CG-EDU-2026-0005)
  const getNextUniqueNo = () => {
    const year = new Date().getFullYear();
    let maxSeq = 4;
    educationLoans.forEach((item) => {
      if (item.id && typeof item.id === 'string') {
        const parts = item.id.split('-');
        const lastPart = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(lastPart) && lastPart > maxSeq) {
          maxSeq = lastPart;
        }
      }
    });
    return `CG-EDU-${year}-${String(maxSeq + 1).padStart(4, '0')}`;
  };

  const [formUniqueId, setFormUniqueId] = useState(getNextUniqueNo);
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard?.writeText(formUniqueId);
    setCopiedId(true);
    if (addToast) addToast(`Copied Application Unique Ref No: ${formUniqueId}`, 'ok');
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Quick Login Modal from Education Loan page
  const [quickLoginModal, setQuickLoginModal] = useState({ isOpen: false, item: null });
  const [quickLoginData, setQuickLoginData] = useState({ bankName: 'HDFC Credila', smName: '', appNo: '' });

  // Search & Filters for All Enquiries list
  const [listSearch, setListSearch] = useState('');
  const [listCountry, setListCountry] = useState('');
  const [listStatus, setListStatus] = useState('');

  // Form State
  const todayStr = new Date().toISOString().slice(0, 10);
  const initialFormState = {
    // FORM 1: Student & Academic Details
    date: todayStr,
    consultancyName: '',
    loanAmount: '',
    studentName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: 'Male',
    maritalStatus: 'Single',
    mobile: '',
    email: '',
    residenceType: 'Self Owned',
    monthlyRent: '',
    currentAddress: '',
    currentPincode: '',
    sameAsCurrentAddress: false,
    permAddress: '',
    permPincode: '',
    // Single empty row by default as requested!
    education: [{ exam: '', year: '', marks: '', school: '' }],
    entranceTest: 'None',
    entranceScore: '',
    degreeA: '',
    degreeB: '',
    degreeC: '',
    admissionStatus: 'Confirmed',
    courseDuration: '2 Years',
    university: '',
    courseName: '',
    country: 'USA',
    otherCountry: '',

    // FORM 2: CO-APPLICANT DETAILS
    coAppRelationship: 'Father',
    coAppRelationshipOther: '',
    coAppName: '',
    coAppMobile: '',
    coAppEmail: '',

    // FORM 2: EMPLOYMENT/BUSINESS DETAILS OF CO-APPLICANT
    coAppOccupation: 'Employed',
    coAppOccupationOther: '',
    coAppEmployerName: '',
    coAppDesignation: '',
    coAppOfficialEmail: '',
    coAppGrossIncome: '',
    coAppNetIncome: '',
    coAppYearsInEmployment: '',

    // FORM 2: STUDENT REFERENCE
    refName: '',
    refAddress: '',
    refMobile: '',
    refEmail: '',
    refDate: todayStr,
    studentSignature: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // If route asks for viewing slip directly
  if (route.action === 'view' && route.id) {
    const item = educationLoans.find((x) => x.id === route.id);
    return (
      <EnquirySlipView
        item={item}
        onBack={() => navigate('education-loan')}
      />
    );
  }

  // Field change handler
  const handleFieldChange = (field, val) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: val };
      if (field === 'sameAsCurrentAddress') {
        if (val) {
          next.permAddress = prev.currentAddress;
          next.permPincode = prev.currentPincode;
        }
      } else if (prev.sameAsCurrentAddress) {
        if (field === 'currentAddress') next.permAddress = val;
        if (field === 'currentPincode') next.permPincode = val;
      }
      return next;
    });

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Dynamic Education Table Rows
  const handleEduRowChange = (index, col, val) => {
    setFormData((prev) => {
      const rows = [...prev.education];
      rows[index] = { ...rows[index], [col]: val };
      return { ...prev, education: rows };
    });
  };

  const addEduRow = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { exam: '', year: '', marks: '', school: '' }]
    }));
  };

  const removeEduRow = (index) => {
    setFormData((prev) => {
      if (prev.education.length > 1) {
        return {
          ...prev,
          education: prev.education.filter((_, i) => i !== index)
        };
      }
      // If only one row left, clear it
      return {
        ...prev,
        education: [{ exam: '', year: '', marks: '', school: '' }]
      };
    });
  };

  // Validation for Form 1 before proceeding to Form 2
  const validateForm1 = () => {
    const errs = {};
    if (!formData.studentName.trim()) errs.studentName = 'Please enter student full name.';
    if (!formData.fatherName.trim()) errs.fatherName = "Please enter father's name.";
    if (!formData.mobile.trim() || !/^[6-9]\d{9}$/.test(formData.mobile)) {
      errs.mobile = 'Enter a valid 10-digit mobile number.';
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Enter a valid email address.';
    }
    if (!formData.loanAmount.trim()) errs.loanAmount = 'Please specify loan amount.';
    if (!formData.university.trim()) errs.university = 'Please enter university/college.';
    if (!formData.courseName.trim()) errs.courseName = 'Please enter course name.';
    if (formData.country === 'Others' && !formData.otherCountry.trim()) {
      errs.country = 'Please specify country.';
    }
    if (formData.currentPincode && !/^\d{6}$/.test(formData.currentPincode)) {
      errs.currentPincode = 'Pincode must be 6 digits.';
    }
    return errs;
  };

  // Move from Form 1 to Form 2
  const handleProceedToForm2 = () => {
    const errs = validateForm1();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setFormErrors({});
    setFormStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Form Submit Handler (Executed only from Form 2)
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateForm1();

    if (Object.keys(errs).length) {
      setFormErrors(errs);
      setFormStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Filter education rows that have at least some data
    const validEdu = formData.education.filter(
      (r) => r.exam.trim() || r.year.trim() || r.marks.trim() || r.school.trim()
    );

    const newRecord = addEducationLoan({
      ...formData,
      id: formUniqueId,
      education: validEdu,
      loanAmount: formData.loanAmount.startsWith('₹') ? formData.loanAmount : `₹ ${formData.loanAmount}`
    });

    setFormData(initialFormState);
    setFormStep(1);
    setFormUniqueId(getNextUniqueNo());
    navigate('education-loan', 'view', newRecord.id);
  };

  const handleReset = async () => {
    const ok = await confirm('Reset Form?', 'All unsaved form inputs will be cleared.');
    if (ok) {
      setFormData(initialFormState);
      setFormErrors({});
      setFormStep(1);
      setFormUniqueId(getNextUniqueNo());
    }
  };

  // Filtered List for Table Tab
  const filteredList = educationLoans.filter((item) => {
    const q = listSearch.toLowerCase();
    const matchesSearch =
      !q ||
      (item.id + item.studentName + item.mobile + item.university + item.courseName + (item.consultancyName || '')).toLowerCase().includes(q);
    const matchesCountry = !listCountry || item.country === listCountry;
    const matchesStatus = !listStatus || (item.crmStatus || 'Under Process') === listStatus;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-cg-navy flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-cg-orange" />
            <span>Student Details for Education Loan</span>
          </h1>
          <p className="text-sm text-cg-muted mt-0.5">
            Student Profile, Academic History, Target University & Study Abroad Loan Enquiry Form
          </p>
        </div>

        {/* Tab switchers */}
        <div className="inline-flex bg-gray-200/60 p-1.5 rounded-xl gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'form'
                ? 'bg-white text-cg-navy shadow-sm'
                : 'text-cg-muted hover:text-cg-text'
            }`}
          >
            + New Loan Enquiry
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'list'
                ? 'bg-white text-cg-navy shadow-sm'
                : 'text-cg-muted hover:text-cg-text'
            }`}
          >
            All Enquiries ({educationLoans.length})
          </button>
        </div>
      </div>

      {activeTab === 'form' ? (
        /* ============================================================== */
        /* ENQUIRY FORM VIEW                                              */
        /* ============================================================== */
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* ============================================================== */}
          {/* TOP UNIQUE APPLICATION NUMBER BANNER                            */}
          {/* ============================================================== */}
          <div className="bg-gradient-to-r from-cg-navy via-[#0d2a4d] to-cg-blue rounded-2xl p-4 sm:p-5 text-white shadow-card border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-cg-orange border border-white/20 shrink-0">
                <FileCheck className="w-6 h-6 text-cg-orange" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-300">
                    Unique Application Reference No.
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Auto-Generated Unique ID
                  </span>
                </div>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="font-mono text-xl sm:text-2xl font-black tracking-wider text-white drop-shadow-sm select-all">
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
                  Lifecycle Tracking: <b>Enquiry</b> &rarr; <b>Lead</b> &rarr; <b>Bank Login</b> &rarr; <b>Sanction</b> &rarr; <b>Disbursement / Payouts</b>
                </p>
              </div>
            </div>

            {/* Right Meta Badges */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
              <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-center min-w-[105px]">
                <span className="text-[10px] text-white/70 uppercase font-bold block">Application Date</span>
                <b className="text-xs font-bold text-white block mt-0.5">{formData.date || todayStr}</b>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-center min-w-[120px]">
                <span className="text-[10px] text-white/70 uppercase font-bold block">Current Step</span>
                <b className="text-xs font-bold text-orange-300 block mt-0.5">
                  {formStep === 1 ? '1. Student Details' : '2. Co-Applicant'}
                </b>
              </div>
            </div>
          </div>

          {/* Form 1 vs Form 2 Dual Form Switcher */}
          <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-cg-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="inline-flex bg-gray-100 p-1.5 rounded-xl w-full sm:w-auto gap-1">
              <button
                type="button"
                onClick={() => setFormStep(1)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  formStep === 1
                    ? 'bg-white text-cg-navy shadow-sm'
                    : 'text-cg-muted hover:text-cg-text'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-cg-navy text-white text-[10px] flex items-center justify-center font-bold">
                  1
                </span>
                <span>Form 1: Student Details &amp; Academics</span>
              </button>
              <button
                type="button"
                onClick={handleProceedToForm2}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  formStep === 2
                    ? 'bg-white text-cg-navy shadow-sm'
                    : 'text-cg-muted hover:text-cg-text'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-cg-orange text-white text-[10px] flex items-center justify-center font-bold">
                  2
                </span>
                <span>Form 2: Co-Applicant, Employment &amp; Reference</span>
                {Boolean(formData.coAppName || formData.coAppMobile) && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            </div>

            <div className="text-xs text-cg-muted font-medium flex items-center gap-2 px-2">
              <span className="w-2 h-2 rounded-full bg-cg-orange animate-pulse" />
              <span>Step-by-step: <b>Form 1</b> &rarr; <b>Form 2</b> &rarr; <b>Submit</b></span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* VIEW A: FORM 1 (STUDENT DETAILS & ACADEMICS)                   */}
          {/* ============================================================== */}
          {formStep === 1 && (
            <div className="space-y-6">
              {/* STEP 1: General & Enquiry Header */}
              <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-cg-border pb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-gradient-to-r from-cg-orange to-cg-orange-hover text-white text-xs font-bold flex items-center justify-center">
                  ★
                </span>
                <div>
                  <h3 className="text-base font-bold text-cg-navy">STUDENT DETAILS FOR EDUCATION LOAN</h3>
                  <p className="text-xs text-cg-muted">Application date, consultancy partner, and requested loan amount</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-50 text-cg-blue border border-blue-200">
                  Unique Ref: {formUniqueId}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-cg-blue">
                  Step 1 of 4
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Date: *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleFieldChange('date', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Consultancy Name:</label>
                <input
                  type="text"
                  list="consultancyList"
                  value={formData.consultancyName}
                  onChange={(e) => handleFieldChange('consultancyName', e.target.value)}
                  placeholder="e.g. Apex Overseas / Direct Walk-in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                />
                <datalist id="consultancyList">
                  <option value="Direct Walk-in" />
                  <option value="Apex Overseas Education" />
                  <option value="Global Edutech Partners" />
                  <option value="IDP Education" />
                  <option value="Study Metro Consultants" />
                  <option value="Canam Overseas" />
                  <option value="Y-Axis Study Abroad" />
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Loan Amount: *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cg-muted font-bold text-sm">₹</span>
                  <input
                    type="text"
                    value={formData.loanAmount}
                    onChange={(e) => handleFieldChange('loanAmount', e.target.value)}
                    placeholder="e.g. 35,00,000"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                  />
                </div>
                {formErrors.loanAmount && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.loanAmount}</span>
                )}
                {/* Quick amount chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['15,00,000', '25,00,000', '35,00,000', '50,00,000', '75,00,000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleFieldChange('loanAmount', amt)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-cg-light-blue text-cg-blue hover:bg-cg-blue hover:text-white rounded-lg transition-colors border border-blue-100"
                    >
                      ₹{amt.slice(0, 2)}L
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: STUDENT DETAILS */}
          <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-cg-border pb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-cg-navy text-white text-xs font-bold flex items-center justify-center">
                  A
                </span>
                <div>
                  <h3 className="text-base font-bold text-cg-navy">STUDENT DETAILS</h3>
                  <p className="text-xs text-cg-muted">Primary applicant identity, residence, family, and contact details</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-cg-blue">
                Step 2 of 4
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Name: *</label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => handleFieldChange('studentName', e.target.value)}
                  placeholder="Student's Full Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                />
                {formErrors.studentName && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.studentName}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Father's Name: *</label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => handleFieldChange('fatherName', e.target.value)}
                  placeholder="Father's Full Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                />
                {formErrors.fatherName && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.fatherName}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Mother's Name:</label>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => handleFieldChange('motherName', e.target.value)}
                  placeholder="Mother's Full Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Date of Birth:</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleFieldChange('dob', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue bg-white"
                />
              </div>

              {/* Gender Choice Cards */}
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Gender:</label>
                <div className="flex flex-wrap gap-2">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleFieldChange('gender', g)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        formData.gender === g
                          ? 'border-cg-blue bg-blue-50 text-cg-navy shadow-sm'
                          : 'border-cg-border bg-white text-cg-text hover:bg-gray-50'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                        formData.gender === g ? 'bg-cg-blue text-white border-cg-blue' : 'border-gray-300'
                      }`}>
                        {formData.gender === g && '✓'}
                      </span>
                      <span>{g}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Marital Status Choice Cards */}
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Marital Status:</label>
                <div className="flex flex-wrap gap-2">
                  {['Single', 'Married', 'Other'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleFieldChange('maritalStatus', m)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        formData.maritalStatus === m
                          ? 'border-cg-orange bg-orange-50/50 text-cg-navy shadow-sm'
                          : 'border-cg-border bg-white text-cg-text hover:bg-gray-50'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                        formData.maritalStatus === m ? 'bg-cg-orange text-white border-cg-orange' : 'border-gray-300'
                      }`}>
                        {formData.maritalStatus === m && '✓'}
                      </span>
                      <span>{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">10 Mobile No: *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cg-muted font-bold text-xs">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => handleFieldChange('mobile', e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                  />
                </div>
                {formErrors.mobile && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.mobile}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">E-mail ID: *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="student.name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                />
                {formErrors.email && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.email}</span>
                )}
              </div>

              {/* Current Residence */}
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Current Residence:</label>
                <div className="flex flex-wrap gap-2">
                  {['Self Owned', 'Rented'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleFieldChange('residenceType', r)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        formData.residenceType === r
                          ? 'border-cg-orange bg-orange-50 text-cg-navy shadow-sm'
                          : 'border-cg-border bg-white text-cg-text hover:bg-gray-50'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                        formData.residenceType === r ? 'bg-cg-orange text-white border-cg-orange' : 'border-gray-300'
                      }`}>
                        {formData.residenceType === r && '✓'}
                      </span>
                      <span>{r === 'Self Owned' ? 'Self Owned' : 'Rented'}</span>
                    </button>
                  ))}
                </div>
                {formData.residenceType === 'Rented' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={formData.monthlyRent}
                      onChange={(e) => handleFieldChange('monthlyRent', e.target.value)}
                      placeholder="Monthly Rent amount (e.g. ₹18,000)"
                      className="w-full px-3 py-2 rounded-xl border border-cg-border text-xs focus:outline-none focus:border-cg-blue"
                    />
                  </div>
                )}
              </div>

              {/* Current Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Current Residential Address:</label>
                <textarea
                  rows={2}
                  value={formData.currentAddress}
                  onChange={(e) => handleFieldChange('currentAddress', e.target.value)}
                  placeholder="House/Flat No, Street, Landmark, City, State"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Pincode:</label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.currentPincode}
                  onChange={(e) => handleFieldChange('currentPincode', e.target.value)}
                  placeholder="e.g. 600020"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                />
                {formErrors.currentPincode && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.currentPincode}</span>
                )}
              </div>

              {/* Same as Current Address Toggle Checkbox */}
              <div className="lg:col-span-3">
                <label className="flex items-center gap-2 p-3 bg-blue-50/70 border border-blue-200 rounded-xl cursor-pointer text-xs font-bold text-cg-navy">
                  <input
                    type="checkbox"
                    checked={formData.sameAsCurrentAddress}
                    onChange={(e) => handleFieldChange('sameAsCurrentAddress', e.target.checked)}
                    className="w-4 h-4 rounded text-cg-blue focus:ring-cg-blue border-gray-300 accent-cg-blue cursor-pointer"
                  />
                  <span>Same as Current Residential Address (Check to auto-copy address & pincode)</span>
                </label>
              </div>

              {/* Permanent Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-cg-navy mb-1.5">7. Permanent Residential Address:</label>
                <textarea
                  rows={2}
                  value={formData.permAddress}
                  readOnly={formData.sameAsCurrentAddress}
                  onChange={(e) => handleFieldChange('permAddress', e.target.value)}
                  placeholder="Permanent House/Flat No, Street, Town/City, District, State"
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue ${
                    formData.sameAsCurrentAddress ? 'bg-gray-50 text-cg-muted' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Permanent Pincode:</label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.permPincode}
                  readOnly={formData.sameAsCurrentAddress}
                  onChange={(e) => handleFieldChange('permPincode', e.target.value)}
                  placeholder="e.g. 600020"
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue ${
                    formData.sameAsCurrentAddress ? 'bg-gray-50 text-cg-muted' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          {/* STEP 3: 12. Educational Details */}
          <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-cg-border pb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-cg-navy text-white text-xs font-bold flex items-center justify-center">
                  B
                </span>
                <div>
                  <h3 className="text-base font-bold text-cg-navy">Educational Details</h3>
                  <p className="text-xs text-cg-muted">Academic track record, entrance examination score, and degrees obtained</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-cg-blue">
                Step 3 of 4
              </span>
            </div>

            {/* Table Header & + Add button */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cg-navy uppercase tracking-wider">
                Academic Qualification Table
              </span>
              <button
                type="button"
                onClick={addEduRow}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-gray-50 border border-cg-border text-cg-navy shadow-sm transition-all"
              >
                + Add Qualification Row
              </button>
            </div>

            {/* Qualification Table (Single empty row by default, completely empty inputs) */}
            <div className="overflow-x-auto border border-cg-border rounded-xl">
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-cg-border text-cg-muted font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3 w-1/4">EXAM / COURSE</th>
                    <th className="py-2.5 px-3 w-1/6">YEAR COMPLETED</th>
                    <th className="py-2.5 px-3 w-1/6">MARKS (%)</th>
                    <th className="py-2.5 px-3">SCHOOL / COLLEGE / UNIVERSITY</th>
                    <th className="py-2.5 px-3 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cg-border bg-white">
                  {formData.education.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.exam}
                          onChange={(e) => handleEduRowChange(idx, 'exam', e.target.value)}
                          placeholder="Exam / Course (e.g. 10th, 12th, Degree)"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-cg-border focus:outline-none focus:border-cg-blue"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.year}
                          onChange={(e) => handleEduRowChange(idx, 'year', e.target.value)}
                          placeholder="Year Completed"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-cg-border focus:outline-none focus:border-cg-blue"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.marks}
                          onChange={(e) => handleEduRowChange(idx, 'marks', e.target.value)}
                          placeholder="Marks (%)"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-cg-border focus:outline-none focus:border-cg-blue"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.school}
                          onChange={(e) => handleEduRowChange(idx, 'school', e.target.value)}
                          placeholder="School / College / University"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-cg-border focus:outline-none focus:border-cg-blue"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeEduRow(idx)}
                          className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors mx-auto text-xs font-bold"
                          title="Remove row"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Entrance Test Box */}
            <div className="p-4 bg-gray-50/70 border border-cg-border rounded-xl mt-4">
              <h4 className="text-xs font-bold text-cg-navy mb-3 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-cg-orange" />
                <span>Entrance Test</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">NAME OF ENTRANCE TEST:</label>
                  <select
                    value={formData.entranceTest}
                    onChange={(e) => handleFieldChange('entranceTest', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue bg-white"
                  >
                    <option value="None">None / Not Applicable</option>
                    <option value="GRE">GRE</option>
                    <option value="IELTS">IELTS</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="PTE">PTE</option>
                    <option value="Duolingo">Duolingo</option>
                    <option value="GMAT">GMAT</option>
                    <option value="SAT">SAT</option>
                    <option value="Other">Other Entrance Test</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">SCORE:</label>
                  <input
                    type="text"
                    value={formData.entranceScore}
                    onChange={(e) => handleFieldChange('entranceScore', e.target.value)}
                    placeholder="e.g. GRE 322 or IELTS 7.5 Band"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Name of Degree: a, b, c */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-cg-navy mb-2">NAME OF DEGREE:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-cg-orange text-xs">a)</span>
                  <input
                    type="text"
                    value={formData.degreeA}
                    onChange={(e) => handleFieldChange('degreeA', e.target.value)}
                    placeholder="Degree Name (e.g. B.Tech Computer Science)"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-cg-border text-xs focus:outline-none focus:border-cg-blue"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-cg-orange text-xs">b)</span>
                  <input
                    type="text"
                    value={formData.degreeB}
                    onChange={(e) => handleFieldChange('degreeB', e.target.value)}
                    placeholder="Degree Name (optional)"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-cg-border text-xs focus:outline-none focus:border-cg-blue"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-cg-orange text-xs">c)</span>
                  <input
                    type="text"
                    value={formData.degreeC}
                    onChange={(e) => handleFieldChange('degreeC', e.target.value)}
                    placeholder="Degree Name (optional)"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-cg-border text-xs focus:outline-none focus:border-cg-blue"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: B COURSE DETAILS */}
          <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-cg-border pb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-cg-navy text-white text-xs font-bold flex items-center justify-center">
                  C
                </span>
                <div>
                  <h3 className="text-base font-bold text-cg-navy">COURSE DETAILS</h3>
                  <p className="text-xs text-cg-muted">Admission status, study destination, university, and proposed program</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-cg-blue">
                Step 4 of 4
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Admission Status */}
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">1. Admission Status:</label>
                <div className="flex flex-wrap gap-2">
                  {['Confirmed', 'Awaited'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleFieldChange('admissionStatus', status)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        formData.admissionStatus === status
                          ? 'border-cg-orange bg-orange-50 text-cg-navy shadow-sm'
                          : 'border-cg-border bg-white text-cg-text hover:bg-gray-50'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                        formData.admissionStatus === status ? 'bg-cg-orange text-white border-cg-orange' : 'border-gray-300'
                      }`}>
                        {formData.admissionStatus === status && '✓'}
                      </span>
                      <span>{status === 'Confirmed' ? 'Confirmed' : 'Awaited'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">2. Course Duration:</label>
                <input
                  type="text"
                  list="durationOptions"
                  value={formData.courseDuration}
                  onChange={(e) => handleFieldChange('courseDuration', e.target.value)}
                  placeholder="e.g. 2 Years / 24 Months"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                />
                <datalist id="durationOptions">
                  <option value="1 Year" />
                  <option value="18 Months" />
                  <option value="2 Years" />
                  <option value="3 Years" />
                  <option value="4 Years" />
                </datalist>
              </div>

              <div className="lg:col-span-3">
                <label className="block text-xs font-bold text-cg-navy mb-1.5">3. University/College: *</label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => handleFieldChange('university', e.target.value)}
                  placeholder="e.g. Northeastern University, Boston / University of Toronto"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                />
                {formErrors.university && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.university}</span>
                )}
              </div>

              <div className="lg:col-span-3">
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Name of the Course: *</label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={(e) => handleFieldChange('courseName', e.target.value)}
                  placeholder="e.g. Master of Science in Computer Science / MBA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                />
                {formErrors.courseName && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.courseName}</span>
                )}
              </div>

              {/* Country Selection */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Country: *</label>
                <div className="flex flex-wrap gap-2.5">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleFieldChange('country', c.code)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        formData.country === c.code
                          ? 'border-cg-blue bg-blue-50 text-cg-navy shadow-sm'
                          : 'border-cg-border bg-white text-cg-text hover:bg-gray-50'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                        formData.country === c.code ? 'bg-cg-blue text-white border-cg-blue' : 'border-gray-300'
                      }`}>
                        {formData.country === c.code && '✓'}
                      </span>
                      <span>{c.flag} {c.name}</span>
                    </button>
                  ))}
                </div>

                {formData.country === 'Others' && (
                  <div className="mt-3 max-w-md">
                    <input
                      type="text"
                      value={formData.otherCountry}
                      onChange={(e) => handleFieldChange('otherCountry', e.target.value)}
                      placeholder="Please specify country name (e.g. Germany, Australia, Ireland)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs focus:outline-none focus:border-cg-blue"
                    />
                  </div>
                )}
                {formErrors.country && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 block">{formErrors.country}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW B: FORM 2 (CO-APPLICANT, EMPLOYMENT & REFERENCE DETAILS)  */}
      {/* ============================================================== */}
      {formStep === 2 && (
        <div className="space-y-6 animate-fade-in">
          {/* SECTION C: CO-APPLICANT DETAILS */}
          <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-cg-border pb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-cg-navy text-white text-xs font-bold flex items-center justify-center">
                  C
                </span>
                <div>
                  <h3 className="text-base font-bold text-cg-navy uppercase tracking-wide">
                    CO-APPLICANT DETAILS
                  </h3>
                  <p className="text-xs text-cg-muted">
                    Co-borrower identity, contact information &amp; relationship with the student
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-orange-50 text-cg-orange border border-orange-200">
                  Unique Ref: {formUniqueId}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-cg-orange">
                  Form 2 · Section C
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* 1. Relationship With Student */}
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-2">
                  1. Relationship With Student: *
                </label>
                <div className="flex flex-wrap gap-2">
                  {CO_APP_RELATIONSHIPS.map((rel) => {
                    const isSelected = formData.coAppRelationship === rel;
                    return (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => handleFieldChange('coAppRelationship', rel)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-blue-50 text-cg-blue border-cg-blue shadow-sm'
                            : 'bg-white text-cg-text border-cg-border hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                            isSelected ? 'bg-cg-blue text-white border-cg-blue' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && '✓'}
                        </span>
                        <span>{rel}</span>
                      </button>
                    );
                  })}
                </div>

                {formData.coAppRelationship === 'Relative (Specify)' && (
                  <div className="mt-3 max-w-md">
                    <label className="block text-xs font-semibold text-cg-navy mb-1">
                      Specify Relationship (e.g. Maternal Uncle, Paternal Aunt, Grandfather): *
                    </label>
                    <input
                      type="text"
                      value={formData.coAppRelationshipOther}
                      onChange={(e) => handleFieldChange('coAppRelationshipOther', e.target.value)}
                      placeholder="Specify relation"
                      className="w-full px-3.5 py-2 rounded-xl border border-cg-border text-xs focus:outline-none focus:border-cg-blue"
                    />
                  </div>
                )}
              </div>

              {/* 2. Name, 3. Mobile No., 4. E-mail ID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">
                    2. Name: *
                  </label>
                  <input
                    type="text"
                    value={formData.coAppName}
                    onChange={(e) => handleFieldChange('coAppName', e.target.value)}
                    placeholder="Full name of Co-Applicant"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">
                    3. Mobile No.: *
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.coAppMobile}
                    onChange={(e) => handleFieldChange('coAppMobile', e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">
                    4. E-mail ID: *
                  </label>
                  <input
                    type="email"
                    value={formData.coAppEmail}
                    onChange={(e) => handleFieldChange('coAppEmail', e.target.value)}
                    placeholder="coapplicant@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION D: EMPLOYMENT / BUSINESS DETAILS OF CO-APPLICANT */}
          <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-cg-border pb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-cg-navy text-white text-xs font-bold flex items-center justify-center">
                  D
                </span>
                <div>
                  <h3 className="text-base font-bold text-cg-navy uppercase tracking-wide">
                    EMPLOYMENT / BUSINESS DETAILS OF CO-APPLICANT
                  </h3>
                  <p className="text-xs text-cg-muted">
                    Income source, employer, designation, and financial track record
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-cg-orange">
                Form 2 · Section D
              </span>
            </div>

            <div className="space-y-4">
              {/* 1. Occupation */}
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-2">
                  1. Occupation: *
                </label>
                <div className="flex flex-wrap gap-2">
                  {CO_APP_OCCUPATIONS.map((occ) => {
                    const isSelected = formData.coAppOccupation === occ;
                    return (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => handleFieldChange('coAppOccupation', occ)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-blue-50 text-cg-blue border-cg-blue shadow-sm'
                            : 'bg-white text-cg-text border-cg-border hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                            isSelected ? 'bg-cg-blue text-white border-cg-blue' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && '✓'}
                        </span>
                        <span>{occ}</span>
                      </button>
                    );
                  })}
                </div>

                {formData.coAppOccupation === 'Others (Specify)' && (
                  <div className="mt-3 max-w-md">
                    <label className="block text-xs font-semibold text-cg-navy mb-1">
                      Specify Occupation: *
                    </label>
                    <input
                      type="text"
                      value={formData.coAppOccupationOther}
                      onChange={(e) => handleFieldChange('coAppOccupationOther', e.target.value)}
                      placeholder="e.g. Agriculture, Real Estate, Consultant"
                      className="w-full px-3.5 py-2 rounded-xl border border-cg-border text-xs focus:outline-none focus:border-cg-blue"
                    />
                  </div>
                )}
              </div>

              {/* 2 to 7 Employment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">
                    2. Name of the Employer / Business: *
                  </label>
                  <input
                    type="text"
                    value={formData.coAppEmployerName}
                    onChange={(e) => handleFieldChange('coAppEmployerName', e.target.value)}
                    placeholder="e.g. Tata Consultancy Services / Own Firm"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">
                    3. Designation / Profession: *
                  </label>
                  <input
                    type="text"
                    value={formData.coAppDesignation}
                    onChange={(e) => handleFieldChange('coAppDesignation', e.target.value)}
                    placeholder="e.g. Senior Manager, Director, Advocate"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">
                    4. Official E-mail:
                  </label>
                  <input
                    type="email"
                    value={formData.coAppOfficialEmail}
                    onChange={(e) => handleFieldChange('coAppOfficialEmail', e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">
                    5. Gross Monthly Salary / Income: *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cg-muted font-bold text-sm">₹</span>
                    <input
                      type="text"
                      value={formData.coAppGrossIncome}
                      onChange={(e) => handleFieldChange('coAppGrossIncome', e.target.value)}
                      placeholder="e.g. 1,50,000"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">
                    6. Net Monthly Salary / Income: *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cg-muted font-bold text-sm">₹</span>
                    <input
                      type="text"
                      value={formData.coAppNetIncome}
                      onChange={(e) => handleFieldChange('coAppNetIncome', e.target.value)}
                      placeholder="e.g. 1,20,000"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">
                    7. No. of Years in Current Employment / Business: *
                  </label>
                  <input
                    type="text"
                    value={formData.coAppYearsInEmployment}
                    onChange={(e) => handleFieldChange('coAppYearsInEmployment', e.target.value)}
                    placeholder="e.g. 8 Years / 12 Years"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION E: STUDENT REFERENCE */}
          <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-cg-border pb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-cg-navy text-white text-xs font-bold flex items-center justify-center">
                  E
                </span>
                <div>
                  <h3 className="text-base font-bold text-cg-navy uppercase tracking-wide">
                    STUDENT REFERENCE
                  </h3>
                  <p className="text-xs text-cg-muted">
                    (Note: Reference should be known to the Student)
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-cg-orange">
                Form 2 · Section E
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">1. Name: *</label>
                <input
                  type="text"
                  value={formData.refName}
                  onChange={(e) => handleFieldChange('refName', e.target.value)}
                  placeholder="Full name of reference"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">3. Mobile No.: *</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.refMobile}
                  onChange={(e) => handleFieldChange('refMobile', e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">4. Personal E-mail ID:</label>
                <input
                  type="email"
                  value={formData.refEmail}
                  onChange={(e) => handleFieldChange('refEmail', e.target.value)}
                  placeholder="reference@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Date: *</label>
                <input
                  type="date"
                  value={formData.refDate || todayStr}
                  onChange={(e) => handleFieldChange('refDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue bg-white"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-xs font-bold text-cg-navy mb-1.5">2. Address: *</label>
                <textarea
                  rows={2}
                  value={formData.refAddress}
                  onChange={(e) => handleFieldChange('refAddress', e.target.value)}
                  placeholder="Reference person's residential or official address"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
                />
              </div>
            </div>

            {/* Signature of Student */}
            <div className="pt-4 border-t border-gray-100">
              <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 max-w-md">
                  <label className="block text-xs font-bold text-cg-navy mb-1">
                    Signature of Student (Type full name to sign): *
                  </label>
                  <input
                    type="text"
                    value={formData.studentSignature || formData.studentName}
                    onChange={(e) => handleFieldChange('studentSignature', e.target.value)}
                    placeholder="Enter student name as signature"
                    className="w-full px-3.5 py-2 rounded-xl border border-cg-border text-xs focus:outline-none focus:border-cg-blue font-medium bg-white"
                  />
                  <p className="text-[11px] text-cg-muted mt-1">
                    The student hereby confirms that all academic and co-applicant details provided are genuine.
                  </p>
                </div>

                {/* Digital Signature Seal */}
                <div className="p-3 bg-white rounded-xl border border-dashed border-cg-blue text-center min-w-[220px]">
                  <span className="text-[10px] text-cg-muted uppercase font-bold block mb-0.5">Signature of Student</span>
                  <div className="font-serif italic text-lg text-cg-navy font-bold py-1">
                    {formData.studentSignature || formData.studentName || 'Student Signature'}
                  </div>
                  <span className="text-[10px] text-cg-blue font-mono block">
                    Signed Date: {formData.refDate || todayStr}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Submit Bar */}
      <div className="sticky bottom-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/95 backdrop-blur-md border border-cg-border rounded-2xl shadow-dropdown">
        <div className="flex items-center gap-2.5 text-xs text-cg-muted">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-cg-navy font-mono font-bold text-xs shrink-0">
            <span className="text-[10px] text-cg-blue font-sans font-semibold">Unique ID:</span>
            <span>{formUniqueId}</span>
          </div>
          <span className="hidden md:inline">
            {formStep === 1
              ? 'Form 1 of 2: Student Details & Academics • Fill Form 1 then proceed to Form 2 to submit'
              : 'Form 2 of 2: Co-Applicant, Employment & Reference • Review & submit loan application'}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2.5">
          {formStep === 2 && (
            <button
              type="button"
              onClick={() => {
                setFormStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-cg-navy bg-white hover:bg-gray-50 border border-cg-border shadow-sm transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Form 1</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-cg-text bg-white hover:bg-gray-50 border border-cg-border shadow-sm transition-all"
          >
            Reset Form
          </button>

          {/* Form 1: Proceed to Form 2 button (No submit button here) */}
          {formStep === 1 && (
            <button
              type="button"
              onClick={handleProceedToForm2}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cg-blue to-indigo-600 hover:brightness-105 shadow-sm transition-all"
            >
              <span>Proceed to Form 2 (Co-Applicant &amp; Reference)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Form 2: ONLY show Submit Application button here after Form 1 then Form 2 */}
          {formStep === 2 && (
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cg-orange to-cg-orange-hover hover:brightness-95 shadow-orange transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Submit Complete Application</span>
            </button>
          )}
        </div>
      </div>
        </form>
      ) : (
        /* ============================================================== */
        /* ALL ENQUIRIES LIST VIEW                                        */
        /* ============================================================== */
        <div className="bg-white rounded-2xl border border-cg-border shadow-card p-5 space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cg-muted" />
              <input
                type="text"
                placeholder="Search by Enquiry ID, Student Name, Mobile, University..."
                value={listSearch}
                onChange={(e) => setListSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cg-border text-sm text-cg-text focus:outline-none focus:border-cg-blue"
              />
            </div>
            <select
              value={listCountry}
              onChange={(e) => setListCountry(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-cg-border text-xs font-medium text-cg-text bg-white focus:outline-none focus:border-cg-blue"
            >
              <option value="">All Countries</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={listStatus}
              onChange={(e) => setListStatus(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-cg-border text-xs font-medium text-cg-text bg-white focus:outline-none focus:border-cg-blue"
            >
              <option value="">All CRM Stages</option>
              <option value="Lead">Lead</option>
              <option value="Login">Login</option>
              <option value="Disbursement">Disbursement</option>
              <option value="Declined">Declined</option>
            </select>
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-cg-blue hover:bg-cg-blue/90 shrink-0"
            >
              + New Loan Enquiry
            </button>
          </div>

          {/* Table */}
          {filteredList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-cg-border text-cg-muted font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Enquiry ID</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Mobile</th>
                    <th className="py-3 px-3">Country & Course</th>
                    <th className="py-3 px-3">University</th>
                    <th className="py-3 px-3">Loan Amount</th>
                    <th className="py-3 px-3">Stage / Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cg-border">
                  {filteredList.map((item) => {
                    const status = item.crmStatus || item.status || 'Lead';
                    return (
                      <tr key={item.id} className="hover:bg-cg-light-blue/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-cg-blue">{item.id}</td>
                        <td className="py-3 px-3 text-cg-muted">{item.date}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-cg-navy block">{item.studentName}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-cg-muted">{item.consultancyName || 'Direct'}</span>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Form 1 &amp; 2 ✓
                            </span>
                          </div>
                          {Boolean(item.coAppName) && (
                            <span className="text-[10px] text-cg-muted block mt-0.5 truncate max-w-[200px]">
                              Co-App: <span className="font-medium text-cg-navy">{item.coAppName}</span> ({item.coAppRelationship || 'Relative'})
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-cg-text">{item.mobile}</td>
                        <td className="py-3 px-3">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-cg-blue border border-blue-100">
                            {item.country}
                          </span>
                          <span className="block text-[11px] text-cg-muted truncate max-w-[180px] mt-0.5">
                            {item.courseName}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-cg-navy max-w-[160px] truncate">
                          {item.university}
                        </td>
                        <td className="py-3 px-3 font-bold text-cg-orange">{item.loanAmount}</td>
                        <td className="py-3 px-3">
                          {status === 'Lead' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              Lead
                            </span>
                          )}
                          {status === 'Login' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              In Login
                            </span>
                          )}
                          {status === 'Disbursement' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Disbursement
                            </span>
                          )}
                          {status === 'Declined' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              Declined
                            </span>
                          )}
                          {status !== 'Lead' && status !== 'Login' && status !== 'Disbursement' && status !== 'Declined' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                              {status}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* If status is Lead, show quick "Move to Login" action */}
                            {status === 'Lead' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setQuickLoginData({ bankName: 'HDFC Credila', smName: '', appNo: '' });
                                  setQuickLoginModal({ isOpen: true, item });
                                }}
                                className="px-2.5 py-1 rounded-lg bg-cg-orange hover:bg-cg-orange-hover text-white text-[11px] font-bold shadow-orange transition-all"
                                title="Move this Lead to Bank Login"
                              >
                                + Move to Login
                              </button>
                            )}
                            {status === 'Login' && (
                              <button
                                type="button"
                                onClick={() => navigate('login-status')}
                                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold transition-all"
                              >
                                View Login
                              </button>
                            )}
                            {status === 'Disbursement' && (
                              <button
                                type="button"
                                onClick={() => navigate('payments')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-all"
                              >
                                Payments
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => navigate('education-loan', 'view', item.id)}
                              className="p-1.5 rounded-lg bg-blue-50 text-cg-blue hover:bg-blue-100 transition-colors"
                              title="View / Print Slip"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteEducationLoan(item.id)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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
              <h3 className="text-base font-bold text-cg-navy mb-1">No Education Loan enquiries found</h3>
              <p className="text-xs text-cg-muted mb-4">Try adjusting search filters or create a new loan enquiry.</p>
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="px-4 py-2.5 bg-gradient-to-r from-cg-orange to-cg-orange-hover text-white rounded-xl text-xs font-bold shadow-orange"
              >
                + Create New Loan Enquiry
              </button>
            </div>
          )}

          {/* Quick Login Modal from Education Loans table */}
          {quickLoginModal.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-cg-navy/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 my-auto max-h-[92vh] overflow-y-auto shadow-2xl border border-cg-border space-y-4 animate-scale-up">
                <div className="flex items-center justify-between border-b border-cg-border pb-3">
                  <h3 className="text-base font-bold text-cg-navy">
                    Move to Bank Login: {quickLoginModal.item?.studentName}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setQuickLoginModal({ isOpen: false, item: null })}
                    className="text-cg-muted hover:text-cg-text font-bold text-sm"
                  >
                    ✕
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!quickLoginData.bankName || !quickLoginData.smName || !quickLoginData.appNo) {
                      return;
                    }
                    saveLoginDetails(quickLoginModal.item.id, quickLoginData);
                    setQuickLoginModal({ isOpen: false, item: null });
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1">Bank Name</label>
                    <select
                      value={quickLoginData.bankName}
                      onChange={(e) => setQuickLoginData((prev) => ({ ...prev, bankName: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-cg-border text-xs bg-white text-cg-text"
                    >
                      <option value="HDFC Credila">HDFC Credila</option>
                      <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Avanse Financial Services">Avanse Financial Services</option>
                      <option value="InCred Financial Services">InCred Financial Services</option>
                      <option value="IDFC FIRST Bank">IDFC FIRST Bank</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Auxilo Finserve">Auxilo Finserve</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1">SM Name (Sales Manager)</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      required
                      value={quickLoginData.smName}
                      onChange={(e) => setQuickLoginData((prev) => ({ ...prev, smName: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-cg-border text-xs text-cg-text"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cg-navy mb-1">APP NO (Application Number)</label>
                    <input
                      type="text"
                      placeholder="e.g. CRED-2026-99214"
                      required
                      value={quickLoginData.appNo}
                      onChange={(e) => setQuickLoginData((prev) => ({ ...prev, appNo: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-cg-border text-xs font-mono font-bold text-cg-navy"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setQuickLoginModal({ isOpen: false, item: null })}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-cg-muted border border-cg-border"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cg-blue hover:bg-cg-blue/90 shadow-sm"
                    >
                      Save &amp; Set to Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// Subcomponent: Printable Enquiry Slip (Form 1 & Form 2)
// ----------------------------------------------------
const EnquirySlipView = ({ item, onBack }) => {
  const { navigate } = useApp();
  const [slipTab, setSlipTab] = useState('both'); // 'both' | 'form1' | 'form2'

  if (!item) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-cg-border">
        <h2 className="text-lg font-bold text-cg-navy mb-2">Enquiry Record Not Found</h2>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-cg-blue text-white rounded-xl text-xs font-bold"
        >
          Back to Education Loan
        </button>
      </div>
    );
  }

  const relationshipDisplay =
    item.coAppRelationship === 'Relative (Specify)'
      ? item.coAppRelationshipOther || 'Relative'
      : item.coAppRelationship || 'Father';

  const occupationDisplay =
    item.coAppOccupation === 'Others (Specify)'
      ? item.coAppOccupationOther || 'Others'
      : item.coAppOccupation || 'Employed';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top action bar (hidden on print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-cg-blue hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Education Loans</span>
        </button>

        {/* Slip Mode Selector (Form 1, Form 2, or Both) */}
        <div className="inline-flex bg-gray-200/60 p-1.5 rounded-xl gap-1 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSlipTab('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              slipTab === 'both' ? 'bg-white text-cg-navy shadow-sm' : 'text-cg-muted hover:text-cg-text'
            }`}
          >
            Complete File (Both Forms)
          </button>
          <button
            type="button"
            onClick={() => setSlipTab('form1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              slipTab === 'form1' ? 'bg-white text-cg-navy shadow-sm' : 'text-cg-muted hover:text-cg-text'
            }`}
          >
            Form 1: Student &amp; Academics
          </button>
          <button
            type="button"
            onClick={() => setSlipTab('form2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              slipTab === 'form2' ? 'bg-white text-cg-navy shadow-sm' : 'text-cg-muted hover:text-cg-text'
            }`}
          >
            Form 2: Co-Applicant &amp; Reference
          </button>
        </div>

        <div className="flex items-center gap-2">
          {(!item.bankName || item.crmStatus === 'Lead' || item.status === 'Lead') && (
            <button
              type="button"
              onClick={() => navigate('login-status')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cg-orange to-cg-orange-hover shadow-orange"
            >
              + Move to Login Details
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-cg-navy bg-white hover:bg-gray-50 border border-cg-border shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Slip</span>
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cg-blue hover:bg-cg-blue/90"
          >
            Done
          </button>
        </div>
      </div>

      {/* Lifecycle Status Banner */}
      <div className="no-print bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cg-blue text-white flex items-center justify-center font-bold text-sm shrink-0">
            {item.status === 'Disbursement' ? '5' : item.status === 'Login' ? '3' : '2'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cg-navy">CRM Lifecycle Status:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-cg-blue text-white">
                {item.status || item.crmStatus || 'Lead'}
              </span>
            </div>
            <p className="text-[11px] text-cg-muted mt-0.5">
              {item.status === 'Disbursement'
                ? 'Loan is Sanctioned and Disbursed! Ready for Bank, Customer, and Vendor payout settlement.'
                : item.status === 'Login'
                ? `Logged in with ${item.bankName || 'Bank'} (App #${item.appNo || '-'}). Ready for Sanction or Decline.`
                : 'Enquiry has been registered as a Lead with both Form 1 & Form 2. You can now move this lead to Bank Login status.'}
            </p>
          </div>
        </div>
        {item.status === 'Disbursement' ? (
          <button
            type="button"
            onClick={() => navigate('payments')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shrink-0"
          >
            Open in Payments &rarr;
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('login-status')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-cg-blue hover:bg-cg-blue/90 shadow-sm shrink-0"
          >
            Manage in Login Status &rarr;
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* FORM 1 CARD: STUDENT DETAILS & ACADEMIC ENQUIRY        */}
      {/* ======================================================== */}
      {(slipTab === 'both' || slipTab === 'form1') && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cg-border shadow-card space-y-6 text-xs text-cg-text print:border-none print:shadow-none print:p-0">
          {/* Slip Header Form 1 */}
          <div className="flex items-center justify-between border-b-2 border-cg-navy pb-4">
            <div>
              <img src="/assets/logo.png" alt="Capital Grow" className="h-10 w-auto object-contain mb-2" />
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cg-navy text-white text-[10px] font-bold">FORM 1 OF 2</span>
                <h2 className="text-base sm:text-lg font-extrabold text-cg-navy uppercase tracking-wide">
                  STUDENT DETAILS FOR EDUCATION LOAN
                </h2>
              </div>
              <p className="text-[11px] text-cg-muted mt-0.5">Capital Grow Overseas Education Loan Advisory &amp; Processing</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-cg-blue border border-blue-200">
                {item.id}
              </span>
              <span className="block text-cg-muted text-[11px] mt-1.5">
                Date: <b className="text-cg-navy">{item.date}</b>
              </span>
            </div>
          </div>

          {/* Consultancy & Loan overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-cg-border">
              <span className="text-[10px] text-cg-muted font-bold uppercase block">Consultancy Name</span>
              <b className="text-sm font-bold text-cg-navy">{item.consultancyName || 'Direct Walk-in'}</b>
            </div>
            <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-200">
              <span className="text-[10px] text-cg-muted font-bold uppercase block">Loan Amount Requested</span>
              <b className="text-base font-extrabold text-cg-orange">{item.loanAmount}</b>
            </div>
          </div>

          {/* Section 1: Student Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-cg-navy uppercase tracking-wider border-b border-cg-border pb-1">
              STUDENT DETAILS
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">Name</span>
                <b className="text-cg-navy">{item.studentName}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">Father's Name</span>
                <b className="text-cg-navy">{item.fatherName}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">Mother's Name</span>
                <b className="text-cg-navy">{item.motherName || '-'}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">Date of Birth</span>
                <b className="text-cg-navy">{item.dob || '-'}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">Gender</span>
                <b className="text-cg-navy">{item.gender}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">Marital Status</span>
                <b className="text-cg-navy">{item.maritalStatus}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">10 Mobile No</span>
                <b className="text-cg-navy">+91 {item.mobile}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">E-mail ID</span>
                <b className="text-cg-navy">{item.email}</b>
              </div>
              <div className="col-span-2 p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">Current Residence</span>
                <b className="text-cg-navy">
                  {item.residenceType} {item.monthlyRent ? `(Rent: ₹${item.monthlyRent})` : ''}
                </b>
              </div>
              <div className="col-span-2 p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">Current Residential Address &amp; Pincode</span>
                <b className="text-cg-navy">{item.currentAddress} - {item.currentPincode}</b>
              </div>
              <div className="col-span-2 sm:col-span-4 p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">7. Permanent Residential Address &amp; Pincode</span>
                <b className="text-cg-navy">{item.permAddress} - {item.permPincode}</b>
              </div>
            </div>
          </div>

          {/* Section 2: Educational Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-cg-navy uppercase tracking-wider border-b border-cg-border pb-1">
              12 EDUCATIONAL DETAILS
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-cg-border">
                <thead>
                  <tr className="bg-cg-navy text-white text-[11px]">
                    <th className="py-2 px-3">EXAM / COURSE</th>
                    <th className="py-2 px-3">YEAR COMPLETED</th>
                    <th className="py-2 px-3">MARKS (%)</th>
                    <th className="py-2 px-3">SCHOOL / COLLEGE / UNIVERSITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cg-border">
                  {item.education && item.education.length > 0 ? (
                    item.education.map((e, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-bold">{e.exam}</td>
                        <td className="py-2 px-3">{e.year || '-'}</td>
                        <td className="py-2 px-3">{e.marks || '-'}</td>
                        <td className="py-2 px-3">{e.school || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-2 px-3 text-center text-cg-muted">
                        No academic records listed
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">NAME OF ENTRANCE TEST</span>
                <b className="text-cg-navy">{item.entranceTest || 'None'}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">SCORE</span>
                <b className="text-cg-navy">{item.entranceScore || 'Awaited / N/A'}</b>
              </div>
              <div className="sm:col-span-2 p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">NAME OF DEGREE</span>
                <div className="space-y-0.5 mt-0.5">
                  <span className="block">a) <b>{item.degreeA || '-'}</b></span>
                  {item.degreeB && <span className="block">b) <b>{item.degreeB}</b></span>}
                  {item.degreeC && <span className="block">c) <b>{item.degreeC}</b></span>}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: B Course Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-cg-navy uppercase tracking-wider border-b border-cg-border pb-1">
              B COURSE DETAILS
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">Country</span>
                <b className="text-cg-navy">{item.country === 'Others' ? item.otherCountry : item.country}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">1. Admission Status</span>
                <b className="text-cg-navy">{item.admissionStatus === 'Confirmed' ? '☑ Confirmed' : '☐ Awaited'}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">2. Course Duration</span>
                <b className="text-cg-navy">{item.courseDuration || '-'}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">3. University/College</span>
                <b className="text-cg-navy">{item.university}</b>
              </div>
              <div className="col-span-2 sm:col-span-4 p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">Name of the Course</span>
                <b className="text-sm font-bold text-cg-blue">{item.courseName}</b>
              </div>
            </div>
          </div>

          {/* Footer Signature Block */}
          <div className="pt-6 border-t border-dashed border-cg-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-cg-muted text-[11px]">
            <span>Form 1 of 2 • Generated digitally via Capital Grow CRM</span>
            <span>Student / Counselor Signature: _______________________</span>
          </div>
        </div>
      )}

      {/* Divider between Form 1 & Form 2 if both showing */}
      {slipTab === 'both' && (
        <div className="no-print flex items-center justify-center gap-3 my-4">
          <div className="h-px bg-cg-border flex-1" />
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-cg-orange border border-orange-200">
            Form 2 · Co-Applicant Details &amp; Student Reference
          </span>
          <div className="h-px bg-cg-border flex-1" />
        </div>
      )}

      {/* ======================================================== */}
      {/* FORM 2 CARD: CO-APPLICANT & STUDENT REFERENCE           */}
      {/* ======================================================== */}
      {(slipTab === 'both' || slipTab === 'form2') && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cg-border shadow-card space-y-6 text-xs text-cg-text print:border-none print:shadow-none print:p-0 print:break-before-page">
          {/* Slip Header Form 2 */}
          <div className="flex items-center justify-between border-b-2 border-cg-orange pb-4">
            <div>
              <img src="/assets/logo.png" alt="Capital Grow" className="h-10 w-auto object-contain mb-2" />
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cg-orange text-white text-[10px] font-bold">FORM 2 OF 2</span>
                <h2 className="text-base sm:text-lg font-extrabold text-cg-navy uppercase tracking-wide">
                  CO-APPLICANT DETAILS &amp; STUDENT REFERENCE
                </h2>
              </div>
              <p className="text-[11px] text-cg-muted mt-0.5">Capital Grow Co-Borrower Assessment &amp; Reference Verification Slip</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-cg-orange border border-orange-200">
                {item.id} - FORM 2
              </span>
              <span className="block text-cg-muted text-[11px] mt-1.5">
                Date: <b className="text-cg-navy">{item.refDate || item.date}</b>
              </span>
            </div>
          </div>

          {/* Student Linkage Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-orange-50/40 rounded-xl border border-orange-200">
            <div>
              <span className="text-[10px] text-cg-muted font-bold uppercase block">Student Full Name</span>
              <b className="text-xs font-bold text-cg-navy">{item.studentName}</b>
            </div>
            <div>
              <span className="text-[10px] text-cg-muted font-bold uppercase block">Student Mobile</span>
              <b className="text-xs font-bold text-cg-navy">+91 {item.mobile}</b>
            </div>
            <div>
              <span className="text-[10px] text-cg-muted font-bold uppercase block">Target Institution</span>
              <b className="text-xs font-bold text-cg-navy truncate block">{item.university}</b>
            </div>
            <div>
              <span className="text-[10px] text-cg-muted font-bold uppercase block">Loan Amount</span>
              <b className="text-sm font-extrabold text-cg-orange">{item.loanAmount}</b>
            </div>
          </div>

          {/* SECTION C: CO-APPLICANT DETAILS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-cg-navy uppercase tracking-wider border-b border-cg-border pb-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-cg-orange" />
              <span>C. CO-APPLICANT DETAILS</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="col-span-2 p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">1. Relationship With Student:</span>
                <b className="text-sm text-cg-navy font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-cg-orange" />
                  <span>{relationshipDisplay}</span>
                </b>
              </div>
              <div className="col-span-2 p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">2. Name:</span>
                <b className="text-sm text-cg-navy font-bold block mt-0.5">{item.coAppName || item.fatherName || '-'}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">3. Mobile No.:</span>
                <b className="text-cg-navy font-bold block mt-0.5">
                  {item.coAppMobile ? `+91 ${item.coAppMobile}` : '-'}
                </b>
              </div>
              <div className="col-span-3 p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">4. E-mail ID:</span>
                <b className="text-cg-navy font-bold block mt-0.5">{item.coAppEmail || '-'}</b>
              </div>
            </div>
          </div>

          {/* SECTION D: EMPLOYMENT/BUSINESS DETAILS OF CO-APPLICANT */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-cg-navy uppercase tracking-wider border-b border-cg-border pb-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cg-blue" />
              <span>D. EMPLOYMENT / BUSINESS DETAILS OF CO-APPLICANT</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">1. Occupation:</span>
                <b className="text-cg-navy font-bold block mt-0.5">{occupationDisplay}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">2. Name of Employer / Business:</span>
                <b className="text-cg-navy font-bold block mt-0.5">{item.coAppEmployerName || '-'}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">3. Designation / Profession:</span>
                <b className="text-cg-navy font-bold block mt-0.5">{item.coAppDesignation || '-'}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">4. Official E-mail:</span>
                <b className="text-cg-navy font-bold block mt-0.5">{item.coAppOfficialEmail || '-'}</b>
              </div>
              <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-lg">
                <span className="text-[10px] text-emerald-800 block font-semibold">5. Gross Monthly Salary / Income:</span>
                <b className="text-sm text-emerald-900 font-extrabold block mt-0.5">
                  {item.coAppGrossIncome ? (String(item.coAppGrossIncome).startsWith('₹') ? item.coAppGrossIncome : `₹ ${item.coAppGrossIncome}`) : '-'}
                </b>
              </div>
              <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-lg">
                <span className="text-[10px] text-emerald-800 block font-semibold">6. Net Monthly Salary / Income:</span>
                <b className="text-sm text-emerald-900 font-extrabold block mt-0.5">
                  {item.coAppNetIncome ? (String(item.coAppNetIncome).startsWith('₹') ? item.coAppNetIncome : `₹ ${item.coAppNetIncome}`) : '-'}
                </b>
              </div>
              <div className="col-span-2 sm:col-span-3 p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">7. No. of Years in Current Employment / Business:</span>
                <b className="text-cg-navy font-bold block mt-0.5">{item.coAppYearsInEmployment || '-'}</b>
              </div>
            </div>
          </div>

          {/* SECTION E: STUDENT REFERENCE */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-cg-navy uppercase tracking-wider border-b border-cg-border pb-1 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span>E. STUDENT REFERENCE</span>
              </span>
              <span className="text-[10px] text-cg-muted font-normal lowercase tracking-normal italic">
                (Note: Reference should be known to the Student)
              </span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">1. Name:</span>
                <b className="text-cg-navy font-bold block mt-0.5">{item.refName || '-'}</b>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">3. Mobile No.:</span>
                <b className="text-cg-navy font-bold block mt-0.5">
                  {item.refMobile ? `+91 ${item.refMobile}` : '-'}
                </b>
              </div>
              <div className="col-span-2 p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">4. Personal E-mail ID:</span>
                <b className="text-cg-navy font-bold block mt-0.5">{item.refEmail || '-'}</b>
              </div>
              <div className="col-span-2 sm:col-span-4 p-2.5 bg-gray-50/70 rounded-lg">
                <span className="text-[10px] text-cg-muted block font-semibold">2. Address:</span>
                <b className="text-cg-navy font-medium block mt-0.5">{item.refAddress || '-'}</b>
              </div>
            </div>
          </div>

          {/* Date & Signature of Student */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <span className="text-[10px] text-cg-muted block font-semibold">Date of Submission:</span>
                <b className="text-sm text-cg-navy font-bold block mt-0.5">{item.refDate || item.date}</b>
                <p className="text-[10px] text-cg-muted mt-2">
                  "I hereby confirm that all information provided in Form 1 &amp; Form 2 regarding my co-applicant and reference is accurate to the best of my knowledge."
                </p>
              </div>

              {/* Digital Signature Seal */}
              <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-cg-blue text-center">
                <span className="text-[10px] text-cg-muted uppercase font-bold block mb-1">
                  Signature of Student
                </span>
                <div className="font-serif italic text-lg text-cg-navy font-extrabold py-1">
                  {item.studentSignature || item.studentName}
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-700 font-mono font-semibold">
                  <span>✓ Verified Digital Submission</span>
                  <span>•</span>
                  <span>{item.refDate || item.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Signature Block */}
          <div className="pt-6 border-t border-dashed border-cg-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-cg-muted text-[11px]">
            <span>Form 2 of 2 • Generated digitally via Capital Grow CRM</span>
            <span>Counselor Verification: _______________________</span>
          </div>
        </div>
      )}
    </div>
  );
};


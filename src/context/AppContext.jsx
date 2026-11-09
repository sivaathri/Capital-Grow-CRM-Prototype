import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB, INITIAL_CUSTOMERS, INITIAL_FOLLOWUPS, INITIAL_EDUCATION_LOANS } from '../data/seedData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Auth State
  const [user, setUser] = useState(() => {
    const isAuthed = sessionStorage.getItem('cg_auth') === '1' || localStorage.getItem('cg_remember') === '1';
    const savedUser = sessionStorage.getItem('cg_user') || localStorage.getItem('cg_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {}
    }
    return isAuthed ? { email: 'admin@capitalgrow.co.in', name: 'Admin', role: 'Super Admin' } : null;
  });

  // Navigation State from URL hash
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.slice(1) || 'dashboard';
    const parts = hash.split('/');
    return { page: parts[0] || 'dashboard', action: parts[1] || null, id: parts[2] || null };
  });

  // Core Data Stores
  const [customers, setCustomers] = useState(() => DB.get('customers', INITIAL_CUSTOMERS));
  const [educationLoans, setEducationLoans] = useState(() => DB.get('education_loans', INITIAL_EDUCATION_LOANS));
  const [followups, setFollowups] = useState(() => DB.get('followups', INITIAL_FOLLOWUPS));

  // UI States
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Sync route with window hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'dashboard';
      const parts = hash.split('/');
      setRoute({ page: parts[0] || 'dashboard', action: parts[1] || null, id: parts[2] || null });
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    DB.set('customers', customers);
  }, [customers]);

  useEffect(() => {
    DB.set('education_loans', educationLoans);
  }, [educationLoans]);

  useEffect(() => {
    DB.set('followups', followups);
  }, [followups]);

  // Toast System
  const addToast = (message, type = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Confirmation Modal
  const confirm = (title, message) => {
    return new Promise((resolve) => {
      setModal({
        isOpen: true,
        title,
        message,
        onConfirm: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  };

  // Navigation Helper
  const navigate = (page, action = null, id = null) => {
    let hash = page;
    if (action) hash += `/${action}`;
    if (id) hash += `/${id}`;
    window.location.hash = hash;
    setIsMobileNavOpen(false);
  };

  // Auth Handlers
  const login = (email, password, remember) => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin@capitalgrow.co.in' && password === 'Admin@123') {
      const userData = { email, name: 'Admin', role: 'Super Admin' };
      sessionStorage.setItem('cg_auth', '1');
      sessionStorage.setItem('cg_user', JSON.stringify(userData));
      if (remember) {
        localStorage.setItem('cg_remember', '1');
        localStorage.setItem('cg_user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('cg_remember');
        localStorage.removeItem('cg_user');
      }
      setUser(userData);
      addToast('Welcome back, Admin (Super Admin role)', 'ok');
      navigate('dashboard');
      return true;
    }

    // Support regular user / counselor login
    if (
      (cleanEmail === 'user@capitalgrow.co.in' || cleanEmail === 'counselor@capitalgrow.co.in') &&
      (password === 'User@123' || password === 'Admin@123')
    ) {
      const userData = { email, name: 'Meena R', role: 'Staff / Counselor' };
      sessionStorage.setItem('cg_auth', '1');
      sessionStorage.setItem('cg_user', JSON.stringify(userData));
      if (remember) {
        localStorage.setItem('cg_remember', '1');
        localStorage.setItem('cg_user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('cg_remember');
        localStorage.removeItem('cg_user');
      }
      setUser(userData);
      addToast('Logged in as Meena R (User role - Payments & User Mgmt restricted)', 'ok');
      navigate('dashboard');
      return true;
    }

    return false;
  };

  const switchRole = (roleType) => {
    let userData;
    if (roleType === 'user' || roleType === 'counselor') {
      userData = { email: 'user@capitalgrow.co.in', name: 'Meena R', role: 'Staff / Counselor' };
      addToast('Switched to User role (Payments & User Management are now hidden)', 'ok');
    } else {
      userData = { email: 'admin@capitalgrow.co.in', name: 'Admin', role: 'Super Admin' };
      addToast('Switched to Admin role (Payments & User Management are now visible)', 'ok');
    }
    sessionStorage.setItem('cg_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    const confirmed = await confirm('Log out?', 'You will need to sign in again to continue.');
    if (confirmed) {
      sessionStorage.removeItem('cg_auth');
      sessionStorage.removeItem('cg_user');
      localStorage.removeItem('cg_remember');
      localStorage.removeItem('cg_user');
      setUser(null);
      window.location.hash = '';
    }
  };

  // Reset to initial Seed data
  const resetToSeedData = () => {
    setCustomers(INITIAL_CUSTOMERS);
    setEducationLoans(INITIAL_EDUCATION_LOANS);
    setFollowups(INITIAL_FOLLOWUPS);
    DB.set('customers', INITIAL_CUSTOMERS);
    DB.set('education_loans', INITIAL_EDUCATION_LOANS);
    DB.set('followups', INITIAL_FOLLOWUPS);
    addToast('Demo database reset to initial state', 'ok');
  };

  // Data Mutations
  const addCustomer = (customerData) => {
    const newCustomer = {
      ...customerData,
      id: customerData.id || `CG-${new Date().getFullYear()}-${String(customers.length + 1249).padStart(5, '0')}`,
      created: customerData.created || new Date().toISOString().slice(0, 10),
      status: customerData.status || 'Lead',
      followup: customerData.followup || '-'
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    addToast('Customer added successfully', 'ok');
    return newCustomer;
  };

  const updateCustomer = (id, updatedFields) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c)));
    addToast('Customer updated', 'ok');
  };

  const deleteCustomer = async (id) => {
    const ok = await confirm('Delete customer?', 'This permanently removes the customer and cannot be undone.');
    if (ok) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      addToast('Customer deleted', 'ok');
      if (route.page === 'customers' && route.action === id) {
        navigate('customers');
      }
    }
  };

  const addEducationLoan = (enquiry) => {
    const newRecord = {
      ...enquiry,
      id: enquiry.id || `CG-EDU-${new Date().getFullYear()}-${String(educationLoans.length + 4).padStart(4, '0')}`,
      date: enquiry.date || new Date().toISOString().slice(0, 10),
      crmStatus: 'Lead',
      status: 'Lead'
    };

    setEducationLoans((prev) => [newRecord, ...prev]);

    // Sync into Customers as Lead
    const existingIdx = customers.findIndex((c) => c.mobile === enquiry.mobile);
    const targetCountry = enquiry.country === 'Others' ? enquiry.otherCountry : enquiry.country;
    const customerRecord = {
      id: `CG-${new Date().getFullYear()}-${String(customers.length + 1249).padStart(5, '0')}`,
      name: enquiry.studentName,
      mobile: enquiry.mobile,
      email: enquiry.email,
      type: 'Education Loan',
      status: 'Lead',
      followup: '15 Nov 2026',
      emp: 'Meena R',
      country: targetCountry,
      univ: enquiry.university,
      course: enquiry.courseName,
      adm: enquiry.admissionStatus === 'Confirmed' ? 'Offer Received' : 'Applied',
      gender: enquiry.gender,
      pin: enquiry.currentPincode,
      address: enquiry.currentAddress,
      highest: enquiry.degreeA || (enquiry.education && enquiry.education[0]?.exam) || '',
      refName: enquiry.consultancyName,
      src: enquiry.consultancyName?.includes('Direct') ? 'Walk-in' : 'Referral',
      created: enquiry.date,
      loanAmount: enquiry.loanAmount,
      eduLoanId: newRecord.id,
      remarks: `Education Loan enquiry for ${enquiry.courseName} at ${enquiry.university} (${targetCountry}). Loan amount: ${enquiry.loanAmount}. Father: ${enquiry.fatherName}.`
    };

    if (existingIdx >= 0) {
      setCustomers((prev) => {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], ...customerRecord, id: copy[existingIdx].id };
        return copy;
      });
    } else {
      setCustomers((prev) => [customerRecord, ...prev]);
    }

    addToast(`Education Loan Enquiry Submitted! Status changed to Lead (ID: ${newRecord.id})`, 'ok');
    return newRecord;
  };

  const deleteEducationLoan = async (id) => {
    const ok = await confirm('Delete Education Loan Enquiry?', `Permanently remove record ${id}?`);
    if (ok) {
      setEducationLoans((prev) => prev.filter((item) => item.id !== id));
      addToast('Enquiry deleted', 'ok');
    }
  };

  // Pipeline Flow Actions
  const saveLoginDetails = (recordId, { bankName, smName, appNo }) => {
    const today = new Date().toISOString().slice(0, 10);
    const updates = {
      status: 'Login',
      crmStatus: 'Login',
      bankName: bankName?.trim(),
      smName: smName?.trim(),
      appNo: appNo?.trim(),
      loginDate: today
    };

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === recordId || c.mobile === recordId || c.eduLoanId === recordId
          ? { ...c, ...updates }
          : c
      )
    );

    setEducationLoans((prev) =>
      prev.map((item) =>
        item.id === recordId || item.mobile === recordId
          ? { ...item, ...updates }
          : item
      )
    );

    addToast(`Login details saved: ${bankName} (App #${appNo})`, 'ok');
  };

  const declineLoan = (recordId, { notes }) => {
    const today = new Date().toISOString().slice(0, 10);
    const updates = {
      status: 'Declined',
      crmStatus: 'Declined',
      declineNotes: notes?.trim() || 'No reason specified',
      declineDate: today
    };

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === recordId || c.mobile === recordId || c.eduLoanId === recordId
          ? { ...c, ...updates }
          : c
      )
    );

    setEducationLoans((prev) =>
      prev.map((item) =>
        item.id === recordId || item.mobile === recordId
          ? { ...item, ...updates }
          : item
      )
    );

    addToast('Loan application declined with notes recorded.', 'ok');
  };

  const sanctionLoan = (recordId, { loanAmount, interestRate }) => {
    const today = new Date().toISOString().slice(0, 10);
    const formattedAmount = String(loanAmount).startsWith('₹') ? String(loanAmount) : `₹ ${loanAmount}`;
    const formattedRate = String(interestRate).includes('%') ? String(interestRate) : `${interestRate}%`;

    const updates = {
      status: 'Disbursement',
      crmStatus: 'Disbursement',
      sanctionAmount: formattedAmount,
      loanAmount: formattedAmount,
      interestRate: formattedRate,
      sanctionDate: today,
      payoutStatus: 'Pending'
    };

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === recordId || c.mobile === recordId || c.eduLoanId === recordId
          ? { ...c, ...updates }
          : c
      )
    );

    setEducationLoans((prev) =>
      prev.map((item) =>
        item.id === recordId || item.mobile === recordId
          ? { ...item, ...updates }
          : item
      )
    );

    addToast(`Loan Sanctioned (${formattedAmount} @ ${formattedRate})! Status moved to Disbursement. Record is now ready in Payments.`, 'ok');
  };

  const savePayoutDetails = (recordId, { bankPayout, customerPayout, vendorPayout, payoutNotes }) => {
    const today = new Date().toISOString().slice(0, 10);
    const updates = {
      bankPayout: String(bankPayout || '0').replace(/[^0-9.]/g, ''),
      customerPayout: String(customerPayout || '0').replace(/[^0-9.]/g, ''),
      vendorPayout: String(vendorPayout || '0').replace(/[^0-9.]/g, ''),
      payoutNotes: payoutNotes || '',
      payoutStatus: 'Saved',
      payoutSavedAt: today
    };

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === recordId || c.mobile === recordId || c.eduLoanId === recordId
          ? { ...c, ...updates }
          : c
      )
    );

    setEducationLoans((prev) =>
      prev.map((item) =>
        item.id === recordId || item.mobile === recordId
          ? { ...item, ...updates }
          : item
      )
    );

    addToast('Payout details (Bank, Customer, Vendor) saved successfully!', 'ok');
  };

  const changeRecordStatus = (recordId, newStatus) => {
    const updates = { status: newStatus, crmStatus: newStatus };
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === recordId || c.mobile === recordId || c.eduLoanId === recordId
          ? { ...c, ...updates }
          : c
      )
    );
    setEducationLoans((prev) =>
      prev.map((item) =>
        item.id === recordId || item.mobile === recordId
          ? { ...item, ...updates }
          : item
      )
    );
    addToast(`Status updated to ${newStatus}`, 'ok');
  };

  const simulateCall = (name) => {
    addToast(`Calling ${name}… (simulated)`, 'ok');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        route,
        navigate,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        educationLoans,
        addEducationLoan,
        deleteEducationLoan,
        saveLoginDetails,
        declineLoan,
        sanctionLoan,
        savePayoutDetails,
        changeRecordStatus,
        switchRole,
        resetToSeedData,
        followups,
        simulateCall,
        toasts,
        addToast,
        removeToast,
        modal,
        confirm,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileNavOpen,
        setIsMobileNavOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

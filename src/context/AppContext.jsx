import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB, INITIAL_CUSTOMERS, INITIAL_FOLLOWUPS, INITIAL_EDUCATION_LOANS } from '../data/seedData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Auth State
  const [user, setUser] = useState(() => {
    const isAuthed = sessionStorage.getItem('cg_auth') === '1' || localStorage.getItem('cg_remember') === '1';
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
    if (email.trim().toLowerCase() === 'admin@capitalgrow.co.in' && password === 'Admin@123') {
      const userData = { email, name: 'Admin', role: 'Super Admin' };
      sessionStorage.setItem('cg_auth', '1');
      if (remember) {
        localStorage.setItem('cg_remember', '1');
      } else {
        localStorage.removeItem('cg_remember');
      }
      setUser(userData);
      addToast('Welcome back, Admin', 'ok');
      navigate('dashboard');
      return true;
    }
    return false;
  };

  const logout = async () => {
    const confirmed = await confirm('Log out?', 'You will need to sign in again to continue.');
    if (confirmed) {
      sessionStorage.removeItem('cg_auth');
      localStorage.removeItem('cg_remember');
      setUser(null);
      window.location.hash = '';
    }
  };

  // Data Mutations
  const addCustomer = (customerData) => {
    const newCustomer = {
      ...customerData,
      id: customerData.id || `CG-${new Date().getFullYear()}-${String(customers.length + 1249).padStart(5, '0')}`,
      created: customerData.created || new Date().toISOString().slice(0, 10),
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
      crmStatus: 'Under Process'
    };

    setEducationLoans((prev) => [newRecord, ...prev]);

    // Sync into Customers
    const existingIdx = customers.findIndex((c) => c.mobile === enquiry.mobile);
    const targetCountry = enquiry.country === 'Others' ? enquiry.otherCountry : enquiry.country;
    const customerRecord = {
      id: `CG-${new Date().getFullYear()}-${String(customers.length + 1249).padStart(5, '0')}`,
      name: enquiry.studentName,
      mobile: enquiry.mobile,
      email: enquiry.email,
      type: 'Education Loan',
      status: 'Under Process',
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
      src: enquiry.consultancyName.includes('Direct') ? 'Walk-in' : 'Referral',
      created: enquiry.date,
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

    addToast(`Education Loan Enquiry Submitted! ID: ${newRecord.id}`, 'ok');
    return newRecord;
  };

  const deleteEducationLoan = async (id) => {
    const ok = await confirm('Delete Education Loan Enquiry?', `Permanently remove record ${id}?`);
    if (ok) {
      setEducationLoans((prev) => prev.filter((item) => item.id !== id));
      addToast('Enquiry deleted', 'ok');
    }
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


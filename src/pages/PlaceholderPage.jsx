import React from 'react';
import { useApp } from '../context/AppContext';
import { Construction } from 'lucide-react';

const PAGE_INFO = {
  insurance: { title: 'Insurance Advisory', desc: 'Overseas student medical and life insurance policies.' },
  applications: { title: 'Loan Applications', desc: 'Manage bank applications, sanctions, and disbursement stages.' },
  banks: { title: 'Bank Management', desc: 'Partner banks, credit criteria, and processing rates.' },
  followups: { title: 'Follow-ups & Reminders', desc: 'Task list, call schedules, and counselor alerts.' },
  payments: { title: 'Payments & Commission', desc: 'Bank commissions, consultancy payouts, and service charges.' },
  reports: { title: 'Analytics & Reports', desc: 'Conversion ratios, country breakdown, and monthly disbursements.' },
  users: { title: 'User Management', desc: 'Staff roles, counselor branches, and administrative permissions.' },
  settings: { title: 'System Settings', desc: 'Application preferences, email templates, and CRM configurations.' }
};

export const PlaceholderPage = ({ pageId }) => {
  const { navigate } = useApp();
  const info = PAGE_INFO[pageId] || { title: 'Module', desc: 'This section is scheduled in the roadmap.' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cg-navy">{info.title}</h1>
        <p className="text-sm text-cg-muted mt-0.5">{info.desc}</p>
      </div>

      <div className="bg-white rounded-2xl p-12 text-center border border-cg-border shadow-card max-w-xl mx-auto my-12">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-cg-orange flex items-center justify-center mx-auto mb-4">
          <Construction className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-cg-navy mb-2">{info.title} is coming next</h2>
        <p className="text-xs text-cg-muted leading-relaxed mb-6">
          The Dashboard, Customers module, and the complete Education Loan Enquiry workflow are fully active in this React build.
        </p>
        <button
          type="button"
          onClick={() => navigate('dashboard')}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cg-orange to-cg-orange-hover shadow-orange"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};


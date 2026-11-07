import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Plus,
  Download,
  Edit2,
  Trash2,
  Eye,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap
} from 'lucide-react';

const STATUS_OPTIONS = ['Under Process', 'Follow-up Due', 'Sanctioned', 'No Response'];
const TYPE_OPTIONS = [
  'Education Loan',
  'Insurance (Life)',
  'Insurance (Health)',
  'Insurance (Education)',
  'Insurance (Other)'
];
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const ADM_OPTIONS = ['Not Applied', 'Applied', 'Offer Received', 'Admitted'];
const EMP_OPTIONS = ['Meena R', 'Arun K', 'Kavitha S'];
const COUNTRY_OPTIONS = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Ireland', 'Other'];

export const CustomersPage = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, route, navigate, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [profileTab, setProfileTab] = useState(0);

  // If action is 'new' or 'edit', render form
  if (route.action === 'new' || route.action === 'edit') {
    const editCustomer = route.action === 'edit' && route.id ? customers.find((c) => c.id === route.id) : null;
    return (
      <CustomerForm
        customer={editCustomer}
        onCancel={() => navigate('customers')}
        onSubmit={(data) => {
          if (editCustomer) {
            updateCustomer(editCustomer.id, data);
          } else {
            addCustomer(data);
          }
          navigate('customers');
        }}
      />
    );
  }

  // If an ID is provided, render customer profile
  if (route.action && route.action !== 'new' && route.action !== 'edit') {
    const customer = customers.find((c) => c.id === route.action);
    if (!customer) {
      return (
        <div className="bg-white rounded-2xl p-12 text-center border border-cg-border">
          <h2 className="text-xl font-bold text-cg-navy mb-2">Customer Not Found</h2>
          <p className="text-sm text-cg-muted mb-6">The requested customer record does not exist or has been removed.</p>
          <button
            type="button"
            onClick={() => navigate('customers')}
            className="px-4 py-2.5 bg-cg-blue text-white rounded-xl text-sm font-bold"
          >
            Back to Customers
          </button>
        </div>
      );
    }
    return (
      <CustomerProfile
        customer={customer}
        activeTab={profileTab}
        setActiveTab={setProfileTab}
        onBack={() => navigate('customers')}
        onEdit={() => navigate('customers', 'edit', customer.id)}
        onDelete={() => deleteCustomer(customer.id)}
      />
    );
  }

  // Filtering & Pagination
  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (c.id + c.name + c.mobile + (c.email || '') + (c.univ || '')).toLowerCase().includes(q);
    const matchesStatus = !statusFilter || c.status === statusFilter;
    const matchesType = !typeFilter || c.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportCSV = () => {
    const headers = ['Customer ID', 'Name', 'Mobile', 'Email', 'Type', 'Status', 'Assigned To', 'Created Date'];
    const rows = filtered.map((c) => [
      c.id,
      `"${c.name}"`,
      c.mobile,
      c.email || '',
      c.type,
      c.status,
      c.emp || '',
      c.created || ''
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `capital_grow_customers_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    addToast(`Exported ${filtered.length} customers to CSV`, 'ok');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Sanctioned':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Follow-up Due':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'No Response':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-cg-navy">Customers</h1>
          <p className="text-sm text-cg-muted mt-0.5">
            {filtered.length} customer record{filtered.length === 1 ? '' : 's'} found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold text-cg-text bg-white hover:bg-gray-50 border border-cg-border shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-cg-muted" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('customers', 'new')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cg-orange to-cg-orange-hover hover:brightness-95 shadow-orange transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Customer</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-cg-border shadow-card p-5">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cg-muted" />
            <input
              type="text"
              placeholder="Search by ID, name, mobile or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cg-border text-sm text-cg-text focus:outline-none focus:border-cg-blue"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2.5 rounded-xl border border-cg-border text-sm font-medium text-cg-text bg-white focus:outline-none focus:border-cg-blue"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2.5 rounded-xl border border-cg-border text-sm font-medium text-cg-text bg-white focus:outline-none focus:border-cg-blue"
          >
            <option value="">All Enquiry Types</option>
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        {pageItems.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-cg-border text-cg-muted font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Customer ID</th>
                    <th className="py-3 px-3">Customer Name</th>
                    <th className="py-3 px-3">Mobile</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Enquiry Type</th>
                    <th className="py-3 px-3">Assigned To</th>
                    <th className="py-3 px-3">Created</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cg-border">
                  {pageItems.map((cust) => (
                    <tr key={cust.id} className="hover:bg-cg-light-blue/40 transition-colors">
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => navigate('customers', cust.id)}
                          className="font-bold text-cg-blue hover:underline"
                        >
                          {cust.id}
                        </button>
                      </td>
                      <td className="py-3 px-3 font-bold text-cg-navy">{cust.name}</td>
                      <td className="py-3 px-3 text-cg-text">{cust.mobile}</td>
                      <td className="py-3 px-3 text-cg-muted">{cust.email || '-'}</td>
                      <td className="py-3 px-3 text-cg-text font-medium">{cust.type}</td>
                      <td className="py-3 px-3 text-cg-muted">{cust.emp || '-'}</td>
                      <td className="py-3 px-3 text-cg-muted">{cust.created || '-'}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadge(cust.status)}`}>
                          {cust.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => navigate('customers', cust.id)}
                            className="p-1.5 rounded-lg bg-blue-50 text-cg-blue hover:bg-blue-100 transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate('customers', 'edit', cust.id)}
                            className="p-1.5 rounded-lg bg-orange-50 text-cg-orange hover:bg-orange-100 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCustomer(cust.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-cg-border pt-4 mt-4 text-xs font-medium text-cg-muted">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-cg-border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-cg-border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-base font-bold text-cg-navy mb-1">No customers match</h3>
            <p className="text-xs text-cg-muted">Clear the filters or add a new customer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Subcomponent: Add / Edit Customer Form
// ----------------------------------------------------
const CustomerForm = ({ customer, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    mobile: customer?.mobile || '',
    alt: customer?.alt || '',
    email: customer?.email || '',
    dob: customer?.dob || '',
    gender: customer?.gender || 'Male',
    city: customer?.city || '',
    state: customer?.state || '',
    pin: customer?.pin || '',
    address: customer?.address || '',
    highest: customer?.highest || '',
    current: customer?.current || '',
    inst: customer?.inst || '',
    course: customer?.course || '',
    country: customer?.country || 'USA',
    univ: customer?.univ || '',
    adm: customer?.adm || 'Not Applied',
    intake: customer?.intake || '',
    refName: customer?.refName || '',
    refMobile: customer?.refMobile || '',
    src: customer?.src || 'Walk-in',
    emp: customer?.emp || EMP_OPTIONS[0],
    type: customer?.type || 'Education Loan',
    status: customer?.status || 'Under Process',
    remarks: customer?.remarks || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Customer name is required.';
    if (!/^[6-9]\d{9}$/.test(formData.mobile)) errs.mobile = 'Enter a valid 10-digit mobile number.';
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Enter a valid email address.';

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs font-bold text-cg-blue hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Customers
          </button>
          <h1 className="text-2xl font-bold text-cg-navy">{customer ? 'Edit Customer' : 'Add New Customer'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
          <h3 className="text-base font-bold text-cg-navy border-b border-cg-border pb-3">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Customer Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Full Name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
              />
              {errors.name && <span className="text-[11px] font-bold text-red-500 mt-1 block">{errors.name}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Mobile Number *</label>
              <input
                type="tel"
                maxLength={10}
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                placeholder="10-digit mobile"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
              />
              {errors.mobile && <span className="text-[11px] font-bold text-red-500 mt-1 block">{errors.mobile}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Alternate Mobile</label>
              <input
                type="tel"
                value={formData.alt}
                onChange={(e) => handleChange('alt', e.target.value)}
                placeholder="Secondary phone"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
              />
              {errors.email && <span className="text-[11px] font-bold text-red-500 mt-1 block">{errors.email}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue bg-white"
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Door No, Street Name, Area"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Pincode</label>
              <input
                type="text"
                maxLength={6}
                value={formData.pin}
                onChange={(e) => handleChange('pin', e.target.value)}
                placeholder="e.g. 600020"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
              />
            </div>
          </div>
        </div>

        {/* Education Information */}
        <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
          <h3 className="text-base font-bold text-cg-navy border-b border-cg-border pb-3">Education Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Highest Qualification</label>
              <input
                type="text"
                value={formData.highest}
                onChange={(e) => handleChange('highest', e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Target Country</label>
              <select
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue bg-white"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Target University</label>
              <input
                type="text"
                value={formData.univ}
                onChange={(e) => handleChange('univ', e.target.value)}
                placeholder="e.g. Northeastern University"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Course Name</label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => handleChange('course', e.target.value)}
                placeholder="e.g. MS in Data Science"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Admission Status</label>
              <select
                value={formData.adm}
                onChange={(e) => handleChange('adm', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue bg-white"
              >
                {ADM_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Expected Intake</label>
              <input
                type="text"
                value={formData.intake}
                onChange={(e) => handleChange('intake', e.target.value)}
                placeholder="e.g. Fall 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
              />
            </div>
          </div>
        </div>

        {/* Additional & Assigned */}
        <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
          <h3 className="text-base font-bold text-cg-navy border-b border-cg-border pb-3">Assignment & Remarks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Enquiry Type *</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue bg-white"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">CRM Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue bg-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Assigned Counselor</label>
              <select
                value={formData.emp}
                onChange={(e) => handleChange('emp', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue bg-white"
              >
                {EMP_OPTIONS.map((em) => (
                  <option key={em} value={em}>
                    {em}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-xs font-bold text-cg-navy mb-1.5">Counselor Remarks</label>
              <textarea
                rows={2}
                value={formData.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                placeholder="Notes about loan requirements, documentation, family discussion..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-sm focus:outline-none focus:border-cg-blue"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-cg-text bg-white hover:bg-gray-50 border border-cg-border"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cg-orange to-cg-orange-hover hover:brightness-95 shadow-orange"
          >
            {customer ? 'Save Changes' : 'Add Customer'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ----------------------------------------------------
// Subcomponent: Customer Profile Tabbed View
// ----------------------------------------------------
const CustomerProfile = ({ customer, activeTab, setActiveTab, onBack, onEdit, onDelete }) => {
  const tabs = [
    'Overview',
    'Personal Information',
    'Education Details',
    'Enquiries',
    'Loan Applications',
    'Insurance',
    'Follow-up History',
    'Timeline & Remarks'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-cg-blue hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Customers
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-cg-navy bg-white hover:bg-gray-50 border border-cg-border"
          >
            Edit Record
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Header Profile Badge */}
      <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-cg-navy text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
            {customer.name[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-cg-navy">{customer.name}</h2>
            <p className="text-xs text-cg-muted">
              {customer.id} · {customer.mobile} · {customer.email || 'No email provided'}
            </p>
          </div>
        </div>
        <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 w-fit">
          {customer.status}
        </span>
      </div>

      {/* Profile Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-cg-border pb-px">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === idx
                ? 'border-cg-orange text-cg-navy font-extrabold'
                : 'border-transparent text-cg-muted hover:text-cg-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card">
        {activeTab === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Enquiry Type</span>
              <b className="text-cg-navy text-sm font-bold">{customer.type}</b>
            </div>
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Assigned Counselor</span>
              <b className="text-cg-navy text-sm font-bold">{customer.emp || '-'}</b>
            </div>
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Country Interested</span>
              <b className="text-cg-navy text-sm font-bold">{customer.country || 'USA'}</b>
            </div>
            <div>
              <span className="text-cg-muted block mb-1 font-medium">University / College</span>
              <b className="text-cg-navy text-sm font-bold">{customer.univ || '-'}</b>
            </div>
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Course Interested</span>
              <b className="text-cg-navy text-sm font-bold">{customer.course || '-'}</b>
            </div>
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Next Follow-up</span>
              <b className="text-cg-navy text-sm font-bold">{customer.followup || '-'}</b>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Full Name</span>
              <b className="text-cg-navy text-sm font-bold">{customer.name}</b>
            </div>
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Mobile Number</span>
              <b className="text-cg-navy text-sm font-bold">{customer.mobile}</b>
            </div>
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Email Address</span>
              <b className="text-cg-navy text-sm font-bold">{customer.email || '-'}</b>
            </div>
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Gender</span>
              <b className="text-cg-navy text-sm font-bold">{customer.gender || '-'}</b>
            </div>
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Date of Birth</span>
              <b className="text-cg-navy text-sm font-bold">{customer.dob || '-'}</b>
            </div>
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Pincode</span>
              <b className="text-cg-navy text-sm font-bold">{customer.pin || '-'}</b>
            </div>
            <div className="lg:col-span-3">
              <span className="text-cg-muted block mb-1 font-medium">Address</span>
              <b className="text-cg-navy text-sm font-bold">{customer.address || '-'}</b>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Highest Qualification</span>
              <b className="text-cg-navy text-sm font-bold">{customer.highest || '-'}</b>
            </div>
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Target Country</span>
              <b className="text-cg-navy text-sm font-bold">{customer.country || '-'}</b>
            </div>
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Target University</span>
              <b className="text-cg-navy text-sm font-bold">{customer.univ || '-'}</b>
            </div>
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Course Name</span>
              <b className="text-cg-navy text-sm font-bold">{customer.course || '-'}</b>
            </div>
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Admission Status</span>
              <b className="text-cg-navy text-sm font-bold">{customer.adm || '-'}</b>
            </div>
            <div>
              <span className="text-cg-muted block mb-1 font-medium">Intake</span>
              <b className="text-cg-navy text-sm font-bold">{customer.intake || '-'}</b>
            </div>
          </div>
        )}

        {activeTab > 2 && (
          <div className="text-center py-10">
            <h4 className="text-sm font-bold text-cg-navy mb-1">{tabs[activeTab]}</h4>
            <p className="text-xs text-cg-muted">
              {customer.remarks || 'No additional records logged for this section yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


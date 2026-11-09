import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Building,
  Key,
  Shield,
  Briefcase,
  LayoutGrid,
  List,
  Download,
  Filter,
  Lock,
  Unlock,
  Check,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Calendar,
  Eye,
  MoreVertical,
  Activity,
  Award,
  ChevronDown,
  X
} from 'lucide-react';

const INITIAL_STAFF_USERS = [
  {
    id: 'CG-EMP-101',
    name: 'Admin User',
    email: 'admin@capitalgrow.co.in',
    mobile: '9840012345',
    role: 'Admin',
    branch: 'Chennai HQ',
    status: 'Active',
    assignedLeads: 54,
    conversionRate: '48.2%',
    joinedDate: '2024-06-01',
    lastActive: 'Just now',
    permissions: ['All Modules', 'Payments & Payouts', 'User Management', 'Sanctions', 'Decline Approval']
  },
  {
    id: 'CG-EMP-102',
    name: 'Divya Ramesh',
    email: 'divya.r@capitalgrow.co.in',
    mobile: '9840188990',
    role: 'User',
    branch: 'Chennai HQ',
    status: 'Active',
    assignedLeads: 32,
    conversionRate: '45.0%',
    joinedDate: '2025-01-10',
    lastActive: '5 mins ago',
    permissions: ['Lead Enquiries', 'Bank Logins', 'Customer Profiles', 'Follow-up Calls']
  },
  {
    id: 'CG-EMP-103',
    name: 'Meena R',
    email: 'meena.r@capitalgrow.co.in',
    mobile: '9840198765',
    role: 'User',
    branch: 'Adyar Branch',
    status: 'Active',
    assignedLeads: 36,
    conversionRate: '42.8%',
    joinedDate: '2024-11-15',
    lastActive: '12 mins ago',
    permissions: ['Lead Enquiries', 'Bank Logins', 'Customer Profiles', 'Follow-up Calls']
  },
  {
    id: 'CG-EMP-104',
    name: 'Arun Kumar',
    email: 'arun.k@capitalgrow.co.in',
    mobile: '9840254321',
    role: 'User',
    branch: 'T. Nagar Branch',
    status: 'Active',
    assignedLeads: 29,
    conversionRate: '38.5%',
    joinedDate: '2025-02-10',
    lastActive: '1 hour ago',
    permissions: ['Lead Enquiries', 'Bank Logins', 'Customer Profiles', 'Follow-up Calls']
  },
  {
    id: 'CG-EMP-105',
    name: 'Kavitha S',
    email: 'kavitha.s@capitalgrow.co.in',
    mobile: '9840311223',
    role: 'User',
    branch: 'Anna Nagar Branch',
    status: 'Active',
    assignedLeads: 24,
    conversionRate: '35.0%',
    joinedDate: '2025-04-18',
    lastActive: '3 hours ago',
    permissions: ['Lead Enquiries', 'Bank Logins', 'Customer Profiles', 'Follow-up Calls']
  },
  {
    id: 'CG-EMP-106',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@capitalgrow.co.in',
    mobile: '9840499887',
    role: 'Admin',
    branch: 'Coimbatore Branch',
    status: 'Active',
    assignedLeads: 18,
    conversionRate: '44.1%',
    joinedDate: '2025-07-01',
    lastActive: 'Yesterday',
    permissions: ['All Modules', 'Payments & Payouts', 'User Management', 'Sanctions', 'Decline Approval']
  },
  {
    id: 'CG-EMP-107',
    name: 'Suresh Iyer',
    email: 'suresh.i@capitalgrow.co.in',
    mobile: '9840566778',
    role: 'User',
    branch: 'Madurai Branch',
    status: 'Inactive',
    assignedLeads: 6,
    conversionRate: '28.0%',
    joinedDate: '2025-09-12',
    lastActive: '5 days ago',
    permissions: ['Lead Enquiries', 'Bank Logins']
  }
];

const ROLES_LIST = [
  {
    role: 'Admin',
    desc: 'Full administrator access to Payments, User Management, Bank Logins, Sanctions, and System Settings.',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    badgeBg: 'bg-purple-500'
  },
  {
    role: 'User',
    desc: 'Standard counselor & staff access to Enquiries, Leads, and Bank Logins (Payments & User Mgmt restricted).',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    badgeBg: 'bg-blue-500'
  }
];

const BRANCHES = [
  'Chennai HQ',
  'Adyar Branch',
  'T. Nagar Branch',
  'Anna Nagar Branch',
  'Coimbatore Branch',
  'Madurai Branch',
  'Salem Branch'
];

export const UserManagementPage = () => {
  const { addToast, simulateCall } = useApp();

  // State
  const [usersList, setUsersList] = useState(INITIAL_STAFF_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'users', 'admins', 'inactive'
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Modals
  const [addUserModal, setAddUserModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState({ isOpen: false, user: null });
  const [viewUserModal, setViewUserModal] = useState({ isOpen: false, user: null });
  const [permissionsModal, setPermissionsModal] = useState(false);

  // Form State
  const initialForm = {
    name: '',
    email: '',
    mobile: '',
    role: 'User',
    branch: 'Chennai HQ',
    status: 'Active',
    tempPassword: ''
  };
  const [formData, setFormData] = useState(initialForm);

  // Filtered Users
  const filteredUsers = usersList.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q || (u.name + u.email + u.mobile + u.branch + u.role + u.id).toLowerCase().includes(q);

    const matchesRole = !roleFilter || u.role === roleFilter;
    const matchesBranch = !branchFilter || u.branch === branchFilter;

    let matchesTab = true;
    if (activeTab === 'admins') matchesTab = u.role.includes('Admin');
    else if (activeTab === 'users' || activeTab === 'counselors') matchesTab = u.role === 'User';
    else if (activeTab === 'inactive') matchesTab = u.status === 'Inactive';

    return matchesSearch && matchesRole && matchesBranch && matchesTab;
  });

  // KPI Calculations
  const totalStaff = usersList.length;
  const activeCount = usersList.filter((u) => u.status === 'Active').length;
  const adminCount = usersList.filter((u) => u.role.includes('Admin')).length;
  const userCount = usersList.filter((u) => u.role === 'User').length;
  const totalAssignedLeads = usersList.reduce((acc, u) => acc + (u.assignedLeads || 0), 0);

  // Handlers
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      addToast('Please enter full name and email address', 'error');
      return;
    }

    const newUser = {
      ...formData,
      id: `CG-EMP-${String(usersList.length + 101).padStart(3, '0')}`,
      assignedLeads: 0,
      conversionRate: '0.0%',
      joinedDate: new Date().toISOString().slice(0, 10),
      lastActive: 'Just created',
      permissions:
        formData.role === 'Admin'
          ? ['All Modules', 'Payments & Payouts', 'User Management', 'Sanctions', 'Decline Approval']
          : ['Lead Enquiries', 'Bank Logins', 'Customer Profiles', 'Follow-up Calls']
    };

    setUsersList((prev) => [newUser, ...prev]);
    setAddUserModal(false);
    setFormData(initialForm);
    addToast(`New staff member added: ${newUser.name} (${newUser.role})`, 'ok');
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!editUserModal.user) return;
    setUsersList((prev) =>
      prev.map((u) => (u.id === editUserModal.user.id ? { ...u, ...formData } : u))
    );
    setEditUserModal({ isOpen: false, user: null });
    addToast(`Updated user profile: ${formData.name}`, 'ok');
  };

  const handleToggleStatus = (id) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
      )
    );
    addToast('Staff status updated', 'ok');
  };

  const handleDeleteUser = (id, name) => {
    if (confirm(`Remove staff user ${name}? This action will reassign their leads.`)) {
      setUsersList((prev) => prev.filter((u) => u.id !== id));
      addToast(`User ${name} removed`, 'ok');
    }
  };

  const exportCSV = () => {
    const headers = ['Staff ID', 'Name', 'Email', 'Mobile', 'Role', 'Branch', 'Status', 'Assigned Leads', 'Conversion'];
    const rows = filteredUsers.map((u) => [
      u.id,
      u.name,
      u.email,
      u.mobile,
      u.role,
      u.branch,
      u.status,
      u.assignedLeads,
      u.conversionRate
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `capital_grow_staff_list_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Exported staff directory to CSV', 'ok');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
      case 'Super Admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'User':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cg-navy to-cg-blue text-white flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5 text-cg-orange" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-cg-navy flex items-center gap-2">
                <span>User &amp; Counselor Management</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                  Admin Only
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPermissionsModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white text-cg-navy hover:bg-gray-50 border border-cg-border rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Permissions Matrix</span>
          </button>

         

          <button
            type="button"
            onClick={() => {
              setFormData(initialForm);
              setAddUserModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cg-orange to-cg-orange-hover text-white rounded-xl text-xs font-bold shadow-orange hover:brightness-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Staff */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-cg-border shadow-card flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-cg-muted uppercase tracking-wider block">Total Staff Members</span>
            <div className="text-3xl font-black text-cg-navy mt-0.5">{totalStaff}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeCount} Active now</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-cg-blue flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

       

       

        
      </div>

      {/* Main Container: Filter Bar, Sub-tabs & Views */}
      <div className="bg-white rounded-2xl p-5 border border-cg-border shadow-card space-y-4">
        {/* Tab Switcher & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Sub-tabs */}
          <div className="inline-flex bg-gray-100 p-1.5 rounded-xl gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all' ? 'bg-white text-cg-navy shadow-sm' : 'text-cg-muted hover:text-cg-text'
              }`}
            >
              All Users ({usersList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'users' ? 'bg-white text-cg-navy shadow-sm' : 'text-cg-muted hover:text-cg-text'
              }`}
            >
              Users ({userCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admins')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'admins' ? 'bg-white text-cg-navy shadow-sm' : 'text-cg-muted hover:text-cg-text'
              }`}
            >
              Admins ({adminCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('inactive')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'inactive' ? 'bg-white text-cg-navy shadow-sm' : 'text-cg-muted hover:text-cg-text'
              }`}
            >
              Inactive ({usersList.filter((u) => u.status === 'Inactive').length})
            </button>
          </div>

          {/* Search, Filter & View Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-cg-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user name, email, branch..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-cg-border text-xs text-cg-text focus:outline-none focus:border-cg-blue"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-cg-border text-xs text-cg-text bg-white focus:outline-none focus:border-cg-blue font-medium"
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>

           

            {/* View Mode Toggle */}
            <div className="inline-flex bg-gray-100 p-1 rounded-xl gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-white text-cg-navy shadow-sm' : 'text-cg-muted hover:text-cg-text'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-cg-navy shadow-sm' : 'text-cg-muted hover:text-cg-text'
                }`}
                title="Grid / Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content View: Table or Grid */}
        {filteredUsers.length > 0 ? (
          viewMode === 'table' ? (
            /* ======================================================== */
            /* VIEW 1: DATA TABLE                                       */
            /* ======================================================== */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-cg-border text-cg-muted font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Staff Member</th>
                    <th className="py-3 px-3">Role &amp; Title</th>
                  
                    <th className="py-3 px-3">Contact Information</th>
                    
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cg-border">
                  {filteredUsers.map((u) => {
                    const isAdmin = u.role.includes('Admin');

                    return (
                      <tr
                        key={u.id}
                        onClick={() => setViewUserModal({ isOpen: true, user: u })}
                        className="hover:bg-cg-light-blue/40 transition-colors cursor-pointer group"
                      >
                        {/* Member */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cg-navy to-cg-blue text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                {u.name[0]}
                              </div>
                              <span
                                className={`w-2.5 h-2.5 rounded-full absolute -top-0.5 -right-0.5 border-2 border-white ${
                                  u.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'
                                }`}
                              />
                            </div>
                            <div>
                              <span className="font-bold text-cg-navy text-sm group-hover:text-cg-blue transition-colors block">
                                {u.name}
                              </span>
                              <span className="font-mono text-[10px] text-cg-muted block">{u.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getRoleBadge(
                              u.role
                            )}`}
                          >
                            {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            <span>{u.role}</span>
                          </span>
                        </td>


                        {/* Contact */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1 font-medium text-cg-navy">
                            <Mail className="w-3 h-3 text-cg-muted" />
                            <span>{u.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-cg-muted mt-0.5">
                            <Phone className="w-3 h-3 text-cg-muted" />
                            <span>{u.mobile}</span>
                          </div>
                        </td>

                     
                       

                        {/* Status Toggle */}
                        <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                              u.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.status === 'Active' ? 'bg-emerald-600' : 'bg-gray-400'
                              }`}
                            />
                            <span>{u.status}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setViewUserModal({ isOpen: true, user: u })}
                              className="p-1.5 rounded-lg bg-blue-50 text-cg-blue hover:bg-blue-100 transition-colors"
                              title="View User Profile"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  name: u.name,
                                  email: u.email,
                                  mobile: u.mobile,
                                  role: u.role,
                                  branch: u.branch,
                                  status: u.status,
                                  tempPassword: ''
                                });
                                setEditUserModal({ isOpen: true, user: u });
                              }}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-cg-navy transition-colors"
                              title="Edit User"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                              title="Delete User"
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
            /* ======================================================== */
            /* VIEW 2: GRID CARDS                                       */
            /* ======================================================== */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((u) => {
                const isAdmin = u.role.includes('Admin');

                return (
                  <div
                    key={u.id}
                    onClick={() => setViewUserModal({ isOpen: true, user: u })}
                    className="bg-white rounded-2xl p-5 border border-cg-border shadow-card hover:border-cg-blue/50 hover:shadow-lg transition-all cursor-pointer space-y-4 relative group"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cg-navy to-cg-blue text-white flex items-center justify-center font-bold text-base shadow-sm">
                          {u.name[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-cg-navy text-sm group-hover:text-cg-blue transition-colors">
                            {u.name}
                          </h3>
                          <span className="font-mono text-[10px] text-cg-muted block">{u.id}</span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${getRoleBadge(
                              u.role
                            )}`}
                          >
                            {u.role}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(u.id);
                        }}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {u.status}
                      </button>
                    </div>

                    {/* Contact & Branch Info */}
                    <div className="space-y-1.5 text-xs text-cg-text bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                    
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-cg-muted shrink-0" />
                        <span className="truncate">{u.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-cg-muted shrink-0" />
                        <span>{u.mobile}</span>
                      </div>
                    </div>

                   

                    {/* Card Footer Actions */}
                    <div className="flex items-center justify-between text-xs pt-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] text-cg-muted">Active {u.lastActive}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              name: u.name,
                              email: u.email,
                              mobile: u.mobile,
                              role: u.role,
                              branch: u.branch,
                              status: u.status,
                              tempPassword: ''
                            });
                            setEditUserModal({ isOpen: true, user: u });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-cg-navy font-bold text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewUserModal({ isOpen: true, user: u })}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-cg-blue font-bold text-[11px]"
                        >
                          Profile
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-cg-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-cg-navy mb-1">No staff members found</h3>
            <p className="text-xs text-cg-muted mb-4">Try clearing filters or search keywords.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('');
                setBranchFilter('');
                setActiveTab('all');
              }}
              className="px-4 py-2 bg-cg-blue text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ADD NEW USER                                    */}
      {/* ======================================================== */}
      {addUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cg-navy/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-cg-border space-y-4 animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-cg-orange" />
                <h3 className="text-lg font-bold text-cg-navy">Add New Staff Member</h3>
              </div>
              <button
                type="button"
                onClick={() => setAddUserModal(false)}
                className="text-gray-400 hover:text-cg-navy transition-colors p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Divya Ramesh"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-cg-navy placeholder-gray-400 focus:outline-none focus:border-cg-blue"
                />
              </div>

              {/* Email & Mobile (2 cols) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="divya.r@capitalgrow.co.in"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-cg-navy placeholder-gray-400 focus:outline-none focus:border-cg-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1.5">Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9840XXXXXX"
                    value={formData.mobile}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-cg-navy placeholder-gray-400 focus:outline-none focus:border-cg-blue"
                  />
                </div>
              </div>

              {/* System Role * */}
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">System Role *</label>
                <div className="relative">
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                    className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue font-medium cursor-pointer pr-10"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-cg-navy absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Default Initial Password */}
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1.5">Default Initial Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.tempPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tempPassword: e.target.value }))}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-cg-navy bg-white focus:outline-none focus:border-cg-blue"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">Staff will be prompted to reset upon first login.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddUserModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-cg-orange hover:bg-cg-orange-hover shadow-orange transition-all"
                >
                  Create &amp; Send Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT USER                                       */}
      {/* ======================================================== */}
      {editUserModal.isOpen && editUserModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cg-navy/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-cg-border space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-cg-border pb-3">
              <h3 className="text-base font-bold text-cg-navy">Edit Staff Member: {editUserModal.user.name}</h3>
              <button
                type="button"
                onClick={() => setEditUserModal({ isOpen: false, user: null })}
                className="text-cg-muted hover:text-cg-text font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1">Mobile</label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1">System Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs bg-white font-medium focus:outline-none focus:border-cg-blue"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-cg-navy mb-1">Branch</label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData((prev) => ({ ...prev, branch: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs bg-white font-medium focus:outline-none focus:border-cg-blue"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-cg-navy mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cg-border text-xs bg-white font-medium focus:outline-none focus:border-cg-blue"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive / Suspended</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditUserModal({ isOpen: false, user: null })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-cg-muted border border-cg-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-cg-blue hover:bg-cg-blue/90 shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: VIEW USER PROFILE / PERFORMANCE                 */}
      {/* ======================================================== */}
      {viewUserModal.isOpen && viewUserModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cg-navy/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-cg-border space-y-5 animate-scale-up text-xs">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-cg-border pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cg-navy to-cg-blue text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {viewUserModal.user.name[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-cg-navy">{viewUserModal.user.name}</h3>
                  <span className="font-mono text-[11px] text-cg-muted block">{viewUserModal.user.id}</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${getRoleBadge(
                      viewUserModal.user.role
                    )}`}
                  >
                    {viewUserModal.user.role}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewUserModal({ isOpen: false, user: null })}
                className="text-cg-muted hover:text-cg-text font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Performance Strip */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
                <span className="text-[10px] text-cg-muted font-bold uppercase block">Active Leads</span>
                <b className="text-base font-black text-cg-blue">{viewUserModal.user.assignedLeads}</b>
              </div>
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-cg-muted font-bold uppercase block">Conversion Rate</span>
                <b className="text-base font-black text-emerald-700">{viewUserModal.user.conversionRate}</b>
              </div>
              <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100">
                <span className="text-[10px] text-cg-muted font-bold uppercase block">Status</span>
                <b className="text-xs font-bold text-purple-800 block mt-1">{viewUserModal.user.status}</b>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-2.5 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-cg-muted font-semibold">Email:</span>
                <b className="text-cg-navy">{viewUserModal.user.email}</b>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cg-muted font-semibold">Mobile:</span>
                <div className="flex items-center gap-1.5 font-bold text-cg-navy">
                  <span>{viewUserModal.user.mobile}</span>
                  <button
                    type="button"
                    onClick={() => simulateCall(viewUserModal.user.name)}
                    className="p-1 rounded bg-blue-100 text-cg-blue"
                    title="Call staff"
                  >
                    <Phone className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cg-muted font-semibold">Branch:</span>
                <b className="text-cg-navy">{viewUserModal.user.branch}</b>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cg-muted font-semibold">Joined Date:</span>
                <b className="text-cg-navy">{viewUserModal.user.joinedDate}</b>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cg-muted font-semibold">Last Active:</span>
                <b className="text-cg-navy">{viewUserModal.user.lastActive}</b>
              </div>
            </div>

            {/* Permissions list */}
            <div>
              <span className="text-[10px] text-cg-muted uppercase font-bold block mb-1.5">
                Enabled Access Permissions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {viewUserModal.user.permissions?.map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-cg-blue font-semibold text-[11px] border border-blue-100 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{p}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-cg-border">
              <button
                type="button"
                onClick={() => setViewUserModal({ isOpen: false, user: null })}
                className="px-4 py-2 rounded-xl text-xs font-bold text-cg-navy bg-white hover:bg-gray-100 border border-cg-border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: PERMISSIONS MATRIX (RBAC)                       */}
      {/* ======================================================== */}
      {permissionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cg-navy/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-cg-border space-y-4 animate-scale-up text-xs">
            <div className="flex items-center justify-between border-b border-cg-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-cg-navy">Role-Based Access Control (RBAC) Matrix</h3>
              </div>
              <button
                type="button"
                onClick={() => setPermissionsModal(false)}
                className="text-cg-muted hover:text-cg-text font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-cg-muted leading-relaxed">
              Standard privilege permissions mapped across roles in Capital Grow CRM. Restricted modules like{' '}
              <b>Payments</b> and <b>User Management</b> are restricted to Admin accounts only.
            </p>

            <div className="border border-cg-border rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-cg-border text-cg-navy font-bold">
                  <tr>
                    <th className="p-3">CRM Capability / Module</th>
                    <th className="p-3 text-center">Admin</th>
                    <th className="p-3 text-center">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cg-border">
                  <tr>
                    <td className="p-3 font-semibold text-cg-navy">1. Enquiries &amp; Leads Entry</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓ Full</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-cg-navy">2. Bank Login Details (Bank, SM, App No)</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓ Full</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-cg-navy">3. Loan Sanction &amp; Decline Decisions</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓ Full</td>
                  </tr>
                  <tr className="bg-purple-50/50">
                    <td className="p-3 font-bold text-purple-900">
                      4. Payments &amp; Payouts (Bank, Customer, Vendor)
                    </td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓ Full (Admin Only)</td>
                    <td className="p-3 text-center text-rose-500 font-bold">✕ Hidden (No Access)</td>
                  </tr>
                  <tr className="bg-purple-50/50">
                    <td className="p-3 font-bold text-purple-900">5. User Management</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓ Full (Admin Only)</td>
                    <td className="p-3 text-center text-rose-500 font-bold">✕ Hidden (No Access)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-cg-navy">6. System Settings &amp; Data Reset</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">✓ Full</td>
                    <td className="p-3 text-center text-rose-500 font-bold">✕ No</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setPermissionsModal(false)}
                className="px-4 py-2 bg-cg-blue text-white rounded-xl text-xs font-bold"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

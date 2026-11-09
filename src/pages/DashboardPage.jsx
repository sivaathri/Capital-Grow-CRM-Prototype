import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  FileText,
  CheckCircle2,
  Coins,
  Shield,
  Phone,
  Eye,
  Plus,
  UserPlus,
  Calendar,
  ArrowUpRight,
  Building2,
  CreditCard,
  ArrowRight
} from 'lucide-react';

export const DashboardPage = () => {
  const { customers, followups, navigate, simulateCall } = useApp();
  const [dateRange, setDateRange] = useState('Last 30 Days');

  // KPI calculations
  const kpis = [
    {
      label: 'Total Customers',
      value: '1,248',
      change: '+12.8%',
      icon: Users,
      color: '#0866C6',
      bgColor: '#E4F0FF'
    },
    {
      label: 'Loan Applications',
      value: '286',
      change: '+8.6%',
      icon: FileText,
      color: '#FF7900',
      bgColor: '#FFEBD6'
    },
    {
      label: 'Sanctioned Loans',
      value: '174',
      change: '+15.2%',
      icon: CheckCircle2,
      color: '#16a34a',
      bgColor: '#DDF5E6'
    },
    {
      label: 'Disbursement',
      value: '₹8.6 Cr',
      change: '+21.4%',
      icon: Coins,
      color: '#e59a00',
      bgColor: '#FFF1C9'
    },
    {
      label: 'Insurance Enquiries',
      value: '96',
      change: '+9.8%',
      icon: Shield,
      color: '#6b45d6',
      bgColor: '#EEE8FF'
    }
  ];

  // Application Donut Segments
  const donutData = [
    { status: 'Lead', count: customers.filter((c) => c.status === 'Lead').length || 1, color: '#0866C6' },
    { status: 'In Login', count: customers.filter((c) => c.status === 'Login').length || 1, color: '#FF7900' },
    { status: 'Disbursement', count: customers.filter((c) => c.status === 'Disbursement').length || 2, color: '#16a34a' },
    { status: 'Declined', count: customers.filter((c) => c.status === 'Declined').length || 1, color: '#ef4444' }
  ];
  const totalApps = donutData.reduce((acc, d) => acc + d.count, 0);

  // SVG Area Line Chart Data
  const chartLabels = ['Oct 7', 'Oct 10', 'Oct 13', 'Oct 16', 'Oct 19', 'Oct 22', 'Oct 25', 'Oct 28', 'Oct 31', 'Nov 3', 'Nov 6'];
  const eduData = [25, 48, 38, 60, 55, 68, 63, 80, 73, 100, 88];
  const insData = [18, 24, 20, 33, 28, 40, 36, 50, 42, 58, 50];

  const chartW = 620;
  const chartH = 240;
  const padL = 36;
  const padB = 26;
  const padT = 15;
  const maxVal = 120;

  const getX = (i) => padL + (i * (chartW - padL - 10)) / (chartLabels.length - 1);
  const getY = (val) => padT + (chartH - padT - padB) * (1 - val / maxVal);

  const getPath = (data) => data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`).join(' ');
  const getArea = (data) => `${getPath(data)} L ${getX(data.length - 1)} ${chartH - padB} L ${getX(0)} ${chartH - padB} Z`;

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Lead':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Login':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Disbursement':
      case 'Sanctioned':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Declined':
        return 'bg-rose-100 text-rose-700 border-rose-200';
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-cg-navy">Dashboard</h1>
          
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-white border border-cg-border rounded-xl text-xs sm:text-sm font-semibold text-cg-navy shadow-sm focus:outline-none focus:border-cg-blue"
          >
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 90 Days</option>
          </select>
          <button
            type="button"
            onClick={() => navigate('education-loan')}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cg-orange to-cg-orange-hover hover:brightness-95 shadow-orange transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Enquiry</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-cg-border shadow-card hover:shadow-md transition-shadow relative overflow-hidden"
              style={{ borderBottom: `3px solid ${kpi.color}` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-cg-muted uppercase tracking-wider">{kpi.label}</span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: kpi.bgColor, color: kpi.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-cg-navy">{kpi.value}</span>
                <span className="flex items-center text-xs font-bold text-green-600">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiry Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-cg-border shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-cg-navy">Enquiry Trend</h3>
              <p className="text-xs text-cg-muted">Comparative lead volume over the past month</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cg-blue" />
                Education Loan
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cg-orange" />
                Insurance
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto min-w-[500px]">
              {/* Horizontal Gridlines */}
              {[0, 30, 60, 90, 120].map((v) => (
                <g key={v}>
                  <line
                    x1={padL}
                    x2={chartW - 10}
                    y1={getY(v)}
                    y2={getY(v)}
                    stroke="#E1E8F0"
                    strokeDasharray="4 4"
                  />
                  <text x={padL - 8} y={getY(v) + 4} textAnchor="end" className="text-[10px] fill-cg-muted font-medium">
                    {v}
                  </text>
                </g>
              ))}

              {/* Area Fills */}
              <path d={getArea(eduData)} fill="#0866C6" opacity="0.12" />
              <path d={getArea(insData)} fill="#FF7900" opacity="0.12" />

              {/* Lines */}
              <path d={getPath(eduData)} fill="none" stroke="#0866C6" strokeWidth="2.5" />
              <path d={getPath(insData)} fill="none" stroke="#FF7900" strokeWidth="2.5" />

              {/* Points & X-Labels */}
              {chartLabels.map((lbl, i) => (
                <g key={i}>
                  <circle cx={getX(i)} cy={getY(eduData[i])} r="3.5" fill="#fff" stroke="#0866C6" strokeWidth="2" />
                  <circle cx={getX(i)} cy={getY(insData[i])} r="3.5" fill="#fff" stroke="#FF7900" strokeWidth="2" />
                  <text x={getX(i)} y={chartH - 6} textAnchor="middle" className="text-[10px] fill-cg-muted font-medium">
                    {lbl}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Application Status Donut */}
        <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-cg-navy mb-1">Application Status</h3>
            <p className="text-xs text-cg-muted mb-4">Stage distribution of active files</p>
          </div>

          <div className="flex items-center justify-center my-2">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg viewBox="0 0 170 170" className="w-full h-full -rotate-90">
                {(() => {
                  const radius = 62;
                  const circ = 2 * Math.PI * radius;
                  let offset = 0;
                  return donutData.map((d, i) => {
                    const strokeDash = (d.count / totalApps) * circ;
                    const strokeOffset = -offset;
                    offset += strokeDash;
                    return (
                      <circle
                        key={i}
                        cx="85"
                        cy="85"
                        r={radius}
                        fill="transparent"
                        stroke={d.color}
                        strokeWidth="22"
                        strokeDasharray={`${strokeDash} ${circ - strokeDash}`}
                        strokeDashoffset={strokeOffset}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-cg-navy leading-none">{totalApps}</span>
                <span className="text-[11px] text-cg-muted font-semibold mt-1">Applications</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {donutData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-cg-text">{item.status}</span>
                </div>
                <span className="font-bold text-cg-navy">
                  {item.count} ({((item.count / totalApps) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Enquiries & Follow-ups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Active Applications */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-cg-border shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-cg-border pb-3">
            <div>
              <h3 className="text-base font-bold text-cg-navy">Recent Customer Enquiries &amp; Applications</h3>
              <p className="text-xs text-cg-muted">Active leads flowing through the loan and insurance pipeline</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('login-status')}
              className="text-xs font-bold text-cg-blue hover:underline flex items-center gap-1"
            >
              <span>View All in Login Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[550px]">
              <thead>
                <tr className="text-cg-muted font-bold uppercase text-[10px] tracking-wider border-b border-gray-100 pb-2">
                  <th className="py-2">Customer / ID</th>
                  <th className="py-2">Target Destination</th>
                  <th className="py-2">Loan Amount</th>
                  <th className="py-2">Current Stage</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3">
                      <b className="text-cg-navy block font-bold">{c.name}</b>
                      <span className="text-[11px] text-cg-muted font-mono">{c.id} • {c.mobile}</span>
                    </td>
                    <td className="py-3">
                      <span className="font-semibold text-cg-navy block">{c.univ || c.course || 'University'}</span>
                      <span className="text-[11px] text-cg-muted">{c.country || 'USA'}</span>
                    </td>
                    <td className="py-3">
                      <b className="text-cg-orange font-bold text-xs">{c.loanAmount || '₹ 40,00,000'}</b>
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (c.eduLoanId) {
                            navigate('education-loan', 'view', c.eduLoanId);
                          } else {
                            navigate('login-status');
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-cg-blue font-bold text-[11px] transition-colors"
                      >
                        View File
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Counselor Follow-up Schedule */}
        <div className="bg-white rounded-2xl p-6 border border-cg-border shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-cg-border pb-3">
              <div>
                <h3 className="text-base font-bold text-cg-navy flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cg-orange" />
                  <span>Today's Follow-ups</span>
                </h3>
                <p className="text-xs text-cg-muted">Scheduled client calls &amp; verification reminders</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-cg-orange">
                {followups.length} Due
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {followups.map((f) => (
                <div
                  key={f.id}
                  className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:border-blue-200 transition-all space-y-1.5 shadow-none hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-cg-blue px-2 py-0.5 rounded bg-blue-50 border border-blue-100">
                      {f.time}
                    </span>
                    <button
                      type="button"
                      onClick={() => simulateCall(f.name)}
                      className="flex items-center gap-1 text-[11px] font-bold text-cg-blue hover:underline p-1 rounded hover:bg-blue-50"
                      title="Call customer"
                    >
                      <Phone className="w-3 h-3 text-cg-orange" />
                      <span>Call</span>
                    </button>
                  </div>
                  <div>
                    <b className="text-xs font-bold text-cg-navy block">{f.name}</b>
                    <p className="text-[11px] text-cg-muted leading-tight mt-0.5">{f.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('customers')}
            className="w-full py-2.5 rounded-xl border border-cg-border hover:bg-gray-50 text-xs font-bold text-cg-navy transition-colors text-center"
          >
            Open Full Customer CRM &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};


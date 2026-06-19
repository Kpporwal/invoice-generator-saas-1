import {
  IndianRupee,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileEdit,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { useInvoiceStore } from '../../store/InvoiceContext';
import { formatCurrency } from '../../utils/calculations';
import Layout from '../layout/Layout';

type Page = 'dashboard' | 'create' | 'history' | 'preview';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { invoices, loading, getStats } = useInvoiceStore();
  const stats = getStats();

  if (loading) {
    return (
      <Layout title="Dashboard" subtitle="Overview of your invoicing activity">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-slate-400" />
          <span className="ml-3 text-sm text-slate-500">Loading invoices...</span>
        </div>
      </Layout>
    );
  }

  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: IndianRupee, color: 'emerald', bg: 'from-emerald-50 to-teal-50', iconBg: 'bg-emerald-100 text-emerald-600' },
    { label: 'Total Invoices', value: stats.totalInvoices.toString(), icon: FileText, color: 'blue', bg: 'from-blue-50 to-sky-50', iconBg: 'bg-blue-100 text-blue-600' },
    { label: 'Paid', value: stats.paidInvoices.toString(), icon: CheckCircle2, color: 'green', bg: 'from-green-50 to-emerald-50', iconBg: 'bg-green-100 text-green-600' },
    { label: 'Pending', value: stats.pendingInvoices.toString(), icon: Clock, color: 'amber', bg: 'from-amber-50 to-yellow-50', iconBg: 'bg-amber-100 text-amber-600' },
    { label: 'Overdue', value: stats.overdueInvoices.toString(), icon: AlertTriangle, color: 'red', bg: 'from-red-50 to-rose-50', iconBg: 'bg-red-100 text-red-600' },
    { label: 'Drafts', value: stats.draftInvoices.toString(), icon: FileEdit, color: 'slate', bg: 'from-slate-50 to-gray-50', iconBg: 'bg-slate-100 text-slate-600' },
  ];

  const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-600',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-emerald-100 text-emerald-700',
    overdue: 'bg-red-100 text-red-700',
  };

  return (
    <Layout title="Dashboard" subtitle="Overview of your invoicing activity">
      {/* Hero Section */}

<div className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 lg:p-8 text-white shadow-xl">

  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

    <div>

      <p className="text-emerald-100 text-sm font-medium">
        👋 Welcome Back
      </p>

      <h1 className="text-3xl lg:text-4xl font-bold mt-2">
        BillNova Dashboard
      </h1>

      <p className="mt-3 text-emerald-50 max-w-xl leading-7">
        Manage invoices, monitor revenue and grow your business with
        India's modern GST billing solution.
      </p>

      <button
        onClick={() => onNavigate("create")}
        className="mt-6 bg-white text-emerald-700 font-semibold px-5 py-3 rounded-xl hover:bg-emerald-50 transition shadow-lg"
      >
        + Create Invoice
      </button>

    </div>

    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 min-w-[260px]">

      <p className="text-sm text-emerald-100">
        Total Revenue
      </p>

      <h2 className="text-4xl font-bold mt-2">
        {formatCurrency(stats.totalRevenue)}
      </h2>

      <div className="mt-6 flex justify-between">

        <div>

          <p className="text-xs text-emerald-100">
            Invoices
          </p>

          <p className="text-xl font-bold">
            {stats.totalInvoices}
          </p>

        </div>

        <div>

          <p className="text-xs text-emerald-100">
            Paid
          </p>

          <p className="text-xl font-bold">
            {stats.paidInvoices}
          </p>

        </div>

      </div>

      <p className="mt-5 text-xs text-emerald-100">
        Smart GST Billing Software
      </p>

    </div>

  </div>

</div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`bg-gradient-to-br ${card.bg} rounded-xl p-4 border border-white/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center mb-3`}>
                <Icon size={16} />
              </div>
              <p className="text-lg font-bold text-slate-800">{card.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-700">Recent Invoices</h2>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All
            </button>
          </div>
          {recentInvoices.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <FileText size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No invoices yet</p>
              <button
                onClick={() => onNavigate('create')}
                className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Create your first invoice
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentInvoices.map(inv => (
                <button
                  key={inv.id}
                  onClick={() => onNavigate('preview')}
                  className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700">{inv.invoiceNumber}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{inv.customer.name}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[inv.status]}`}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {formatCurrency(inv.calculations.grandTotal)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-3">
            <button
              onClick={() => onNavigate('create')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <FileEdit size={16} />
              Create New Invoice
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <Clock size={16} className="text-slate-400" />
              View All Invoices
            </button>
          </div>

          {/* Revenue Summary */}
          <div className="mx-4 mb-4 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg">
            <p className="text-xs text-slate-400 font-medium">Revenue This Month</p>
            <p className="text-2xl font-bold text-white mt-1">
              {formatCurrency(
                invoices
                  .filter(i => {
                    const d = new Date(i.invoiceDate);
                    const now = new Date();
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                  })
                  .reduce((sum, i) => sum + i.calculations.grandTotal, 0)
              )}
            </p>
          </div>

          <div className="mx-4 mb-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white shadow-lg">

  <h3 className="text-lg font-bold">
    Business Health
  </h3>

  <p className="text-emerald-100 text-sm mt-1">
    Excellent Performance 🚀
  </p>

  <div className="grid grid-cols-2 gap-4 mt-5">

    <div>
      <p className="text-xs text-emerald-100">
        Paid Rate
      </p>
      <h2 className="text-2xl font-bold">
        {stats.totalInvoices === 0
          ? "0%"
          : `${Math.round((stats.paidInvoices / stats.totalInvoices) * 100)}%`}
      </h2>
    </div>

    <div>
      <p className="text-xs text-emerald-100">
        Total Customers
      </p>
      <h2 className="text-2xl font-bold">
        {new Set(invoices.map(i => i.customer.name)).size}
      </h2>
    </div>

  </div>

</div>
        </div>
      </div>
    </Layout>
    
  );
  
}

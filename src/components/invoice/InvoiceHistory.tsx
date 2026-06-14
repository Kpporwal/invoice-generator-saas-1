import { useState, useMemo } from 'react';
import {
  Search,
  Eye,
  Edit3,
  Copy,
  Trash2,
  PlusCircle,
  FileText,
  SlidersHorizontal,
  Loader2,
} from 'lucide-react';
import { useInvoiceStore } from '../../store/InvoiceContext';
import { formatCurrency, formatDate } from '../../utils/calculations';
import type { Invoice } from '../../types';
import Layout from '../layout/Layout';

type Page = 'dashboard' | 'create' | 'history' | 'preview';

interface InvoiceHistoryProps {
  onNavigate: (page: Page) => void;
  onEdit: (invoice: Invoice) => void;
  onDuplicate: (invoice: Invoice) => void;
  onPreview: (invoice: Invoice) => void;
}

export default function InvoiceHistory({ onNavigate, onEdit, onDuplicate, onPreview }: InvoiceHistoryProps) {
  const { invoices, loading, deleteInvoice } = useInvoiceStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const customers = useMemo(() => {
    const names = new Set(invoices.map(i => i.customer.name));
    return Array.from(names).sort();
  }, [invoices]);

  const filtered = useMemo(() => {
    let result = [...invoices];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        i =>
          i.invoiceNumber.toLowerCase().includes(q) ||
          i.customer.name.toLowerCase().includes(q) ||
          i.company.name.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter(i => i.status === filterStatus);
    }

    if (filterDateFrom) {
      result = result.filter(i => i.invoiceDate >= filterDateFrom);
    }

    if (filterDateTo) {
      result = result.filter(i => i.invoiceDate <= filterDateTo);
    }

    if (filterCustomer !== 'all') {
      result = result.filter(i => i.customer.name === filterCustomer);
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [invoices, searchQuery, filterStatus, filterDateFrom, filterDateTo, filterCustomer]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setDeletingId(id);
      await deleteInvoice(id);
      setDeletingId(null);
    }
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-600',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-emerald-100 text-emerald-700',
    overdue: 'bg-red-100 text-red-700',
  };

  const inputClass = "px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white";

  return (
    <Layout title="Invoice History" subtitle={`${filtered.length} invoice${filtered.length !== 1 ? 's' : ''} found`}>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-slate-400" />
          <span className="ml-3 text-sm text-slate-500">Loading invoices...</span>
        </div>
      ) : (
      <>
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by invoice number, customer, or company..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={inputClass}>
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg transition-colors ${
                showFilters ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
            <button
              onClick={() => onNavigate('create')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <PlusCircle size={14} />
              New
            </button>
          </div>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Date From</label>
              <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} className={inputClass + ' w-full'} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Date To</label>
              <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} className={inputClass + ' w-full'} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Customer</label>
              <select value={filterCustomer} onChange={e => setFilterCustomer(e.target.value)} className={inputClass + ' w-full'}>
                <option value="all">All Customers</option>
                {customers.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Invoice List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-16 text-center">
          <FileText size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            {invoices.length === 0 ? 'No invoices yet' : 'No invoices match your filters'}
          </p>
          {invoices.length === 0 && (
            <button onClick={() => onNavigate('create')} className="mt-3 text-sm text-emerald-600 font-medium hover:text-emerald-700">
              Create your first invoice
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inv => (
            <div
              key={inv.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Desktop Row */}
              <div className="hidden md:flex items-center px-5 py-4 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-slate-800">{inv.invoiceNumber}</p>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[inv.status]}`}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{inv.customer.name} &middot; {formatDate(inv.invoiceDate)}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-base font-bold text-slate-800">{formatCurrency(inv.calculations.grandTotal)}</p>
                  <p className="text-[11px] text-slate-500">Due: {formatDate(inv.dueDate)}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => onPreview(inv)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Preview">
                    <Eye size={16} />
                  </button>
                  <button onClick={() => onEdit(inv)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => onDuplicate(inv)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Duplicate">
                    <Copy size={16} />
                  </button>
                  <button onClick={() => handleDelete(inv.id)} disabled={deletingId === inv.id} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Delete">
                    {deletingId === inv.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>

              {/* Mobile Card */}
              <div className="md:hidden px-4 py-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-800">{inv.invoiceNumber}</p>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[inv.status]}`}>
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">{inv.customer.name}</p>
                  <p className="text-sm font-bold text-slate-800">{formatCurrency(inv.calculations.grandTotal)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">{formatDate(inv.invoiceDate)} &middot; Due: {formatDate(inv.dueDate)}</p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onPreview(inv)} className="p-1.5 text-slate-400 hover:text-emerald-600 rounded transition-colors">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => onEdit(inv)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => onDuplicate(inv)} className="p-1.5 text-slate-400 hover:text-amber-600 rounded transition-colors">
                      <Copy size={14} />
                    </button>
                    <button onClick={() => handleDelete(inv.id)} disabled={deletingId === inv.id} className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors disabled:opacity-50">
                      {deletingId === inv.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </>
      )}
    </Layout>
  );
}

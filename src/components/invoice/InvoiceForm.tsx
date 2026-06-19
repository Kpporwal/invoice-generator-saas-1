import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Save, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useInvoiceStore } from '../../store/InvoiceContext';
import { calculateInvoice, generateInvoiceNumber, formatCurrency, calculateItemAmount } from '../../utils/calculations';
import type { Invoice, InvoiceItem, Company, Customer } from '../../types';
import Layout from '../layout/Layout';

type Page = 'dashboard' | 'create' | 'history' | 'preview';

interface InvoiceFormProps {
  onNavigate: (page: Page) => void;
  onPreview: (invoice: Invoice) => void;
  editingInvoice?: Invoice | null;
  duplicatingInvoice?: Invoice | null;
}

const emptyCompany: Company = {
  name: 'BillNova by Kapil Tech Solutions',
  address: 'Kota, Rajasthan',
  gstNumber: '08ABCDE1234F1Z5',
  logo: '/logo.png'
};
const emptyCustomer: Customer = {
  name: '',
  address: '',
  gstNumber: '',
  whatsappNumber: '',
};
const emptyItem: InvoiceItem = { id: '', name: '', description: '', quantity: 1, rate: 0, gstPercent: 18 };

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function InvoiceForm({ onNavigate, onPreview, editingInvoice, duplicatingInvoice }: InvoiceFormProps) {
  const { invoices, addInvoice, updateInvoice } = useInvoiceStore();
  const source = editingInvoice || duplicatingInvoice;
  const isEditing = !!editingInvoice && !duplicatingInvoice;

  const [company] = useState<Company>(source?.company ?? emptyCompany);
  const [customer, setCustomer] = useState<Customer>(source?.customer ?? emptyCustomer);
  const [items, setItems] = useState<InvoiceItem[]>(source?.items ?? [{ ...emptyItem, id: generateId() }]);
  const [invoiceDate, setInvoiceDate] = useState(source?.invoiceDate ?? new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(source?.dueDate ?? new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber] = useState(source?.invoiceNumber ?? '');
  const [status, setStatus] = useState<Invoice['status']>(source?.status ?? 'draft');
  const [notes, setNotes] = useState(source?.notes ?? '');
  const [terms, setTerms] = useState(source?.termsAndConditions ?? 'Payment is due within 30 days of the invoice date.');
  const [upiId,] = useState('8000060853-2@ybl');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!source) {
      setInvoiceNumber(generateInvoiceNumber(invoices));
    }
  }, [source, invoices]);

  const calculations = calculateInvoice(items);

  const addItem = () => {
  setItems(prev => [
    ...prev,
    {
      ...emptyItem,
      id: generateId(),
    },
  ]);
};
  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateItem = useCallback((id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  }, []);

  const handleSubmit = async () => {
    if (!company.name || !customer.name || items.length === 0) return;
    setSaving(true);
    setSaveError(null);

    const invoice: Invoice = {
      id: editingInvoice?.id ?? generateId(),
      invoiceNumber,
      company,
      customer,
      items,
      calculations,
      invoiceDate,
      dueDate,
      notes,
      termsAndConditions: terms,
      upiId,
      status,
      createdAt: editingInvoice?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = isEditing
      ? await updateInvoice(invoice)
      : await addInvoice(invoice);

    if (result.error) {
      setSaveError(result.error);
      setSaving(false);
    } else {
      onPreview(invoice);
    }
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5";

  return (
    <Layout
      title={isEditing ? 'Edit Invoice' : duplicatingInvoice ? 'Duplicate Invoice' : 'Create Invoice'}
      subtitle={isEditing ? `Editing ${invoiceNumber}` : 'Fill in the details below'}
    >
      <div className="space-y-6">

        {/* Error Banner */}
        {saveError && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <AlertCircle size={16} className="shrink-0" />
            <span>Failed to save: {saveError}</span>
          </div>
        )}

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1" />
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isEditing ? 'Update Invoice' : 'Save Invoice'}
          </button>
        </div>

        {/* Invoice Meta */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Invoice Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Invoice Number</label>
              <input type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Invoice Date</label>
              <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as Invoice['status'])} className={inputClass}>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

       <div className="grid lg:grid-cols-1 gap-6">      
               
          {/* Customer Details */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Customer Details</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Customer Name</label>
                <input type="text" value={customer.name} onChange={e => setCustomer(prev => ({ ...prev, name: e.target.value }))} className={inputClass} placeholder="Customer Name" />
              </div>
              <div>
                <label className={labelClass}>Customer Address</label>
                <textarea value={customer.address} onChange={e => setCustomer(prev => ({ ...prev, address: e.target.value }))} className={inputClass} rows={2} placeholder="Full address" />
              </div>
              <div>
                <label className={labelClass}>Customer GST Number (Optional)</label>
                <input type="text" value={customer.gstNumber} onChange={e => setCustomer(prev => ({ ...prev, gstNumber: e.target.value }))} className={inputClass} placeholder="22BBBBB0000B1Z5" />
                <div>
                  <br></br>
  <label className={labelClass}>Customer WhatsApp Number (Optional)</label>

  <input
    type="tel"
    value={customer.whatsappNumber}
    onChange={(e) =>
      setCustomer((prev) => ({
        ...prev,
        whatsappNumber: e.target.value,
      }))
    }
    className={inputClass}
    placeholder="9876543210"
  />

  <p className="text-xs text-slate-500 mt-1">
    Enter 10-digit WhatsApp number
  </p>
</div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Items / Services</h3>
            <button onClick={addItem} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
              <Plus size={14} />
              Add Item
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2.5 px-2 text-xs font-semibold text-slate-500 w-5">#</th>
                  <th className="text-left py-2.5 px-2 text-xs font-semibold text-slate-500">Item Name</th>
                  <th className="text-left py-2.5 px-2 text-xs font-semibold text-slate-500">Description</th>
                  <th className="text-right py-2.5 px-2 text-xs font-semibold text-slate-500 w-20">Qty</th>
                  <th className="text-right py-2.5 px-2 text-xs font-semibold text-slate-500 w-28">Rate</th>
                  <th className="text-right py-2.5 px-2 text-xs font-semibold text-slate-500 w-20">GST %</th>
                  <th className="text-right py-2.5 px-2 text-xs font-semibold text-slate-500 w-28">Amount</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-2 px-2 text-xs text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-2">
                      <input type="text" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Item name" />
                    </td>
                    <td className="py-2 px-2">
                      <input type="text" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Description" />
                    </td>
                    <td className="py-2 px-2">
                      <input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))} className="w-full px-2 py-1 text-sm border border-slate-200 rounded text-right focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500" min="1" />
                    </td>
                    <td className="py-2 px-2">
                      <input type="number" value={item.rate} onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} className="w-full px-2 py-1 text-sm border border-slate-200 rounded text-right focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500" min="0" step="0.01" />
                    </td>
                    <td className="py-2 px-2">
                      <select value={item.gstPercent} onChange={e => updateItem(item.id, 'gstPercent', Number(e.target.value))} className="w-full px-2 py-1 text-sm border border-slate-200 rounded text-right focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500">
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18%</option>
                        <option value={28}>28%</option>
                      </select>
                    </td>
                    <td className="py-2 px-2 text-right font-medium text-slate-700">{formatCurrency(calculateItemAmount(item))}</td>
                    <td className="py-2 px-2">
                      <button onClick={() => removeItem(item.id)} disabled={items.length <= 1} className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Items */}
          <div className="md:hidden space-y-3">
            {items.map((item, idx) => (
              <div key={item.id} className="p-3 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Item {idx + 1}</span>
                  <button onClick={() => removeItem(item.id)} disabled={items.length <= 1} className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30">
                    <Trash2 size={14} />
                  </button>
                </div>
                <input type="text" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Item name" />
                <input type="text" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Description" />
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))} className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Qty" min="1" />
                  <input type="number" value={item.rate} onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Rate" min="0" step="0.01" />
                  <select value={item.gstPercent} onChange={e => updateItem(item.id, 'gstPercent', Number(e.target.value))} className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
                <p className="text-xs text-right font-medium text-slate-600">Amount: {formatCurrency(calculateItemAmount(item))}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 flex justify-end">
            <div className="w-full md:w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-700">{formatCurrency(calculations.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">GST Total</span>
                <span className="font-medium text-slate-700">{formatCurrency(calculations.gstTotal)}</span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-800">Grand Total</span>
                <span className="font-bold text-slate-800">{formatCurrency(calculations.grandTotal)}</span>
              </div>
              <p className="text-xs text-slate-500 italic">{calculations.amountInWords}</p>
            </div>
          </div>
        </div>

        {/* Notes, Terms, UPI */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Notes</h3>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} rows={4} placeholder="Additional notes..." />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Terms & Conditions</h3>
            <textarea value={terms} onChange={e => setTerms(e.target.value)} className={inputClass} rows={4} placeholder="Terms and conditions..." />
          </div>
         
        </div>
        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <button onClick={() => onNavigate('dashboard')} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors">
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isEditing ? 'Update Invoice' : 'Save Invoice'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

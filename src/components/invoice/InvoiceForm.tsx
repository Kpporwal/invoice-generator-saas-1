import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Save, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useInvoiceStore } from '../../store/InvoiceContext';
import { calculateInvoice, generateInvoiceNumber, formatCurrency, calculateItemAmount } from '../../utils/calculations';
import type { Invoice, InvoiceItem, Company, Customer } from '../../types';
import Layout from '../layout/Layout';
import { useAuth } from "../../store/AuthContext";
import { getBusinessProfile } from "../../lib/businessProfile";
import {
  getCustomers,
  addCustomer,
  updateCustomer,
} from "../../lib/customers";
import { addLedgerEntry } from "../../lib/customerLedger";


type Page =
  | 'dashboard'
  | 'create'
  | 'history'
  | 'preview'
  | 'reports'
  | 'customers'
  | 'business-profile'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'contact';

interface InvoiceFormProps {
  onNavigate: (page: Page) => void;
  onPreview: (invoice: Invoice) => void;
  editingInvoice?: Invoice | null;
  duplicatingInvoice?: Invoice | null;
}

const emptyCompany: Company = {
  name: "",
  address: "",
  gstNumber: "",

  phone: "",
  email: "",
  website: "",
  upiId: "",

  logo: null,
  signature: null,
};
const emptyCustomer: Customer = {
  name: '',
  address: '',
  gstNumber: '',
  whatsappNumber: '',
};
const emptyItem: InvoiceItem = {
  id: '',
  name: '',
  description: '',
  quantity: 1,
  rate: 0,
  gstPercent: 18,
  discount: 0,
};

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function InvoiceForm({ onNavigate, onPreview, editingInvoice, duplicatingInvoice }: InvoiceFormProps) {
  const { invoices, addInvoice, updateInvoice } = useInvoiceStore();
  const source = editingInvoice || duplicatingInvoice;
  const isEditing = !!editingInvoice && !duplicatingInvoice;
  const { user } = useAuth();

  const [company, setCompany] = useState<Company>(
  source?.company ?? emptyCompany
);
  const [customer, setCustomer] = useState<Customer>(source?.customer ?? emptyCustomer);
  const [items, setItems] = useState<InvoiceItem[]>(source?.items ?? [{ ...emptyItem, id: generateId() }]);
  const [invoiceDate, setInvoiceDate] = useState(source?.invoiceDate ?? new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(source?.dueDate ?? new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber] = useState(source?.invoiceNumber ?? '');
  const [status, setStatus] = useState<Invoice['status']>(source?.status ?? 'draft');
  const [notes, setNotes] = useState(source?.notes ?? '');
  const [terms, setTerms] = useState(source?.termsAndConditions ?? 'Payment is due within 30 days of the invoice date.');
  const [upiId, setUpiId] = useState("");
  const [saving, setSaving] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
  "credit" | "paid" | "partial"
>("credit");

const [amountPaid, setAmountPaid] = useState(0);

const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!source) {
      setInvoiceNumber(generateInvoiceNumber(invoices));
    }
  }, [source, invoices]);
  useEffect(() => {
  if (source || !user) return;

  async function loadBusiness() {
    const { data, error } = await getBusinessProfile(user!.id);

    if (error || !data) return;

    setCompany({
  name: data.company_name || "",
  address: data.address || "",
  gstNumber: data.gst_number || "",

  phone: data.phone || "",
  email: data.email || "",
  website: data.website || "",
  upiId: data.upi_id || "",

  logo: data.logo_url || "",
  signature: data.signature_url || "",
});
setUpiId(data.upi_id || "");
  }


  loadBusiness();
}, [user, source]);

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
  if (!company.name || !customer.name || items.length === 0) {
    setSaveError("Company, customer and at least one item are required.");
    return;
  }

  if (!user) {
    setSaveError("Please login before saving invoice.");
    return;
  }

  const invoiceTotal = Number(calculations.grandTotal || 0);

  let receivedAmount = 0;

  if (paymentStatus === "paid") {
    receivedAmount = invoiceTotal;
  }

  if (paymentStatus === "partial") {
    receivedAmount = Number(amountPaid || 0);

    if (receivedAmount <= 0) {
      setSaveError("Enter a valid received amount.");
      return;
    }

    if (receivedAmount >= invoiceTotal) {
      setSaveError(
        "Partial payment must be less than invoice total. Use Full Payment instead."
      );
      return;
    }
  }

  const dueAmount = Math.max(0, invoiceTotal - receivedAmount);

  setSaving(true);
  setSaveError(null);

  try {
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

paymentStatus,
amountPaid: receivedAmount,
balanceDue: dueAmount,
paymentMethod:
  receivedAmount > 0 ? paymentMethod : null,

createdAt:
  editingInvoice?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = isEditing
      ? await updateInvoice(invoice)
      : await addInvoice(invoice);

    if (result.error) {
      setSaveError(result.error);
      return;
    }

    // Customer + Ledger update only for NEW invoices.
    // Invoice edit adjustment baad me handle karenge.
    if (!isEditing) {
      const { data: customersData, error: customersError } =
        await getCustomers(user.id);

      if (customersError) {
        console.error("Customer load error:", customersError);
      } else {
       
const normalize = (value: string | undefined | null) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

console.log("Invoice customer:", customer);
console.log("Saved customers:", customersData);

const matchedCustomer = customersData?.find((savedCustomer) => {
  const sameName =
    normalize(savedCustomer.customer_name) === normalize(customer.name);

  return sameName;
});
        if (matchedCustomer?.id) {
          const currentPurchase = Number(
            matchedCustomer.total_purchase || 0
          );

          const currentOutstanding = Number(
            matchedCustomer.outstanding || 0
          );

          const currentTotalPaid = Number(
            matchedCustomer.total_paid || 0
          );

          // Purchase always increases by full invoice total.
          // Outstanding increases only by unpaid amount.
          // Total paid increases by amount received now.
          const { error: updateError } = await updateCustomer(
  matchedCustomer.id,
  {
    total_purchase: currentPurchase + invoiceTotal,
    outstanding: currentOutstanding + dueAmount,
    total_paid: currentTotalPaid + receivedAmount,

    last_invoice_number: invoiceNumber,
    last_invoice_date: invoiceDate,
    last_invoice_due_date: dueDate,

    ...(receivedAmount > 0
      ? {
          last_payment_date: new Date().toISOString(),
        }
      : {}),
  }
);
          if (updateError) {
            console.error(
              "Customer update error:",
              updateError
            );
          } else {
            // Full invoice amount ledger entry.
            const { error: invoiceLedgerError } =
              await addLedgerEntry({
                user_id: user.id,
                customer_id: matchedCustomer.id,
                entry_type: "invoice",
                amount: invoiceTotal,
                description: `Invoice ${invoiceNumber}`,
                invoice_id: invoice.id,
                payment_method: null,
              });

            if (invoiceLedgerError) {
              console.error(
                "Invoice ledger error:",
                invoiceLedgerError
              );
            }

            // Paid / Partial invoice par payment entry.
            if (receivedAmount > 0) {
              const { error: paymentLedgerError } =
                await addLedgerEntry({
                  user_id: user.id,
                  customer_id: matchedCustomer.id,
                  entry_type: "payment",
                  amount: receivedAmount,
                  description: `Payment received against Invoice ${invoiceNumber}`,
                  invoice_id: invoice.id,
                  payment_method: paymentMethod,
                });

              if (paymentLedgerError) {
                console.error(
                  "Payment ledger error:",
                  paymentLedgerError
                );
              }
            }
          }
        } else {
  // Customer pehle se nahi mila, to invoice customer se new customer create karo.
  const { data: newCustomer, error: createCustomerError } =

await addCustomer({
  user_id: user.id,

  customer_name: customer.name.trim(),

  phone: customer.whatsappNumber?.trim() || "",

  address: customer.address || "",

  gst_number: customer.gstNumber?.trim() || null,

  opening_balance: 0,

  total_purchase: invoiceTotal,

  total_paid: receivedAmount,

  outstanding: dueAmount,

  last_purchase_date: new Date().toISOString(),

  last_invoice_number: invoiceNumber,

  last_invoice_date: invoiceDate,

  last_invoice_due_date: dueDate,

  last_payment_date:
    receivedAmount > 0
      ? new Date().toISOString()
      : null,
});
  if (createCustomerError) {
    console.error(
      "New customer create error:",
      createCustomerError
    );
  } else if (newCustomer?.id) {
    // Full invoice ledger entry
    const { error: invoiceLedgerError } =
      await addLedgerEntry({
        user_id: user.id,
        customer_id: newCustomer.id,
        entry_type: "invoice",
        amount: invoiceTotal,
        description: `Invoice ${invoiceNumber}`,
        invoice_id: invoice.id,
        payment_method: null,
      });

    if (invoiceLedgerError) {
      console.error(
        "New customer invoice ledger error:",
        invoiceLedgerError
      );
    }

    // Agar invoice banate time payment mila hai,
    // to payment ledger entry bhi create hogi.
    if (receivedAmount > 0) {
      const { error: paymentLedgerError } =
        await addLedgerEntry({
          user_id: user.id,
          customer_id: newCustomer.id,
          entry_type: "payment",
          amount: receivedAmount,
          description: `Payment received against Invoice ${invoiceNumber}`,
          invoice_id: invoice.id,
          payment_method: paymentMethod,
        });

      if (paymentLedgerError) {
        console.error(
          "New customer payment ledger error:",
          paymentLedgerError
        );
      }
    }
  }
}
      }
    }

    onPreview(invoice);
  } catch (error) {
    console.error("Invoice save error:", error);
    setSaveError("Something went wrong while saving invoice.");
  } finally {
    setSaving(false);
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
                  <th className="text-right py-2.5 px-2 text-xs font-semibold text-slate-500 w-24">
  Discount
</th>
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
  <input
    type="number"
    value={item.discount}
    onChange={(e) =>
      updateItem(item.id, "discount", Number(e.target.value))
    }
    min="0"
    max={item.quantity * item.rate}
    step="0.01"
    className="w-full px-2 py-1 text-sm border border-slate-200 rounded text-right focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500"
  />
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
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))} className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Qty" min="1" />
                  <input type="number" value={item.rate} onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Rate" min="0" step="0.01" />
                 <input
  type="number"
  value={item.discount}
  onChange={(e) =>
    updateItem(item.id, "discount", Number(e.target.value))
  }
  className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
  placeholder="Discount ₹"
  min="0"
  max={item.quantity * item.rate}
  step="0.01"
/>
                 
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
              {calculations.discountTotal > 0 && (
  <div className="flex justify-between text-sm">
    <span className="text-slate-500">Discount</span>

    <span className="font-medium text-red-600">
      -{formatCurrency(calculations.discountTotal)}
    </span>
  </div>
)}
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

         {/* Payment Status */}

<div className="rounded-xl border bg-slate-50 p-5 space-y-4">
  <div>
    <h3 className="text-sm font-semibold text-slate-800">
      Payment Status
    </h3>

    <p className="text-xs text-slate-500 mt-1">
      Select how the customer is paying this invoice.
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <button
      type="button"
      onClick={() => {
        setPaymentStatus("credit");
        setAmountPaid(0);
      }}
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${
        paymentStatus === "credit"
          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
          : "bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      Credit / Udhar
    </button>

    <button
      type="button"
      onClick={() => {
        setPaymentStatus("paid");
        setAmountPaid(Number(calculations.grandTotal || 0));
      }}
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${
        paymentStatus === "paid"
          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
          : "bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      Full Payment
    </button>

    <button
      type="button"
      onClick={() => {
        setPaymentStatus("partial");
        setAmountPaid(0);
      }}
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${
        paymentStatus === "partial"
          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
          : "bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      Partial Payment
    </button>
  </div>

  {paymentStatus === "partial" && (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Amount Received
      </label>

      <input
        type="number"
        min="0"
        max={Number(calculations.grandTotal || 0)}
        value={amountPaid}
        onChange={(e) => setAmountPaid(Number(e.target.value))}
        placeholder="Enter received amount"
        className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  )}

  {paymentStatus !== "credit" && (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Payment Method
      </label>

      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <option value="Cash">Cash</option>
        <option value="UPI">UPI</option>
        <option value="Bank Transfer">Bank Transfer</option>
        <option value="Card">Card</option>
        <option value="Cheque">Cheque</option>
      </select>
    </div>
  )}

  <div className="flex justify-between border-t pt-4 text-sm">
    <span className="text-slate-500">
      Amount Due After Invoice
    </span>

    <span className="font-bold text-red-600">
      ₹
      {Math.max(
        0,
        Number(calculations.grandTotal || 0) -
          Number(amountPaid || 0)
      ).toLocaleString("en-IN")}
    </span>
  </div>
</div>

{/* Bottom Actions */}

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

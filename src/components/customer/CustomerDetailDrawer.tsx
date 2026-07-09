import { X, Phone, MapPin, ReceiptText, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import type { Customer } from "../../types/customers";
import { getCustomerLedger } from "../../lib/customerLedger";
import ReceivePaymentModal from "./ReceivePaymentModal";

interface CustomerDetailDrawerProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onPaymentReceived: () => Promise<void>;
}

interface LedgerEntry {
  id: string;
  user_id: string;
  customer_id: string;
  entry_type: "opening_balance" | "invoice" | "payment" | "adjustment";
  amount: number;
  description: string | null;
  invoice_id: string | null;
  payment_method: string | null;
  entry_date: string;
  created_at: string;
}
export default function CustomerDetailDrawer({
  open,
  customer,
  onClose,
  onPaymentReceived,
}: CustomerDetailDrawerProps) {
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (open && customer) {
      loadLedger();
    }
  }, [open, customer]);

  async function loadLedger() {
    if (!customer) return;

    setLedgerLoading(true);

    const { data, error } = await getCustomerLedger(customer.id!);

    if (error) {
      console.error("Ledger loading error:", error);
      setLedgerEntries([]);
    } else {
      setLedgerEntries((data || []) as LedgerEntry[]);
    }

    setLedgerLoading(false);
  }

  if (!open || !customer) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-2xl flex-col bg-slate-50 shadow-2xl">
        <div className="flex items-center justify-between border-b bg-white px-6 py-5">
          <div>
            <p className="text-sm font-medium text-emerald-600">
              Customer Account
            </p>

            <h2 className="text-2xl font-bold text-slate-800">
              {customer.customer_name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-slate-500">
                <ReceiptText size={18} />
                Total Purchase
              </div>

              <p className="text-2xl font-bold text-slate-800">
                ₹{Number(customer.total_purchase || 0).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-slate-500">
                <Wallet size={18} />
                Outstanding Due
              </div>

              <p className="text-2xl font-bold text-red-600">
                ₹{Number(customer.outstanding || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-800">
              Customer Information
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <Phone size={17} />
                <span>{customer.phone || "No phone number"}</span>
              </div>

              <div className="flex items-start gap-3 text-slate-600">
                <MapPin size={17} className="mt-0.5" />
                <span>{customer.address || "No address added"}</span>
              </div>

              {customer.gst_number && (
                <div className="text-slate-600">
                  GST: {customer.gst_number}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-5">
              <h3 className="font-semibold text-slate-800">
                Customer Ledger
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Purchases, due entries and payments will appear here.
              </p>
            </div>

            <div>
  {ledgerLoading ? (
    <div className="py-14 text-center text-slate-400">
      Loading ledger...
    </div>
  ) : ledgerEntries.length === 0 ? (
    <div className="py-14 text-center text-slate-400">
      No ledger entries yet
    </div>
  ) : (
    <div className="divide-y">
      {ledgerEntries.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center justify-between gap-4 p-5"
        >
          <div>
            <p className="font-semibold capitalize text-slate-800">
              {entry.entry_type.replace("_", " ")}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
  <p className="text-sm text-slate-500">
    {entry.description || "Ledger transaction"}
  </p>

  {entry.entry_type === "payment" && entry.payment_method && (
    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      {entry.payment_method}
    </span>
  )}
</div>

<p className="mt-1 text-xs text-slate-400">
  {new Date(entry.entry_date).toLocaleString("en-IN")}
</p>
          </div>

          <p
            className={`font-bold ${
              entry.entry_type === "payment"
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            {entry.entry_type === "payment" ? "- " : "+ "}
            ₹{Number(entry.amount || 0).toLocaleString("en-IN")}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t bg-white p-5">
          <button className="rounded-xl border px-5 py-3 font-medium hover:bg-slate-50">
            Create Invoice
          </button>

          <button
  onClick={() => setPaymentModalOpen(true)}
  className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
>
  Receive Payment
</button>

        </div>
      </div>
     <ReceivePaymentModal
  open={paymentModalOpen}
  customer={customer}
  onClose={() => setPaymentModalOpen(false)}
  onPaymentReceived={async () => {
    await loadLedger();
    await onPaymentReceived();
  }}
/>
    </>
  );
}
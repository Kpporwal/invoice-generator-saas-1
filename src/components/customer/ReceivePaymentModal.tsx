import { X, IndianRupee } from "lucide-react";
import { useState } from "react";
import type { Customer } from "../../types/customers";
import { useAuth } from "../../store/AuthContext";
import { addLedgerEntry } from "../../lib/customerLedger";
import { updateCustomer } from "../../lib/customers";

interface ReceivePaymentModalProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onPaymentReceived: () => Promise<void>;
}

export default function ReceivePaymentModal({
  open,
  customer,
  onClose,
  onPaymentReceived,
}: ReceivePaymentModalProps) {
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [notes, setNotes] = useState("");
  const { user } = useAuth();
const [saving, setSaving] = useState(false);

const handleSavePayment = async () => {
  if (!user || !customer || !customer.id) return;

  if (amount <= 0) {
    alert("Enter a valid payment amount");
    return;
  }

  const currentOutstanding = Number(customer.outstanding || 0);

  if (amount > currentOutstanding) {
    alert("Payment amount cannot be greater than outstanding due");
    return;
  }

  try {
    setSaving(true);

    const { error: ledgerError } = await addLedgerEntry({
      user_id: user.id,
      customer_id: customer.id,
      entry_type: "payment",
      amount,
      description: notes.trim() || "Payment received",
      payment_method: paymentMethod,
    });

    if (ledgerError) {
      alert(ledgerError.message);
      return;
    }

    const newOutstanding = currentOutstanding - amount;

    const { error: customerError } = await updateCustomer(customer.id, {
      outstanding: newOutstanding,
      total_paid: Number(customer.total_paid || 0) + amount,
      last_payment_date: new Date().toISOString(),
    });

    if (customerError) {
      alert(customerError.message);
      return;
    }

    await onPaymentReceived();

    setAmount(0);
    setPaymentMethod("Cash");
    setNotes("");

    onClose();
  } catch (error) {
    console.error("Payment save error:", error);
    alert("Something went wrong while saving payment");
  } finally {
    setSaving(false);
  }
};

  if (!open || !customer) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/40"
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 z-[70] w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Receive Payment
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Payment from {customer.customer_name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="rounded-xl bg-red-50 p-4">
            <p className="text-sm text-slate-500">
              Current Outstanding
            </p>

            <p className="mt-1 text-xl font-bold text-red-600">
              ₹{Number(customer.outstanding || 0).toLocaleString("en-IN")}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Payment Amount *
            </label>

            <div className="relative">
              <IndianRupee
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl border py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Card</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Notes
            </label>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional payment notes..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t p-5">
          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-3 font-medium hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
  onClick={handleSavePayment}
  disabled={saving}
  className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
>
  {saving ? "Saving..." : "Save Payment"}
</button>
        </div>
      </div>
    </>
  );
}
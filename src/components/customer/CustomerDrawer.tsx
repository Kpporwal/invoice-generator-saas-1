import { X, User, Phone, MapPin, FileText, IndianRupee } from "lucide-react"
import { useAuth } from "../../store/AuthContext";
import type { Customer } from "../../types/customers";
import { useEffect, useState } from "react";
import { addCustomer, updateCustomer } from "../../lib/customers";
interface CustomerDrawerProps {
  open: boolean;
  onClose: () => void;
  onCustomerAdded: () => void | Promise<void>;
  editingCustomer: Customer | null;
}

export default function CustomerDrawer({
  open,
  onClose,
  onCustomerAdded,
  editingCustomer,
}: CustomerDrawerProps) {

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [openingBalance, setOpeningBalance] = useState(0);
  const [notes, setNotes] = useState("");
  const { user } = useAuth();
const [loading, setLoading] = useState(false);
useEffect(() => {
  if (!open) return;

  if (editingCustomer) {
    setCustomerName(editingCustomer.customer_name ?? "");
    setPhone(editingCustomer.phone ?? "");
    setAddress(editingCustomer.address ?? "");
    setGstNumber(editingCustomer.gst_number ?? "");
    setOpeningBalance(
      Number(
        editingCustomer.opening_balance ??
        editingCustomer.outstanding ??
        0
      )
    );
    setNotes(editingCustomer.notes ?? "");
  } else {
    setCustomerName("");
    setPhone("");
    setAddress("");
    setGstNumber("");
    setOpeningBalance(0);
    setNotes("");
  }
}, [open, editingCustomer]);

const handleSave = async () => {
  if (!customerName.trim()) {
    alert("Customer name is required");
    return;
  }

  if (!user) return;

  try {
    setLoading(true);

    const customerData = {
      customer_name: customerName.trim(),
      phone,
      address,
      gst_number: gstNumber,
      opening_balance: openingBalance,
      outstanding: openingBalance,
      notes,
    };

    let error;
if (editingCustomer) {
  if (!editingCustomer.id) {
    alert("Customer ID not found");
    return;
  }

  const result = await updateCustomer(
    editingCustomer.id,
    customerData
  );

  error = result.error;
}
     else {
      // ADD MODE
      const result = await addCustomer({
        ...customerData,
        user_id: user.id,
        total_purchase: 0,
        total_paid: 0,
      });

      error = result.error;
    }

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      editingCustomer
        ? "Customer Updated Successfully"
        : "Customer Added Successfully"
    );

    await onCustomerAdded();

    onClose();

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};
  if (!open) return null;

  return (
    <>
      {/* Background */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-screen w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div>
           {editingCustomer ? "Edit Customer" : "Add Customer"}

            <p className="text-sm text-slate-500 mt-1">
              Customer Ledger & Due Management
            </p>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100"
          >
            <X size={22} />
          </button>

        </div>

        {/* Form */}

        <div className="flex-1 overflow-y-auto p-6 space-y-5">

                      {/* Customer Name */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Customer Name *
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="w-full rounded-xl border pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Phone */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Mobile Number
            </label>

            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full rounded-xl border pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Address */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Address
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Customer address"
                className="w-full rounded-xl border pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* GST */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              GST Number
            </label>

            <input
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Opening Balance */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Opening Due Amount
            </label>

            <div className="relative">
              <IndianRupee
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                type="number"
                value={openingBalance}
                onChange={(e) =>
                  setOpeningBalance(Number(e.target.value))
                }
                className="w-full rounded-xl border pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Notes */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Notes
            </label>

            <div className="relative">
              <FileText
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes..."
                className="w-full rounded-xl border pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>        </div>

        {/* Footer */}

        <div className="border-t bg-white p-5 flex items-center justify-end gap-3">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border hover:bg-gray-100 transition"
          >
            Cancel
          </button>

         <button
  onClick={handleSave}
  disabled={loading}
  className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
>
 {loading
  ? "Saving..."
  : editingCustomer
  ? "Update Customer"
  : "Save Customer"}
</button>

        </div>

      </div>
    </>
  );
}
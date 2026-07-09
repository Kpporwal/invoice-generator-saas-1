import type { Customer } from "../../types/customers";
import { useEffect, useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Phone,
  MapPin,
} from "lucide-react";

interface CustomerTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export default function CustomerTable({
  customers,
  onView,
  onEdit,
  onDelete,
}: CustomerTableProps) {

const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkScreen = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkScreen();

  window.addEventListener("resize", checkScreen);

  return () => window.removeEventListener("resize", checkScreen);
}, []);

 if (isMobile) {
  return (
  <div className="space-y-4">
    {customers.length === 0 ? (
      <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
        No customers found.
      </div>
    ) : (
      customers.map((customer) => (
        <div
          key={customer.id}
          className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">

  <div className="flex items-center gap-3">

    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow">
      {customer.customer_name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()}
    </div>

    <div>
      <h3 className="font-semibold text-lg">
        {customer.customer_name}
      </h3>

      <p className="text-xs text-slate-500">
        {customer.phone || "No phone"}
      </p>
    </div>

  </div>

  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      customer.outstanding > 0
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700"
    }`}
  >
    ₹{customer.outstanding.toLocaleString("en-IN")}
  </span>

</div>

          {/* Details */}
          <div className="mt-4 space-y-3 text-sm">

            {customer.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
            )}

            
            {customer.address && (
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <span>{customer.address}</span>
              </div>
            )}

           <div className="mt-4 grid grid-cols-2 gap-3">

  <div className="rounded-xl bg-slate-50 p-3">
    <p className="text-xs text-slate-500">
      Purchase
    </p>

    <p className="mt-1 font-bold text-slate-800">
      ₹{customer.total_purchase.toLocaleString("en-IN")}
    </p>
  </div>

  <div className="rounded-xl bg-emerald-50 p-3">
    <p className="text-xs text-emerald-600">
      Paid
    </p>

    <p className="mt-1 font-bold text-emerald-700">
      ₹{customer.total_paid.toLocaleString("en-IN")}
    </p>
  </div>

  <div className="rounded-xl bg-blue-50 p-3">
    <p className="text-xs text-blue-600">
      Opening
    </p>

    <p className="mt-1 font-bold text-blue-700">
      ₹{customer.opening_balance.toLocaleString("en-IN")}
    </p>
  </div>

  <div
    className={`rounded-xl p-3 ${
      customer.outstanding > 0
        ? "bg-red-50"
        : "bg-green-50"
    }`}
  >
    <p
      className={`text-xs ${
        customer.outstanding > 0
          ? "text-red-600"
          : "text-green-600"
      }`}
    >
      Outstanding
    </p>

    <p
      className={`mt-1 font-bold ${
        customer.outstanding > 0
          ? "text-red-700"
          : "text-green-700"
      }`}
    >
      ₹{customer.outstanding.toLocaleString("en-IN")}
    </p>
  </div>

</div>
          </div>

          <div className="mt-4 rounded-xl border bg-slate-50 p-3">

  <div className="flex items-center justify-between">
    <span className="text-xs text-slate-500">
      Last Invoice
    </span>

    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${
        customer.outstanding > 0
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {customer.outstanding > 0 ? "Due" : "Paid"}
    </span>
  </div>

  <div className="mt-2">

    <p className="font-semibold text-slate-800">
      {customer.last_invoice_number || "No Invoice"}
    </p>

    {customer.last_invoice_date && (
      <p className="text-xs text-slate-500 mt-1">
        {new Date(customer.last_invoice_date).toLocaleDateString("en-IN")}
      </p>
    )}

  </div>

</div>

          {/* Actions */}
          <div className="mt-5 flex gap-2">

            <button
              onClick={() => onView(customer)}
              className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
            >
              <Eye className="h-4 w-4" />
              View
            </button>

            <button
              onClick={() => onEdit(customer)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 hover:bg-blue-50"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>

            <button
              onClick={() => onDelete(customer)}
              className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>

          </div>
        </div>
      ))
    )}
  </div>
);
    
  
}

return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-left p-4">Customer</th>
            <th className="text-left p-4">Phone</th>
            <th className="text-left p-4">Purchase</th>
            <th className="text-left p-4">Outstanding</th>
            <th className="text-left p-4">Last Invoice</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-20 text-center">
                <div className="flex flex-col items-center">
                  <div className="text-6xl mb-4">👥</div>

                  <h2 className="text-2xl font-semibold text-slate-700">
                    No Customers Yet
                  </h2>

                  <p className="text-slate-500 mt-2">
                    Add your first customer to start managing ledger.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="p-4">
                  <div className="font-semibold text-slate-800">
                    {customer.customer_name}
                  </div>

                  {customer.gst_number && (
                    <div className="text-xs text-slate-500 mt-1">
                      GST: {customer.gst_number}
                    </div>
                  )}
                </td>

                <td className="p-4 text-slate-600">
                  {customer.phone || "-"}
                </td>

                <td className="p-4 font-medium">
                  ₹{Number(customer.total_purchase || 0).toLocaleString("en-IN")}
                </td>

                <td className="p-4 font-semibold text-red-600">
                  ₹{Number(customer.outstanding || 0).toLocaleString("en-IN")}
                </td>

                <td className="p-4">
  {customer.last_invoice_number ? (
    <div>
      <p className="font-medium text-slate-700">
        {customer.last_invoice_number}
      </p>

      {customer.last_invoice_date && (
        <p className="mt-1 text-xs text-slate-400">
          {new Date(
            customer.last_invoice_date
          ).toLocaleDateString("en-IN")}
        </p>
      )}
    </div>
  ) : (
    <span className="text-slate-400">-</span>
  )}
</td>
                <td className="p-4">
  {(() => {
    const outstanding = Number(customer.outstanding || 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = customer.last_invoice_due_date
      ? new Date(customer.last_invoice_due_date)
      : null;

    if (dueDate) {
      dueDate.setHours(0, 0, 0, 0);
    }

    if (outstanding === 0) {
      return (
        <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
          Paid
        </span>
      );
    }

    if (dueDate && dueDate < today) {
      return (
        <span className="inline-flex px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
          Overdue
        </span>
      );
    }

    return (
      <span className="inline-flex px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold">
        Due
      </span>
    );
  })()}
</td>

                <td className="p-4">
  <div className="flex items-center gap-2">
    <button
  onClick={() => onView(customer)}
  className="px-3 py-2 rounded-lg border text-sm font-medium hover:bg-slate-100 transition"
>
  View
</button>
    <button
      onClick={() => onEdit(customer)}
      className="px-3 py-2 rounded-lg border text-sm font-medium hover:bg-slate-100 transition"
    >
      Edit
    </button>

    <button
      onClick={() => onDelete(customer)}
      className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition"
    >
      Delete
    </button>
  </div>
</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
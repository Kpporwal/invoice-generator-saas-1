import type { Customer } from "../../types/customers";

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
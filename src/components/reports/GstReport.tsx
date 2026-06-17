import { useInvoiceStore } from "../../store/InvoiceContext";

export default function GstReport() {
  const { invoices } = useInvoiceStore();

  const gstData: Record<number, { taxable: number; gst: number }> = {};

  invoices.forEach((invoice) => {
    invoice.items.forEach((item) => {
      const rate = item.gstPercent;

      if (!gstData[rate]) {
        gstData[rate] = {
          taxable: 0,
          gst: 0,
        };
      }

      const taxable = item.quantity * item.rate;
      const gst = taxable * rate / 100;

      gstData[rate].taxable += taxable;
      gstData[rate].gst += gst;
    });
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
      <h2 className="text-xl font-semibold mb-5">
        GST Report
      </h2>

      <table className="w-full">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="text-left p-3">GST Rate</th>
            <th className="text-right p-3">Taxable Amount</th>
            <th className="text-right p-3">GST Amount</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(gstData).map(([rate, data]) => (
            <tr key={rate} className="border-b hover:bg-slate-50">
              <td className="p-3">{rate}%</td>
              <td className="text-right">
                ₹{data.taxable.toLocaleString("en-IN")}
              </td>
              <td className="text-right">
                ₹{data.gst.toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
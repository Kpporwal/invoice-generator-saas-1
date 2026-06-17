import { useInvoiceStore } from "../../store/InvoiceContext";

export default function MonthlySales() {
  const { invoices } = useInvoiceStore();

  const monthlyData: Record<
    string,
    { invoices: number; revenue: number; gst: number }
  > = {};

  invoices.forEach((invoice) => {
    const month = new Date(invoice.invoiceDate).toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
    });

    if (!monthlyData[month]) {
      monthlyData[month] = {
        invoices: 0,
        revenue: 0,
        gst: 0,
      };
    }

    monthlyData[month].invoices += 1;
    monthlyData[month].revenue += invoice.calculations.grandTotal;
    monthlyData[month].gst += invoice.calculations.gstTotal;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
      <h2 className="text-xl font-semibold mb-5">
        Monthly Sales Report
      </h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-slate-50">
            <th className="text-left p-3">Month</th>
            <th className="text-center p-3">Invoices</th>
            <th className="text-right p-3">Revenue</th>
            <th className="text-right p-3">GST</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(monthlyData).map(([month, data]) => (
            <tr key={month} className="border-b hover:bg-slate-50">
              <td className="p-3">{month}</td>

              <td className="text-center">
                {data.invoices}
              </td>

              <td className="text-right">
                ₹{data.revenue.toLocaleString("en-IN")}
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
import Layout from "../layout/Layout";
import MonthlySales from "./MonthlySales";
import GstReport from "./GstReport";
import {
Download,
FileSpreadsheet,
Printer,
TrendingUp,
IndianRupee,
Receipt,
Clock3,
} from "lucide-react";

import { useInvoiceStore } from "../../store/InvoiceContext";

interface ReportsProps {}

export default function Reports({}: ReportsProps) {
  const { invoices } = useInvoiceStore();

const totalRevenue = invoices.reduce(
  (sum, invoice) => sum + invoice.calculations.grandTotal,
  0
);

const totalGST = invoices.reduce(
  (sum, invoice) => sum + invoice.calculations.gstTotal,
  0
);

const pendingAmount = invoices
  .filter(i => i.status !== "paid")
  .reduce((sum, invoice) => sum + invoice.calculations.grandTotal, 0);

const totalInvoices = invoices.length;

  return (


<Layout
title="Reports"
subtitle="Business Analytics & GST Reports"
>

<div className="space-y-6">

{/* Header */}

<div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">

<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

<div>

<h1 className="text-3xl font-bold">
Business Reports
</h1>

<p className="text-emerald-100 mt-2">
Monitor your sales, GST collection and business performance.
</p>

</div>

<div className="flex flex-wrap gap-3">

<button className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition">
<FileSpreadsheet size={18}/>
</button>

<button className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition">
<Download size={18}/>
</button>

<button className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition">
<Printer size={18}/>
</button>

</div>

</div>

</div>

{/* Filters */}

<div className="bg-white rounded-2xl border shadow-sm p-6">

<div className="grid lg:grid-cols-4 gap-5">

<div>

<label className="text-sm text-slate-500">
From Date
</label>

<input
type="date"
className="mt-2 w-full border rounded-xl p-3"
/>

</div>

<div>

<label className="text-sm text-slate-500">
To Date
</label>

<input
type="date"
className="mt-2 w-full border rounded-xl p-3"
/>

</div>

<div>

<label className="text-sm text-slate-500">
Report Type
</label>

<select
className="mt-2 w-full border rounded-xl p-3"
>

<option>All Reports</option>
<option>GST</option>
<option>Sales</option>

</select>

</div>

<div className="flex items-end">

<button
className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-3 font-semibold"
>

Generate Report

</button>

</div>

</div>

</div>

{/* Summary */}

<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

<div className="bg-white rounded-2xl shadow-sm border p-6">

<div className="flex justify-between">

<div>

<p className="text-slate-500 text-sm">
Revenue
</p>

<h2 className="text-3xl font-bold mt-3 text-emerald-600">
₹{totalRevenue.toLocaleString()}
</h2>

</div>

<div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">

<IndianRupee className="text-emerald-600"/>

</div>

</div>

</div>

<div className="bg-white rounded-2xl shadow-sm border p-6">

<div className="flex justify-between">

<div>

<p className="text-slate-500 text-sm">
Invoices
</p>

<h2 className="text-3xl font-bold mt-3">
{totalInvoices}
</h2>

</div>

<div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">

<Receipt className="text-blue-600"/>

</div>

</div>

</div>

<div className="bg-white rounded-2xl shadow-sm border p-6">

<div className="flex justify-between">

<div>

<p className="text-slate-500 text-sm">
GST Collected
</p>

<h2 className="text-3xl font-bold mt-3 text-blue-600">
₹{totalGST.toLocaleString()}
</h2>

</div>

<div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center">

<TrendingUp className="text-cyan-600"/>

</div>

</div>

</div>

<div className="bg-white rounded-2xl shadow-sm border p-6">

<div className="flex justify-between">

<div>

<p className="text-slate-500 text-sm">
Pending
</p>

<h2 className="text-3xl font-bold mt-3 text-red-600">
₹{pendingAmount.toLocaleString()}
</h2>

</div>

<div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">

<Clock3 className="text-red-600"/>

</div>

</div>

</div>

</div>

<MonthlySales/>

<GstReport/>

</div>

</Layout>

);
}
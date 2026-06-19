import { useState } from "react";
import Layout from "../layout/Layout";

export default function BusinessProfile() {
  const [form, setForm] = useState({
    businessName: "",
    address: "",
    gstNumber: "",
    phone: "",
    upiId: "",
    logo: null as File | null,
    signature: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout
  title="Business Profile"
  subtitle="Manage your business information"
>
  <div className="max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

    {/* Section Heading */}
    <div className="pb-4 mb-6 border-b">
      <h2 className="text-xl font-semibold text-slate-800">
        Business Information
      </h2>

      <p className="text-sm text-slate-500">
        These details will automatically appear on your invoices.
      </p>
    </div>

    <div className="grid gap-5">

      

          <div>
            <label className="font-medium">Business Name</label>
            <input
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Business Address</label>
            <textarea
              rows={3}
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          <div>
            <label className="font-medium">GST Number</label>
            <input
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          <div>
            <label className="font-medium">UPI ID  </label>
            <input

             placeholder="example@oksbi"
/>

<p className="text-xs text-emerald-600 mt-2">
QR Code will be generated automatically.
</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

<div>
<label className="font-medium">
Company Logo
</label>

<input
type="file"
accept="image/*"
className="w-full mt-2 border rounded-lg p-3"
/>

<p className="text-xs text-slate-400 mt-2">
PNG / JPG
</p>

</div>

<div>

<label className="font-medium">
Signature
</label>

<input
type="file"
accept="image/*"
className="w-full mt-2 border rounded-lg p-3"
/>

<p className="text-xs text-slate-400 mt-2">
Transparent PNG Recommended
</p>

</div>

</div>

          <button
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-semibold transition"
          >
            💾 Save Business Profile
          </button>

          <p className="text-center text-xs text-slate-400 mt-4">
Your saved information will automatically appear on invoices and PDFs.
</p>

        </div>
      </div>
    </Layout>
  );
}
import {
  ShieldCheck,
  Database,
  Lock,
  Eye,
  FileCheck,
  Mail,
} from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-5">

      <div className="max-w-5xl mx-auto">

        {/* Hero */}

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl text-white p-10 shadow-xl">

          <h1 className="text-4xl font-bold">
            Privacy Policy
          </h1>

          <p className="mt-4 text-lg text-emerald-100 max-w-3xl">
            BillNova respects your privacy and is committed to protecting
            your personal and business information.
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div className="bg-white rounded-2xl border p-6 shadow-sm">

            <Database className="text-emerald-600 mb-4" size={34} />

            <h2 className="font-bold text-xl mb-3">
              Information We Collect
            </h2>

            <ul className="space-y-2 text-slate-600">

              <li>• Email Address</li>
              <li>• Business Information</li>
              <li>• Customer Details</li>
              <li>• Invoice Records</li>
              <li>• GST Information</li>

            </ul>

          </div>

          <div className="bg-white rounded-2xl border p-6 shadow-sm">

            <Eye className="text-blue-600 mb-4" size={34} />

            <h2 className="font-bold text-xl mb-3">
              How We Use Data
            </h2>

            <ul className="space-y-2 text-slate-600">

              <li>• Create GST invoices</li>
              <li>• Generate PDF invoices</li>
              <li>• Maintain invoice history</li>
              <li>• Improve software performance</li>
              <li>• Customer support</li>

            </ul>

          </div>

          <div className="bg-white rounded-2xl border p-6 shadow-sm">

            <Lock className="text-red-500 mb-4" size={34} />

            <h2 className="font-bold text-xl mb-3">
              Data Security
            </h2>

            <p className="text-slate-600 leading-7">

              We use secure cloud infrastructure and modern security
              practices to protect your invoice and business data.
              Your information is never sold to third parties.

            </p>

          </div>

          <div className="bg-white rounded-2xl border p-6 shadow-sm">

            <FileCheck className="text-orange-500 mb-4" size={34} />

            <h2 className="font-bold text-xl mb-3">
              Your Rights
            </h2>

            <ul className="space-y-2 text-slate-600">

              <li>• Access your information</li>
              <li>• Update your profile</li>
              <li>• Delete your account</li>
              <li>• Request data removal</li>

            </ul>

          </div>

        </div>

        {/* Security */}

        <div className="bg-white rounded-3xl border shadow-sm mt-12 p-10">

          <div className="flex items-center gap-4">

            <ShieldCheck
              className="text-emerald-600"
              size={42}
            />

            <div>

              <h2 className="text-3xl font-bold text-slate-800">
                Security Commitment
              </h2>

              <p className="text-slate-600 mt-3 leading-8">

                BillNova continuously improves its security measures
                to ensure that your billing information remains
                protected. We recommend using strong passwords and
                keeping your login credentials confidential.

              </p>

            </div>

          </div>

        </div>

        {/* Contact */}

        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl text-white mt-12 p-10">

          <div className="flex items-center gap-4">

            <Mail
              className="text-emerald-400"
              size={40}
            />

            <div>

              <h2 className="text-2xl font-bold">
                Questions?
              </h2>

              <p className="text-slate-300 mt-2">

                If you have any questions regarding this Privacy
                Policy, please contact our support team.

              </p>

              <p className="mt-4 text-emerald-300 font-medium">

                support@billnova.in

              </p>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="text-center py-10">

          <h3 className="font-bold text-lg text-slate-800">
            BillNova
          </h3>

          <p className="text-slate-500 mt-2">
            Smart GST Billing Software
          </p>

          <p className="text-sm text-slate-400 mt-4">
            © 2026 BillNova. All Rights Reserved.
          </p>

        </div>

      </div>

    </div>
  );
}
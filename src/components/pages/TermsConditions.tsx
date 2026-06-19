import {
  FileCheck,
  Shield,
  Ban,
  Scale,
  AlertTriangle,
  Mail,
} from "lucide-react";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-5">

      <div className="max-w-5xl mx-auto">

        {/* Hero */}

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl text-white p-10 shadow-xl">

          <h1 className="text-4xl font-bold">
            Terms & Conditions
          </h1>

          <p className="mt-4 text-lg text-emerald-100 max-w-3xl">
            Please read these Terms & Conditions carefully before using
            BillNova – Smart GST Billing Software.
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div className="bg-white rounded-2xl border p-6 shadow-sm">

            <FileCheck className="text-emerald-600 mb-4" size={34} />

            <h2 className="font-bold text-xl mb-3">
              Acceptance of Terms
            </h2>

            <p className="text-slate-600 leading-7">

              By accessing or using BillNova, you agree to comply with
              these Terms & Conditions and all applicable laws.

            </p>

          </div>

          <div className="bg-white rounded-2xl border p-6 shadow-sm">

            <Shield className="text-blue-600 mb-4" size={34} />

            <h2 className="font-bold text-xl mb-3">
              User Responsibilities
            </h2>

            <ul className="space-y-2 text-slate-600">

              <li>• Provide accurate business information.</li>

              <li>• Keep your login credentials secure.</li>

              <li>• Use the platform responsibly.</li>

              <li>• Comply with GST and local regulations.</li>

            </ul>

          </div>

          <div className="bg-white rounded-2xl border p-6 shadow-sm">

            <Ban className="text-red-500 mb-4" size={34} />

            <h2 className="font-bold text-xl mb-3">
              Prohibited Activities
            </h2>

            <ul className="space-y-2 text-slate-600">

              <li>• Illegal use of the platform.</li>

              <li>• Uploading malicious software.</li>

              <li>• Attempting unauthorized access.</li>

              <li>• Misusing customer information.</li>

            </ul>

          </div>

          <div className="bg-white rounded-2xl border p-6 shadow-sm">

            <Scale className="text-orange-500 mb-4" size={34} />

            <h2 className="font-bold text-xl mb-3">
              Limitation of Liability
            </h2>

            <p className="text-slate-600 leading-7">

              BillNova shall not be liable for any indirect,
              incidental or consequential damages resulting
              from the use of this software.

            </p>

          </div>

        </div>

        {/* Important Notice */}

        <div className="bg-white rounded-3xl border shadow-sm mt-12 p-10">

          <div className="flex items-center gap-4">

            <AlertTriangle
              className="text-yellow-500"
              size={42}
            />

            <div>

              <h2 className="text-3xl font-bold text-slate-800">
                Important Notice
              </h2>

              <p className="text-slate-600 mt-3 leading-8">

                BillNova provides billing and invoice management tools.
                Users are responsible for verifying GST rates,
                tax calculations and legal compliance before
                sharing invoices with customers.

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
                Need Assistance?
              </h2>

              <p className="text-slate-300 mt-2">

                If you have any questions regarding these Terms &
                Conditions, feel free to contact our support team.

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
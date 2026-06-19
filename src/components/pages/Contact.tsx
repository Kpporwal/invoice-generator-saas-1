import {
  Mail,
  MessageCircle,
  Clock,
  Globe,
  Headphones,
  MapPin,
} from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-5">

      <div className="max-w-5xl mx-auto">

        {/* Hero */}

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl text-white p-10 shadow-xl">

          <h1 className="text-4xl font-bold">
            Contact BillNova
          </h1>

          <p className="mt-4 text-lg text-emerald-100 max-w-2xl">
            Need help with invoices, billing or technical support?
            Our team is always ready to assist you.
          </p>

        </div>

        {/* Contact Cards */}

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition">

            <Mail className="text-emerald-600 mb-4" size={32} />

            <h2 className="font-bold text-xl mb-2">
              Email Support
            </h2>

            <p className="text-slate-600 mb-3">
              support@billnova.in
            </p>

            <p className="text-sm text-slate-500">
              Response within 24 hours.
            </p>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition">

            <MessageCircle className="text-green-600 mb-4" size={32} />

            <h2 className="font-bold text-xl mb-2">
              WhatsApp
            </h2>

            <p className="text-slate-600 mb-3">
              +91 8000060853            </p>

            <p className="text-sm text-slate-500">
              Quick support for customers.
            </p>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition">

            <Clock className="text-orange-500 mb-4" size={32} />

            <h2 className="font-bold text-xl mb-2">
              Support Hours
            </h2>

            <p className="text-slate-600">
              Monday - Saturday
            </p>

            <p className="text-slate-600">
              9:00 AM - 7:00 PM
            </p>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition">

            <Globe className="text-blue-600 mb-4" size={32} />

            <h2 className="font-bold text-xl mb-2">
              Website
            </h2>

            <p className="text-slate-600">
              www.billnova.in
            </p>

            <p className="text-sm text-slate-500 mt-3">
              Modern GST Billing Software
            </p>

          </div>

        </div>

        {/* Help Section */}

        <div className="bg-white rounded-3xl mt-12 p-10 border shadow-sm">

          <div className="flex items-center gap-4">

            <Headphones
              className="text-emerald-600"
              size={40}
            />

            <div>

              <h2 className="text-3xl font-bold text-slate-800">
                Need Technical Help?
              </h2>

              <p className="text-slate-600 mt-2">
                If you're experiencing any issue with invoices,
                PDF generation, GST calculations or account access,
                feel free to contact our support team.
              </p>

            </div>

          </div>

        </div>

        {/* Office */}

        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-10 mt-12">

          <div className="flex items-center gap-4">

            <MapPin
              className="text-emerald-400"
              size={40}
            />

            <div>

              <h2 className="text-2xl font-bold">
                BillNova
              </h2>

              <p className="text-slate-300 mt-2">
                Smart GST Billing Software
              </p>

              <p className="text-slate-400 mt-4">
                Built for freelancers, startups,
                retailers and growing businesses across India.
              </p>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="text-center py-10 text-slate-500">

          <p className="font-semibold text-slate-800 text-lg">
            BillNova
          </p>

          <p className="mt-2">
            Smart GST Billing Software
          </p>

          <p className="mt-4 text-sm">
            © 2026 BillNova. All Rights Reserved.
          </p>

        </div>

      </div>

    </div>
  );
}
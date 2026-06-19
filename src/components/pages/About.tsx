import {
  Building2,
  ShieldCheck,
  FileText,
  BadgeIndianRupee,
  Smartphone,
  BarChart3,
  Sparkles,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      title: "GST Invoice Creation",
      desc: "Generate professional GST compliant invoices in seconds.",
    },
    {
      icon: <BadgeIndianRupee className="w-6 h-6 text-emerald-600" />,
      title: "PDF Export",
      desc: "Download clean printable invoices instantly.",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-emerald-600" />,
      title: "WhatsApp Sharing",
      desc: "Send invoices directly to customers via WhatsApp.",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-emerald-600" />,
      title: "Business Reports",
      desc: "Track invoices and monitor business growth.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: "Secure",
      desc: "Your invoice data remains protected and reliable.",
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      title: "Easy to Use",
      desc: "Designed for shop owners, freelancers and startups.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-5">

      <div className="max-w-6xl mx-auto">

        {/* Hero */}

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl text-white p-10 shadow-xl">

          <div className="flex items-center gap-4">

            <div className="bg-white/20 p-4 rounded-2xl">

              <Building2 size={42} />

            </div>

            <div>

              <h1 className="text-4xl font-bold">
                BillNova
              </h1>

              <p className="text-emerald-100 text-lg mt-2">
                Smart GST Billing Software
              </p>

            </div>

          </div>

          <p className="mt-8 text-lg leading-8 max-w-3xl">

            BillNova helps businesses create professional GST invoices,
            manage customers, export PDF invoices and simplify billing
            with a clean, modern and reliable experience.

          </p>

        </div>

        {/* Features */}

        <div className="mt-12">

          <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">

            <Sparkles className="text-emerald-600"/>

            Why Choose BillNova

          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {features.map((item,index)=>(

              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition"
              >

                {item.icon}

                <h3 className="font-bold text-lg mt-4">
                  {item.title}
                </h3>

                <p className="text-slate-600 mt-2 text-sm leading-6">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* Mission */}

        <div className="bg-white rounded-3xl shadow-sm border mt-12 p-10">

          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            Our Mission
          </h2>

          <p className="text-slate-600 leading-8">

            Our mission is to simplify GST billing for freelancers,
            retailers, agencies and growing businesses by providing
            a fast, secure and modern invoicing platform.

            BillNova focuses on productivity, simplicity and
            professional business management.

          </p>

        </div>

        {/* Built For */}

        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl text-white p-10 mt-12">

          <h2 className="text-3xl font-bold mb-8">
            Built For
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {[
              "Shop Owners",
              "Freelancers",
              "Small Businesses",
              "Agencies",
              "Startups",
              "GST Professionals",
            ].map((item,index)=>(

              <div
                key={index}
                className="flex items-center gap-3 bg-white/10 rounded-xl p-4"
              >

                <CheckCircle2 className="text-emerald-400"/>

                <span>{item}</span>

              </div>

            ))}

          </div>

        </div>

        {/* Footer */}

        <div className="text-center py-12 text-slate-500">

          <h3 className="font-bold text-xl text-slate-800">
            BillNova
          </h3>

          <p className="mt-2">
            Smart GST Billing Software
          </p>

          <p className="mt-5 text-sm">
            © 2026 BillNova. All Rights Reserved.
          </p>

        </div>

      </div>

    </div>
  );
}
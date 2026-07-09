import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
ArrowLeft,
Download,
Printer,
Copy,
Edit3,
Trash2,
Loader2,
AlertCircle,
Share2
} from "lucide-react";
import { useInvoiceStore } from '../../store/InvoiceContext';
import { formatCurrency, formatDate, calculateItemGST, calculateItemBase } from '../../utils/calculations';
import { generateInvoicePDF } from '../../utils/pdfGenerator';
import type { Invoice } from '../../types';
import Layout from '../layout/Layout';


type Page =
  | 'dashboard'
  | 'create'
  | 'history'
  | 'preview'
  | 'reports'
  | 'customers'
  | 'business-profile'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'contact';

interface InvoicePreviewProps {
  invoice: Invoice | null;
  onNavigate: (page: Page) => void;
  onEdit: (invoice: Invoice) => void;
  onDuplicate: (invoice: Invoice) => void;
}

export default function InvoicePreview({ invoice, onNavigate, onEdit, onDuplicate }: InvoicePreviewProps) {
  const { deleteInvoice } = useInvoiceStore();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!invoice) {
    return (
      <Layout title="Invoice Preview" subtitle="No invoice selected">
        <div className="text-center py-12">
          <p className="text-slate-500">No invoice to preview. Create one first.</p>
          <button onClick={() => onNavigate('create')} className="mt-3 text-sm text-emerald-600 font-medium hover:text-emerald-700">
            Create Invoice
          </button>
        </div>
      </Layout>
    );
  }

  const handleDownloadPDF = async () => {
  const el = invoiceRef.current;
  if (!el) return;

  setGenerating(true);
  setError(null);


  // Scale wrapper save karo
  const wrapper = el.parentElement;
  const oldTransform = wrapper?.style.transform;
  const oldWidth = wrapper?.style.width;

  try {
    // PDF banate time original size
    if (wrapper) {
      wrapper.style.transform = "scale(1)";
      wrapper.style.width = "210mm";
    }

    await generateInvoicePDF(el, invoice.invoiceNumber);

  } catch (err) {
    setError("Failed to generate PDF. Please try again.");
    console.error(err);

  } finally {
    // Wapas mobile preview restore
    if (wrapper) {
      wrapper.style.transform = oldTransform || "";
      wrapper.style.width = oldWidth || "";
    }

    setGenerating(false);
  }
};
const handleWhatsAppShare = () => {
  if (!invoice) return;

  let number = invoice.customer.whatsappNumber || "";

  number = number.replace(/\D/g, "");

  if (number.length === 10) {
    number = "91" + number;
  }

  const message = `Hello ${invoice.customer.name},

Please find your Invoice.

Invoice No : ${invoice.invoiceNumber}

Amount : ₹${invoice.calculations.grandTotal.toLocaleString("en-IN")}

Thank you for choosing BillNova.

Team BillNova`;

  window.open(
    `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};
  const handlePrint = () => {
    const content = invoiceRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Invoice-${invoice.invoiceNumber}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:10px;color:#1e293b;font-size:12px}
  table{width:100%;border-collapse:collapse}
  th,td{padding:8px 10px;text-align:left;border-bottom:1px solid #e2e8f0;font-size:11px}
  th{font-weight:600;color:#64748b;font-size:10px;text-transform:uppercase;letter-spacing:0.05em}
  .inv-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:20px;border-bottom:3px solid #0f172a}
  .inv-bill-to{margin-bottom:20px}
  .inv-label{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px}
  .inv-total-row{display:flex;justify-content:space-between;padding:6px 0;font-size:12px}
  .inv-grand{font-size:14px;font-weight:700;border-top:3px solid #0f172a;padding-top:8px;margin-top:4px}
  .inv-words{font-style:italic;font-size:10px;color:#64748b;margin-top:4px}
  .inv-footer{margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0}
  .gst-badge{display:inline-block;padding:1px 6px;background:#f0fdf4;color:#166534;font-size:10px;border-radius:3px;font-weight:600}
  @page{
  size:A4;
  margin:10mm;
}

html,body{
  width:210mm;
  height:297mm;
}

@media print{

  html,body{
    width:210mm;
    height:297mm;
    margin:0;
    padding:0;
    overflow:hidden;
    -webkit-print-color-adjust:exact;
    print-color-adjust:exact;
  }

  body{
    padding:10mm;
  }

  table{
    page-break-inside:avoid;
  }

  .inv-footer{
    page-break-inside:avoid;
  }
}</style></head><body>${content.innerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      await deleteInvoice(invoice.id);
      onNavigate('history');
    }
  };

  const qrPayableAmount = Number(invoice.balanceDue || 0);

const upiQrString =
  invoice.upiId && qrPayableAmount > 0
    ? `upi://pay?pa=${invoice.upiId}&pn=${encodeURIComponent(
        invoice.company.name
      )}&am=${qrPayableAmount.toFixed(2)}&cu=INR`
    : "";

  // Build GST summary by rate
const gstBreakdown = invoice.items.reduce<
  Record<
    number,
    {
      taxable: number;
      cgst: number;
      sgst: number;
      total: number;
    }
  >
>((acc, item) => {
  const base = calculateItemBase(item);

  const discount = Math.min(
    Math.max(Number(item.discount || 0), 0),
    base
  );

  const taxableAmount = base - discount;

  // calculateItemGST already discount ke baad GST calculate karta hai
  const gstAmount = calculateItemGST(item);

  const gstPercent = Number(item.gstPercent || 0);

  if (!acc[gstPercent]) {
    acc[gstPercent] = {
      taxable: 0,
      cgst: 0,
      sgst: 0,
      total: 0,
    };
  }

  acc[gstPercent].taxable += taxableAmount;
  acc[gstPercent].cgst += gstAmount / 2;
  acc[gstPercent].sgst += gstAmount / 2;
  acc[gstPercent].total += gstAmount;

  return acc;
}, {});
  const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-600',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-emerald-100 text-emerald-700',
    overdue: 'bg-red-100 text-red-700',
  };

  return (
    <Layout title="Invoice Preview" subtitle={invoice.invoiceNumber}>
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button onClick={() => onNavigate('history')} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={16} />
          Back
        </button>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[invoice.status]}`}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </span>
        <div className="flex-1" />
        <button onClick={() => onEdit(invoice)} className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
          <Edit3 size={14} />
          Edit
        </button>
        <button onClick={() => onDuplicate(invoice)} className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
          <Copy size={14} />
          Duplicate
        </button>
        <button onClick={handleDownloadPDF} disabled={generating} className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
          {generating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          Download PDF
        </button>
        <button
  onClick={handleWhatsAppShare}
  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
>
  <Share2 size={18} />
  WhatsApp
</button>
        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
          <Printer size={14} />
          Print
        </button>
        <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
          <Trash2 size={14} />
          Delete
        </button>
      </div>

      {/* ---- Invoice Document (A4-proportioned, captured for PDF) ---- */}
    <div className="bg-white rounded-xl border border-slate-200 shadow-lg py-6 overflow-y-auto overflow-x-hidden"></div>
  <div className="w-full flex justify-center py-4">
    <div
      className="origin-top scale-[0.42] sm:scale-[0.55] md:scale-[0.72] lg:scale-100"
    >
      <div
        ref={invoiceRef}
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "16mm 20mm",
          background: "#fff",
          color: "#1e293b",
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
          fontSize: "12px",
          lineHeight: "1.5",
        }}
      >
        
          {/* === PROFESSIONAL INVOICE HEADER === */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24,
    paddingBottom: 18,
    borderBottom: "3px solid #0f172a",
    marginBottom: 20,
  }}
>
  {/* BUSINESS DETAILS */}
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      flex: 1,
      minWidth: 0,
    }}
  >
    <img
      src={invoice.company.logo || "/logo.png"}
      alt="Business Logo"
      style={{
        width: 78,
        height: 78,
        objectFit: "contain",
        flexShrink: 0,
      }}
    />

    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1.2,
        }}
      >
        {invoice.company.name}
      </div>

      <div
        style={{
          fontSize: 10,
          color: "#10b981",
          fontWeight: 700,
          marginTop: 3,
        }}
      >
        Smart GST Billing Software
      </div>

      {invoice.company.address && (
        <div
          style={{
            fontSize: 10,
            color: "#64748b",
            whiteSpace: "pre-line",
            marginTop: 7,
            lineHeight: 1.5,
          }}
        >
          {invoice.company.address}
        </div>
      )}

      {invoice.company.phone && (
        <div
          style={{
            fontSize: 10,
            color: "#64748b",
            marginTop: 3,
          }}
        >
          Phone: {invoice.company.phone}
        </div>
      )}

      {invoice.company.email && (
        <div
          style={{
            fontSize: 10,
            color: "#64748b",
            marginTop: 2,
          }}
        >
          Email: {invoice.company.email}
        </div>
      )}

      {invoice.company.gstNumber && (
        <div
          style={{
            fontSize: 10,
            color: "#334155",
            fontWeight: 700,
            marginTop: 5,
          }}
        >
          GSTIN: {invoice.company.gstNumber}
        </div>
      )}
    </div>
  </div>

  {/* INVOICE META */}
  <div
    style={{
      width: 190,
      flexShrink: 0,
      textAlign: "right",
    }}
  >
    <div
      style={{
        fontSize: 25,
        fontWeight: 800,
        color: "#0f172a",
        letterSpacing: 1.5,
        lineHeight: 1,
      }}
    >
      TAX INVOICE
    </div>

    <div
      style={{
        display: "inline-block",
        marginTop: 8,
        padding: "4px 9px",
        borderRadius: 4,
        background: "#f1f5f9",
        fontSize: 11,
        fontWeight: 700,
        color: "#334155",
      }}
    >
      {invoice.invoiceNumber}
    </div>

    <div
      style={{
        marginTop: 10,
        fontSize: 10,
        color: "#64748b",
        lineHeight: 1.8,
      }}
    >
      <div>
        Invoice Date:{" "}
        <span style={{ color: "#1e293b", fontWeight: 600 }}>
          {formatDate(invoice.invoiceDate)}
        </span>
      </div>

      <div>
        Due Date:{" "}
        <span style={{ color: "#1e293b", fontWeight: 600 }}>
          {formatDate(invoice.dueDate)}
        </span>
      </div>
    </div>

    {/* PAYMENT STATUS BADGE */}
    
  </div>
</div>

{/* === BILL TO === */}
<div style={{ marginBottom: 22 }}>
  <div
    className="inv-label"
    style={{
      fontSize: 9,
      fontWeight: 800,
      color: "#94a3b8",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: 6,
    }}
  >
    Bill To
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 20,
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: 8,
      padding: "12px 15px",
    }}
  >
    {/* CUSTOMER DETAILS */}
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: "#0f172a",
        }}
      >
        {invoice.customer.name}
      </div>

      {invoice.customer.address && (
        <div
          style={{
            fontSize: 10,
            color: "#64748b",
            whiteSpace: "pre-line",
            marginTop: 4,
            lineHeight: 1.5,
          }}
        >
          {invoice.customer.address}
        </div>
      )}

      {invoice.customer.whatsappNumber && (
        <div
          style={{
            fontSize: 10,
            color: "#64748b",
            marginTop: 3,
          }}
        >
          Mobile: {invoice.customer.whatsappNumber}
        </div>
      )}

      {invoice.customer.gstNumber && (
        <div
          style={{
            fontSize: 10,
            color: "#334155",
            fontWeight: 700,
            marginTop: 4,
          }}
        >
          GSTIN: {invoice.customer.gstNumber}
        </div>
      )}
    </div>

    {/* BALANCE DUE QUICK VIEW */}
    <div
      style={{
        minWidth: 120,
        textAlign: "right",
        paddingLeft: 15,
        borderLeft: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: "#94a3b8",
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        Balance Due
      </div>

      <div
        style={{
          marginTop: 4,
          fontSize: 16,
          fontWeight: 800,
          color:
            Number(invoice.balanceDue || 0) > 0
              ? "#dc2626"
              : "#059669",
        }}
      >
        {formatCurrency(invoice.balanceDue || 0)}
      </div>
    </div>
  </div>
</div>

          {/* === ITEMS TABLE === */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', color: '#fff' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', borderRadius: '6px 0 0 0' }}>#</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>Item</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>HSN/SAC</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>Qty</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>Rate</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>Taxable</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>GST%</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>CGST</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>SGST</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', borderRadius: '0 6px 0 0' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
  {invoice.items.map((item, idx) => {
    const base = calculateItemBase(item);

    const discount = Math.min(
      Math.max(Number(item.discount || 0), 0),
      base
    );

    const taxableAmount = base - discount;

    const gstAmt = calculateItemGST(item);
    const cgst = gstAmt / 2;
    const sgst = gstAmt / 2;

    const finalAmount = taxableAmount + gstAmt;

    return (
      <tr
        key={item.id}
        style={{
          backgroundColor: idx % 2 === 0 ? "#fff" : "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <td
          style={{
            padding: "8px 12px",
            fontSize: 11,
            color: "#94a3b8",
          }}
        >
          {idx + 1}
        </td>

        <td
          style={{
            padding: "8px 12px",
            fontWeight: 600,
            color: "#1e293b",
          }}
        >
          {item.name}

          {item.description && (
            <div
              style={{
                fontSize: 10,
                fontWeight: 400,
                color: "#64748b",
                marginTop: 1,
              }}
            >
              {item.description}
            </div>
          )}

          {discount > 0 && (
            <div
              style={{
                fontSize: 9,
                fontWeight: 500,
                color: "#dc2626",
                marginTop: 2,
              }}
            >
              Discount: -{formatCurrency(discount)}
            </div>
          )}
        </td>

        <td
          style={{
            padding: "8px 12px",
            fontSize: 11,
            color: "#64748b",
          }}
        >
          -
        </td>

        <td
          style={{
            padding: "8px 12px",
            textAlign: "right",
            color: "#334155",
          }}
        >
          {item.quantity}
        </td>

        <td
          style={{
            padding: "8px 12px",
            textAlign: "right",
            color: "#334155",
          }}
        >
          {formatCurrency(item.rate)}
        </td>

        <td
          style={{
            padding: "8px 12px",
            textAlign: "right",
            color: "#334155",
          }}
        >
          {formatCurrency(taxableAmount)}
        </td>

        <td
          style={{
            padding: "8px 12px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "1px 6px",
              background: "#f0fdf4",
              color: "#166534",
              fontSize: 10,
              borderRadius: 3,
              fontWeight: 600,
            }}
          >
            {item.gstPercent}%
          </span>
        </td>

        <td
          style={{
            padding: "8px 12px",
            textAlign: "right",
            color: "#334155",
            fontSize: 11,
          }}
        >
          {formatCurrency(cgst)}
        </td>

        <td
          style={{
            padding: "8px 12px",
            textAlign: "right",
            color: "#334155",
            fontSize: 11,
          }}
        >
          {formatCurrency(sgst)}
        </td>

        <td
          style={{
            padding: "8px 12px",
            textAlign: "right",
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          {formatCurrency(finalAmount)}
        </td>
      </tr>
    );
  })}
</tbody>
          </table>

          {/* === GST SUMMARY + TOTALS COMPACT ROW === */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24,
    marginTop: 10,
    marginBottom: 14,
    pageBreakInside: "avoid",
  }}
>
  {/* LEFT: GST SUMMARY */}
  <div
    style={{
      flex: 1,
      minWidth: 0,
    }}
  >
    {Object.keys(gstBreakdown).length > 0 && (
      <>
        <div
          style={{
            fontSize: 9,
            fontWeight: 800,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 5,
          }}
        >
          GST Summary
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid #cbd5e1",
              }}
            >
              <th
                style={{
                  padding: "5px 6px",
                  textAlign: "left",
                  fontSize: 9,
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                Rate
              </th>

              <th
                style={{
                  padding: "5px 6px",
                  textAlign: "right",
                  fontSize: 9,
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                Taxable
              </th>

              <th
                style={{
                  padding: "5px 6px",
                  textAlign: "right",
                  fontSize: 9,
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                CGST
              </th>

              <th
                style={{
                  padding: "5px 6px",
                  textAlign: "right",
                  fontSize: 9,
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                SGST
              </th>

              <th
                style={{
                  padding: "5px 6px",
                  textAlign: "right",
                  fontSize: 9,
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                GST
              </th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(gstBreakdown).map(([rate, vals]) => (
              <tr
                key={rate}
                style={{
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <td
                  style={{
                    padding: "5px 6px",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {rate}%
                </td>

                <td
                  style={{
                    padding: "5px 6px",
                    textAlign: "right",
                    fontSize: 10,
                  }}
                >
                  {formatCurrency(vals.taxable)}
                </td>

                <td
                  style={{
                    padding: "5px 6px",
                    textAlign: "right",
                    fontSize: 10,
                  }}
                >
                  {formatCurrency(vals.cgst)}
                </td>

                <td
                  style={{
                    padding: "5px 6px",
                    textAlign: "right",
                    fontSize: 10,
                  }}
                >
                  {formatCurrency(vals.sgst)}
                </td>

                <td
                  style={{
                    padding: "5px 6px",
                    textAlign: "right",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {formatCurrency(vals.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}
  </div>

  {/* RIGHT: TOTALS */}
  <div
    style={{
      width: 245,
      flexShrink: 0,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "4px 0",
        fontSize: 11,
      }}
    >
      <span style={{ color: "#64748b" }}>Subtotal</span>

      <span style={{ fontWeight: 600 }}>
        {formatCurrency(invoice.calculations.subtotal)}
      </span>
    </div>

    {Number(invoice.calculations.discountTotal || 0) > 0 && (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "4px 0",
          fontSize: 11,
        }}
      >
        <span style={{ color: "#64748b" }}>Discount</span>

        <span
          style={{
            fontWeight: 600,
            color: "#dc2626",
          }}
        >
          -{formatCurrency(invoice.calculations.discountTotal)}
        </span>
      </div>
    )}

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "4px 0",
        fontSize: 11,
      }}
    >
      <span style={{ color: "#64748b" }}>GST Total</span>

      <span style={{ fontWeight: 600 }}>
        {formatCurrency(invoice.calculations.gstTotal)}
      </span>
    </div>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "7px 0 4px",
        marginTop: 3,
        borderTop: "2px solid #0f172a",
        fontSize: 14,
        fontWeight: 800,
        color: "#0f172a",
      }}
    >
      <span>Grand Total</span>

      <span>
        {formatCurrency(invoice.calculations.grandTotal)}
      </span>
    </div>

    <div
      style={{
        marginTop: 3,
        fontSize: 9,
        fontStyle: "italic",
        color: "#64748b",
        lineHeight: 1.4,
      }}
    >
      {invoice.calculations.amountInWords}
    </div>
  </div>
</div>

{/* === PAYMENT SUMMARY === */}
<div
  style={{
    marginTop: 18,
    marginBottom: 20,
    padding: 16,
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    background: "#f8fafc",
  }}
>
  <div
    style={{
      fontSize: 10,
      fontWeight: 700,
      color: "#94a3b8",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      marginBottom: 10,
    }}
  >
    Payment Summary
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 12,
    }}
  >
    <div>
      <div style={{ fontSize: 10, color: "#64748b" }}>
        Grand Total
      </div>

      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#0f172a",
          marginTop: 2,
        }}
      >
        {formatCurrency(invoice.calculations.grandTotal)}
      </div>
    </div>

    <div>
      <div style={{ fontSize: 10, color: "#64748b" }}>
        Amount Received
      </div>

      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#059669",
          marginTop: 2,
        }}
      >
        {formatCurrency(invoice.amountPaid || 0)}
      </div>
    </div>

    <div>
      <div style={{ fontSize: 10, color: "#64748b" }}>
        Balance Due
      </div>

      <div
        style={{
          fontSize: 16,
          fontWeight: 800,
          color:
            Number(invoice.balanceDue || 0) > 0
              ? "#dc2626"
              : "#059669",
          marginTop: 2,
        }}
      >
        {formatCurrency(invoice.balanceDue || 0)}
      </div>
    </div>
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 14,
      paddingTop: 10,
      borderTop: "1px solid #e2e8f0",
      fontSize: 11,
    }}
  >
    <div>
      <span style={{ color: "#64748b" }}>
        Payment Status:{" "}
      </span>

      <span
        style={{
          fontWeight: 700,
          color:
            invoice.paymentStatus === "paid"
              ? "#059669"
              : invoice.paymentStatus === "partial"
              ? "#d97706"
              : "#dc2626",
          textTransform: "uppercase",
        }}
      >
        {invoice.paymentStatus === "credit"
          ? "Credit / Udhar"
          : invoice.paymentStatus === "partial"
          ? "Partial Payment"
          : "Paid"}
      </span>
    </div>

    {invoice.paymentMethod && (
      <div>
        <span style={{ color: "#64748b" }}>
          Payment Method:{" "}
        </span>

        <span
          style={{
            fontWeight: 700,
            color: "#334155",
          }}
        >
          {invoice.paymentMethod}
        </span>
      </div>
    )}
  </div>

  {Number(invoice.balanceDue || 0) > 0 && (
    <div
      style={{
        marginTop: 12,
        padding: "9px 12px",
        borderRadius: 6,
        background: "#fff7ed",
        color: "#9a3412",
        fontSize: 11,
        fontWeight: 600,
        textAlign: "center",
      }}
    >
      {invoice.paymentStatus === "partial"
        ? `${formatCurrency(invoice.amountPaid || 0)} received • ${formatCurrency(
            invoice.balanceDue || 0
          )} remaining`
        : `${formatCurrency(invoice.balanceDue || 0)} payment pending`}
      {" • "}Due by {formatDate(invoice.dueDate)}
    </div>
  )}
</div>

          {/* === UPI QR CODE === */}
          {upiQrString && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: '#f0fdf4', borderRadius: 8, padding: 16 }}>
                <QRCodeSVG value={upiQrString} size={90} level="M" />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>Pay via UPI</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>Scan to pay the remaining balance</div>
                  <div style={{ fontSize: 10, color: '#334155', fontWeight: 600, marginTop: 2 }}>UPI ID: {invoice.upiId}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 6 }}>Amount: {formatCurrency(qrPayableAmount)}</div>
                </div>
              </div>
            </div>
          )}

          {/* === NOTES & TERMS === */}
          {(invoice.notes || invoice.termsAndConditions) && (
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: invoice.notes && invoice.termsAndConditions ? '1fr 1fr' : '1fr', gap: 24 }}>
              {invoice.notes && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Notes</div>
                  <div style={{ fontSize: 11, color: '#475569', whiteSpace: 'pre-line' }}>{invoice.notes}</div>
                </div>
              )}
              {invoice.termsAndConditions && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Terms & Conditions</div>
                  <div style={{ fontSize: 11, color: '#475569', whiteSpace: 'pre-line' }}>{invoice.termsAndConditions}</div>
                </div>
              )}
            </div>
          )}
            <div style={{ marginTop: 30, textAlign: 'right' }}>
             <img
  src={invoice.company.signature || "/signature.png"}
               
               alt="Signature"
               style={{
                 height: 60,
                 width: 'auto',
                 display: 'block',
                 marginLeft: 'auto'
               }}
             />
           
             <div style={{
               fontSize: 11,
               fontWeight: 600,
               marginTop: 4
             }}>
               Authorized Signature
             </div>
           </div>
          {/* === FOOTER === */}
          <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          {/* === FOOTER === */}
<div
  style={{
    marginTop: 35,
    paddingTop: 18,
    borderTop: "1px solid #e2e8f0",
    textAlign: "center",
    color: "#64748b",
  }}
>
  <div
    style={{
      fontSize: 13,
      fontWeight: 700,
      color: "#0f172a",
      marginBottom: 6,
    }}
  >
    Thank you for your business!
  </div>

  <div
    style={{
      fontSize: 11,
      lineHeight: 1.8,
    }}
  >
    <strong style={{ color: "#10b981" }}>Generated using BillNova</strong>

    <br />

    Smart GST Billing Software

    <br />

    🌐 <span style={{ color: "#2563eb" }}>www.billnova.in</span>

    <br />

    ✉ support@billnova.in
  </div>

  <div
    style={{
      marginTop: 14,
      paddingTop: 10,
      borderTop: "1px dashed #cbd5e1",
      fontSize: 10,
      color: "#94a3b8",
    }}
  >
    This is a computer generated GST invoice.

    <br />

    No signature required.

    <br />

    © 2026 BillNova. All rights reserved.
  </div>
</div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}

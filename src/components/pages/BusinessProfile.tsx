

import type React from "react"
import { useMemo, useRef, useState } from "react"


/* ----------------------------------------------------------------------------
   BusinessProfile.tsx
   A premium, self-contained Business Profile page for the GST billing
   software "BillNova". Pure React + TypeScript + Tailwind. No external UI
   libraries, no shadcn, no Next.js specifics — copy-paste ready.
---------------------------------------------------------------------------- */

/* ----------------------------- Inline Icons ------------------------------- */
type IconProps = { className?: string }

const I = {
  Building: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  ),
  Hash: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
    </svg>
  ),
  Phone: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  ),
  Mail: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  ),
  Globe: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  ),
  Wallet: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
      <path d="M3 7h18a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-5a3 3 0 0 1 0-6h6" />
    </svg>
  ),
  MapPin: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Upload: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  ),
  Image: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </svg>
  ),
  Pen: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
  Trash: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
    </svg>
  ),
  Check: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  CheckCircle: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m22 4-10 10.01-3-3" />
    </svg>
  ),
  Sparkles: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  ),
  Lightbulb: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
    </svg>
  ),
  Reset: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
    </svg>
  ),
  Save: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8M7 3v5h8" />
    </svg>
  ),
  QR: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM21 14v7M17 21h4M14 21v.01" />
    </svg>
  ),
  Spinner: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
}

/* ------------------------------- Types ------------------------------------ */
type Fields = {
  companyName: string
  gst: string
  phone: string
  email: string
  website: string
  upi: string
  address: string
}

type FieldKey = keyof Fields

const INITIAL: Fields = {
  companyName: "",
  gst: "",
  phone: "",
  email: "",
  website: "",
  upi: "",
  address: "",
}

/* ----------------------------- Validation --------------------------------- */
function validate(values: Fields): Partial<Record<FieldKey, string>> {
  const e: Partial<Record<FieldKey, string>> = {}
  if (!values.companyName.trim()) e.companyName = "Company name is required"
  if (values.gst && !/^[0-9A-Z]{15}$/.test(values.gst.trim()))
    e.gst = "GST must be 15 characters (e.g. 29ABCDE1234F1Z5)"
  if (values.phone && !/^[0-9+\-\s()]{7,}$/.test(values.phone.trim()))
    e.phone = "Enter a valid phone number"
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    e.email = "Enter a valid email address"
  if (values.upi && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(values.upi.trim()))
    e.upi = "Enter a valid UPI ID (name@bank)"
  return e
}

/* =============================== Component ================================ */
export default function BusinessProfile() {
  const [values, setValues] = useState<Fields>(INITIAL)
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({})
  const [logo, setLogo] = useState<string | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [dragField, setDragField] = useState<"logo" | "signature" | null>(null)
  const [saving, setSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const logoInput = useRef<HTMLInputElement | null>(null)
const sigInput = useRef<HTMLInputElement | null>(null)

  const errors = useMemo(() => validate(values), [values])

  const completion = useMemo(() => {
    const checks = [
      values.companyName.trim().length > 0,
      values.gst.trim().length > 0,
      values.phone.trim().length > 0,
      values.email.trim().length > 0,
      values.website.trim().length > 0,
      values.upi.trim().length > 0,
      values.address.trim().length > 0,
      !!logo,
      !!signature,
    ]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
  }, [values, logo, signature])

  const setField = (key: FieldKey) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))

  const blur = (key: FieldKey) => () => setTouched((t) => ({ ...t, [key]: true }))

  const readFile = (file: File | undefined, set: (s: string) => void) => {
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = () => set(reader.result as string)
    reader.readAsDataURL(file)
  }

  const onDrop = (field: "logo" | "signature") => (e: React.DragEvent) => {
    e.preventDefault()
    setDragField(null)
    readFile(e.dataTransfer.files?.[0], field === "logo" ? setLogo : setSignature)
  }

  const handleSave = () => {
    setTouched({ companyName: true, gst: true, phone: true, email: true, upi: true })
    if (Object.keys(errors).length > 0) return
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3200)
    }, 1100)
  }

  const handleReset = () => {
    setValues(INITIAL)
    setTouched({})
    setLogo(null)
    setSignature(null)
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-800 antialiased">
      <style>{keyframes}</style>

      {/* Decorative top gradient field */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-emerald-100/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* ============================ HEADER ============================ */}
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/30">
              <I.Building className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Business Profile</h1>
                <span className="hidden rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 sm:inline">
                  BillNova
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">Manage your company information used on invoices.</p>
            </div>
          </div>

          {/* Completion widget */}
          <div className="w-full rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur lg:w-80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <I.Sparkles className="h-4 w-4 text-emerald-500" />
                Profile Completion
              </div>
              <span className="text-sm font-bold text-emerald-600">{completion}%</span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700 ease-out"
                style={{ width: `${completion}%` }}
              >
                <div className="absolute inset-0" style={shimmerStyle} />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {completion === 100 ? "All set — your profile is complete." : "Complete your profile for polished invoices."}
            </p>
          </div>
        </header>

        {/* ============================ GRID ============================ */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT COLUMN — forms */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Business Information */}
            <Card>
              <CardHeader
                icon={<I.Building className="h-5 w-5" />}
                title="Business Information"
                subtitle="Details that appear on every invoice you generate."
              />
              <div className="grid grid-cols-1 gap-5 p-6 pt-2 sm:grid-cols-2">
                <Field
                  className="sm:col-span-2"
                  label="Company Name"
                  required
                  icon={<I.Building className="h-4 w-4" />}
                  placeholder="Acme Enterprises Pvt. Ltd."
                  value={values.companyName}
                  onChange={setField("companyName")}
                  onBlur={blur("companyName")}
                  error={touched.companyName ? errors.companyName : undefined}
                  valid={!!values.companyName.trim()}
                />
                <Field
                  label="GST Number"
                  icon={<I.Hash className="h-4 w-4" />}
                  placeholder="29ABCDE1234F1Z5"
                  value={values.gst}
                  onChange={setField("gst")}
                  onBlur={blur("gst")}
                  error={touched.gst ? errors.gst : undefined}
                  valid={!!values.gst.trim() && !errors.gst}
                  uppercase
                />
                <Field
                  label="Phone Number"
                  icon={<I.Phone className="h-4 w-4" />}
                  placeholder="+91 98765 43210"
                  value={values.phone}
                  onChange={setField("phone")}
                  onBlur={blur("phone")}
                  error={touched.phone ? errors.phone : undefined}
                  valid={!!values.phone.trim() && !errors.phone}
                />
                <Field
                  label="Email Address"
                  icon={<I.Mail className="h-4 w-4" />}
                  placeholder="accounts@company.in"
                  value={values.email}
                  onChange={setField("email")}
                  onBlur={blur("email")}
                  error={touched.email ? errors.email : undefined}
                  valid={!!values.email.trim() && !errors.email}
                />
                <Field
                  label="Website"
                  icon={<I.Globe className="h-4 w-4" />}
                  placeholder="www.company.in"
                  value={values.website}
                  onChange={setField("website")}
                  onBlur={blur("website")}
                  valid={!!values.website.trim()}
                />
                <Field
                  className="sm:col-span-2"
                  label="UPI ID"
                  icon={<I.Wallet className="h-4 w-4" />}
                  placeholder="company@okbank"
                  value={values.upi}
                  onChange={setField("upi")}
                  onBlur={blur("upi")}
                  error={touched.upi ? errors.upi : undefined}
                  valid={!!values.upi.trim() && !errors.upi}
                  hint="Used to auto-generate a payment QR code on invoices."
                />
                <Field
                  as="textarea"
                  className="sm:col-span-2"
                  label="Business Address"
                  icon={<I.MapPin className="h-4 w-4" />}
                  placeholder="Street, City, State, PIN"
                  value={values.address}
                  onChange={setField("address")}
                  onBlur={blur("address")}
                  valid={!!values.address.trim()}
                />
              </div>
            </Card>

            {/* Brand Assets */}
            <Card>
              <CardHeader
                icon={<I.Image className="h-5 w-5" />}
                title="Brand Assets"
                subtitle="Upload your logo and authorized signature."
              />
              <div className="grid grid-cols-1 gap-5 p-6 pt-2 md:grid-cols-2">
                <UploadCard
                  title="Company Logo"
                  preview={logo}
                  previewBg="bg-slate-50"
                  dragging={dragField === "logo"}
                  onDrop={onDrop("logo")}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragField("logo")
                  }}
                  onDragLeave={() => setDragField(null)}
                  onPick={() => logoInput.current?.click()}
                  onReplace={() => logoInput.current?.click()}
                  onDelete={() => setLogo(null)}
                  inputRef={logoInput}
                  onFile={(f) => readFile(f, setLogo)}
                  emptyIcon={<I.Image className="h-7 w-7" />}
                  emptyHint="PNG, JPG or SVG up to 5MB"
                />
                <UploadCard
                  title="Authorized Signature"
                  preview={signature}
                  previewBg="checkerboard"
                  dragging={dragField === "signature"}
                  onDrop={onDrop("signature")}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragField("signature")
                  }}
                  onDragLeave={() => setDragField(null)}
                  onPick={() => sigInput.current?.click()}
                  onReplace={() => sigInput.current?.click()}
                  onDelete={() => setSignature(null)}
                  inputRef={sigInput}
                  onFile={(f) => readFile(f, setSignature)}
                  emptyIcon={<I.Pen className="h-7 w-7" />}
                  emptyHint="Transparent PNG recommended"
                />
              </div>
            </Card>

            {/* Business Tips */}
            <TipsCard />
          </div>

          {/* RIGHT COLUMN — sticky live preview */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <LivePreview values={values} logo={logo} signature={signature} />
            </div>
          </div>
        </div>

        {/* ============================ ACTIONS ============================ */}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-800 hover:shadow active:translate-y-0 sm:w-auto"
          >
            <I.Reset className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-emerald-500/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto"
          >
            {saving ? (
              <>
                <I.Spinner className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <I.Save className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                Save Business Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* ============================ TOAST ============================ */}
      <div
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
          showToast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-3.5 shadow-2xl shadow-emerald-500/20">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <I.CheckCircle className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Profile saved</p>
            <p className="text-xs text-slate-500">Your business details are now live on invoices.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================ Sub-components ============================== */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      {children}
    </section>
  )
}

function CardHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 p-6">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </span>
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  )
}

type FieldProps = {
  label: string
  icon: React.ReactNode
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: () => void
  placeholder?: string
  required?: boolean
  error?: string
  valid?: boolean
  hint?: string
  className?: string
  uppercase?: boolean
  as?: "input" | "textarea"
}

function Field({
  label,
  icon,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  error,
  valid,
  hint,
  className = "",
  uppercase,
  as = "input",
}: FieldProps) {
  const base =
    "peer w-full rounded-xl border bg-white py-2.5 pl-10 pr-9 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400"
  const state = error
    ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
    : "border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 hover:border-slate-300"

  return (
    <div className={className}>
      <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-emerald-500">*</span>}
      </label>
      <div className="relative">
        <span
          className={`pointer-events-none absolute left-3 top-3 text-slate-400 transition-colors duration-200 peer-focus:text-emerald-500 ${
            error ? "text-red-400" : ""
          }`}
        >
          {icon}
        </span>
        {as === "textarea" ? (
          <textarea
            rows={2}
            className={`${base} ${state} resize-none pt-2.5`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        ) : (
          <input
            className={`${base} ${state} ${uppercase ? "uppercase tracking-wide" : ""}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
        {valid && !error && as === "input" && (
          <span className="absolute right-3 top-3 text-emerald-500">
            <I.Check className="h-4 w-4" />
          </span>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
}

type UploadCardProps = {
  title: string
  preview: string | null
  previewBg: string
  dragging: boolean
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onPick: () => void
  onReplace: () => void
  onDelete: () => void
  inputRef: React.RefObject<HTMLInputElement>
  onFile: (f: File | undefined) => void
  emptyIcon: React.ReactNode
  emptyHint: string
}

function UploadCard({
  title,
  preview,
  previewBg,
  dragging,
  onDrop,
  onDragOver,
  onDragLeave,
  onPick,
  onReplace,
  onDelete,
  inputRef,
  onFile,
  emptyIcon,
  emptyHint,
}: UploadCardProps) {
  const isChecker = previewBg === "checkerboard"
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-slate-700">{title}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      {preview ? (
        <div className="group relative overflow-hidden rounded-xl border border-slate-200">
          <div
            className={`flex h-40 items-center justify-center p-4 ${isChecker ? "" : previewBg}`}
            style={isChecker ? checkerStyle : undefined}
          >
           
            <img
              src={preview || "/placeholder.svg"}
              alt={`${title} preview`}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/0 opacity-0 transition-all duration-300 group-hover:bg-slate-900/40 group-hover:opacity-100">
            <button
              type="button"
              onClick={onReplace}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-md transition hover:bg-slate-50"
            >
              <I.Upload className="h-3.5 w-3.5" /> Replace
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-red-600"
            >
              <I.Trash className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onPick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition-all duration-200 ${
            dragging
              ? "scale-[1.01] border-emerald-400 bg-emerald-50"
              : "border-slate-200 bg-slate-50/50 hover:border-emerald-300 hover:bg-emerald-50/40"
          }`}
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              dragging ? "bg-emerald-100 text-emerald-600" : "bg-white text-slate-400 shadow-sm"
            }`}
          >
            {emptyIcon}
          </span>
          <span className="text-sm font-medium text-slate-600">
            <span className="text-emerald-600">Click to upload</span> or drag &amp; drop
          </span>
          <span className="text-xs text-slate-400">{emptyHint}</span>
        </button>
      )}
    </div>
  )
}

function TipsCard() {
  const tips = [
    "Upload a transparent PNG logo for crisp invoices",
    "A valid GST number improves client trust",
    "Your signature appears on every invoice",
    "A payment QR code is generated from your UPI ID",
  ]
  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-emerald-100/70 p-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
          <I.Lightbulb className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Business Tips</h2>
          <p className="text-sm text-slate-500">Get the most out of your profile.</p>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
        {tips.map((tip) => (
          <li
            key={tip}
            className="flex items-start gap-3 rounded-xl bg-white/70 p-3 ring-1 ring-emerald-100/60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <I.Check className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm leading-relaxed text-slate-600">{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function LivePreview({ values, logo, signature }: { values: Fields; logo: string | null; signature: string | null }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <I.Sparkles className="h-4 w-4 text-emerald-500" />
          Live Invoice Preview
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live
        </span>
      </div>

      <div className="p-5">
        <div className="rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50/50 to-white p-5 shadow-inner">
          {/* Top row: logo + INVOICE */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo || "/placeholder.svg"} alt="Company logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <I.Image className="h-6 w-6 text-slate-300" />
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold tracking-widest text-emerald-600">INVOICE</p>
              <p className="text-xs text-slate-400">#INV-2026-0042</p>
            </div>
          </div>

          {/* Company name + address */}
          <div className="mt-4">
            <h3 className="text-balance text-base font-bold leading-tight text-slate-900">
              {values.companyName || "Your Company Name"}
            </h3>
            <p className="mt-1 text-pretty text-xs leading-relaxed text-slate-500">
              {values.address || "Your business address will appear here"}
            </p>
          </div>

          {/* Detail rows */}
          <div className="mt-4 grid grid-cols-1 gap-2 border-t border-dashed border-slate-200 pt-4 text-xs">
            <PreviewRow icon={<I.Hash className="h-3.5 w-3.5" />} label="GSTIN" value={values.gst} />
            <PreviewRow icon={<I.Phone className="h-3.5 w-3.5" />} label="Phone" value={values.phone} />
            <PreviewRow icon={<I.Mail className="h-3.5 w-3.5" />} label="Email" value={values.email} />
            <PreviewRow icon={<I.Globe className="h-3.5 w-3.5" />} label="Website" value={values.website} />
            <PreviewRow icon={<I.Wallet className="h-3.5 w-3.5" />} label="UPI" value={values.upi} />
          </div>

          {/* Footer: signature + QR */}
          <div className="mt-5 flex items-end justify-between gap-4 border-t border-dashed border-slate-200 pt-4">
            <div>
              <div
                className="flex h-12 w-28 items-center justify-center overflow-hidden rounded-md"
                style={signature ? checkerStyle : undefined}
              >
                {signature ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={signature || "/placeholder.svg"} alt="Signature" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="font-serif text-sm italic text-slate-300">Signature</span>
                )}
              </div>
              <p className="mt-1 border-t border-slate-300 pt-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Authorized Signatory
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-300">
                <I.QR className="h-8 w-8" />
              </div>
              <span className="text-[10px] text-slate-400">Scan to pay</span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">This is how your invoice header will look to clients.</p>
      </div>
    </section>
  )
}

function PreviewRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-slate-400">
        {icon}
        {label}
      </span>
      <span className={`font-medium ${value ? "text-slate-700" : "text-slate-300"}`}>{value || "—"}</span>
    </div>
  )
}

/* ------------------------------- Styles ----------------------------------- */
const checkerStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg,#e2e8f0 25%,transparent 25%),linear-gradient(-45deg,#e2e8f0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e2e8f0 75%),linear-gradient(-45deg,transparent 75%,#e2e8f0 75%)",
  backgroundSize: "12px 12px",
  backgroundPosition: "0 0,0 6px,6px -6px,-6px 0",
  backgroundColor: "#f8fafc",
}

const shimmerStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
  animation: "bp-shimmer 2s infinite",
}

const keyframes = `
@keyframes bp-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`

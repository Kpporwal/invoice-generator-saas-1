import { useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import { FileText, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';

type AuthView = 'login'  | 'forgot';

export default function AuthScreens() {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { signIn, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      if (view === 'login') {
  const { error: err } = await signIn(email, password);
  if (err) setError(err);
} else {
  const { error: err } = await resetPassword(email);
  if (err) setError(err);
  else setSuccess('Password reset email sent! Check your inbox.');
}
    } finally {
      setSubmitting(false);
    }
  };

  const switchView = (v: AuthView) => {
    setView(v);
    setError(null);
    setSuccess(null);
  };

  const inputClass = "w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white";

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">BillNova</h1>
              <p className="text-sm text-emerald-300">Smart GST Billing Software</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Professional invoicing,<br />
            <span className="text-emerald-400">simplified.</span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed max-w-md">
            Create, manage, and track GST-compliant invoices with ease. Generate PDFs, accept UPI payments, and stay organized.
          </p>
          <div className="mt-10 space-y-4">
            {['Indian GST invoice format', 'UPI QR code payments', 'PDF download & print'].map((feat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <span className="text-slate-300 text-sm">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
              <FileText size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">BillNova</h1>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            {/* Header */}
            <div className="mb-6">
              {view === 'forgot' && (
                <button
                  onClick={() => switchView('login')}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to sign in
                </button>
              )}
              <h2 className="text-xl font-bold text-slate-800">
                {view === 'login' && 'Welcome back'}
            
                {view === 'forgot' && 'Reset password'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {view === 'login' && 'Sign in to manage your invoices'}
              
                {view === 'forgot' && 'Enter your email to receive a reset link'}
              </p>
            </div>

            {/* Error / Success */}
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {view !== 'forgot' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className={inputClass}
                      placeholder="Min 6 characters"
                      required
                      minLength={6}
                      autoComplete="current-password"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {view === 'login' && 'Sign In'}
                
                {view === 'forgot' && 'Send Reset Link'}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-sm text-slate-500">
              {view === 'login' && (
  <button
    onClick={() => switchView('forgot')}
    className="text-emerald-600 hover:text-emerald-700 font-medium"
  >
    Forgot password?
  </button>
)}
              {view === 'forgot' && (
                <span>
                  Remember your password?{' '}
                  <button onClick={() => switchView('login')} className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

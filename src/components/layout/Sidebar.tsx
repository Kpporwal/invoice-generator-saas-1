import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Clock,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

type Page =
  | 'dashboard'
  | 'create'
  | 'history'
  | 'preview'
  | 'reports'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'contact';
interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onSignOut: () => Promise<void>;
}

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'create', label: 'Create Invoice', icon: PlusCircle },
  { id: 'history', label: 'Invoice History', icon: Clock },
  {
  id: 'reports',
  label: 'Reports',
  icon: BarChart3,
  
},
{ id: 'about', label: 'About', icon: FileText },
{ id: 'privacy', label: 'Privacy Policy', icon: FileText },
{ id: 'terms', label: 'Terms & Conditions', icon: FileText },
{ id: 'contact', label: 'Contact', icon: FileText },
];

export default function Sidebar({ currentPage, onNavigate, onSignOut }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const handleSignOut = async () => {
    setMobileOpen(false);
    await onSignOut();
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <FileText size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 tracking-tight">BillNova</h1>
              <p className="text-[11px] text-slate-400 font-medium">Smart GST Billing Software</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'} />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight size={14} className="text-emerald-500" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-100 space-y-3">
          {/* User info */}
          <div className="px-3 py-2.5 bg-slate-50 rounded-lg">
            <p className="text-xs font-medium text-slate-700 truncate">{user?.email}</p>
            <p className="text-[11px] text-slate-400">Authenticated</p>
          </div>

          {/* Pro Tip */}
          <div className="px-3 py-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg">
            <p className="text-xs font-semibold text-emerald-800">Pro Tip</p>
            <p className="text-[11px] text-emerald-600 mt-1 leading-relaxed">
              Use the duplicate feature to quickly create recurring invoices.
            </p>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
          >
            <LogOut size={18} className="text-slate-400 group-hover:text-red-500" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

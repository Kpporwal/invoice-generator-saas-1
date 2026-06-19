import About from './components/pages/About';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import TermsConditions from './components/pages/TermsConditions';
import Contact from './components/pages/Contact';
import { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './store/AuthContext';
import { InvoiceProvider } from './store/InvoiceContext';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import InvoiceForm from './components/invoice/InvoiceForm';
import InvoiceHistory from './components/invoice/InvoiceHistory';
import InvoicePreview from './components/invoice/InvoicePreview';
import Reports from './components/reports/Reports';
import BusinessProfile from "./components/pages/BusinessProfile";
import AuthScreens from './components/auth/AuthScreens';
import type { Invoice } from './types';
import { Loader2 } from 'lucide-react';


type Page =
  | "dashboard"
  | "create"
  | "history"
  | "preview"
  | "reports"
  | "business-profile"
  | "about"
  | "privacy"
  | "terms"
  | "contact";

function AppContent() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreens />;
  }

  return (
    <InvoiceProvider>
      <AppShell onSignOut={signOut} />
    </InvoiceProvider>
  );
}

function AppShell({ onSignOut }: { onSignOut: () => Promise<void> }) {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [duplicatingInvoice, setDuplicatingInvoice] = useState<Invoice | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  const handleNavigate = useCallback((page: Page) => {
  setCurrentPage(page);

  if (page !== 'preview') {
    setPreviewInvoice(null);
  }

  if (page === 'create') {
    setEditingInvoice(null);
    setDuplicatingInvoice(null);
  }
}, []);

  const handleEdit = useCallback((invoice: Invoice) => {
    setEditingInvoice(invoice);
    setDuplicatingInvoice(null);
    setCurrentPage('create');
  }, []);

  const handleDuplicate = useCallback((invoice: Invoice) => {
    setDuplicatingInvoice(invoice);
    setEditingInvoice(null);
    setCurrentPage('create');
  }, []);

  const handlePreview = useCallback((invoice: Invoice) => {
    setPreviewInvoice(invoice);
    setCurrentPage('preview');
  }, []);

  const renderPage = () => {
    switch (currentPage)
     {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'create':
        return (
          <InvoiceForm
            onNavigate={handleNavigate}
            onPreview={handlePreview}
            editingInvoice={editingInvoice}
            duplicatingInvoice={duplicatingInvoice}
          />
        );
      case 'history':
        return (
          <InvoiceHistory
            onNavigate={handleNavigate}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onPreview={handlePreview}
          />
        );
      case 'preview':
        return (
          <InvoicePreview
            invoice={previewInvoice}
            onNavigate={handleNavigate}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
          />
        );
        case 'reports':
  return (
    <Reports />
  );
  case 'business-profile':
  return <BusinessProfile />;
  
  case 'about':
  return <About />;

case 'privacy':
  return <PrivacyPolicy />;

case 'terms':
  return <TermsConditions />;

case 'contact':
  return <Contact />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };
  

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} onSignOut={onSignOut} />
      <div className="flex-1 flex flex-col min-w-0">
        {renderPage()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

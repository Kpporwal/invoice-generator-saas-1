import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { Invoice, DashboardStats } from '../types';
import { calculateInvoice } from '../utils/calculations';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';


interface InvoiceStore {
  invoices: Invoice[];
  loading: boolean;
  addInvoice: (invoice: Invoice) => Promise<{ error: string | null }>;
  updateInvoice: (invoice: Invoice) => Promise<{ error: string | null }>;
  deleteInvoice: (id: string) => Promise<{ error: string | null }>;
  getInvoice: (id: string) => Invoice | undefined;
  getStats: () => DashboardStats;
}

const InvoiceContext = createContext<InvoiceStore | null>(null);

function mapRowToInvoice(row: Record<string, unknown>): Invoice {
  return {
    id: row.id as string,
    invoiceNumber: row.invoice_number as string,
    company: row.company as Invoice['company'],
    customer: row.customer as Invoice['customer'],
    items: row.items as Invoice['items'],
    calculations: row.calculations as Invoice['calculations'],
    invoiceDate: row.invoice_date as string,
    dueDate: row.due_date as string,
    notes: (row.notes as string) ?? '',
    termsAndConditions: (row.terms_and_conditions as string) ?? '',
    upiId: (row.upi_id as string) ?? '',
    status: row.status as Invoice["status"],

paymentStatus:
  (row.payment_status as Invoice["paymentStatus"]) ?? "credit",

amountPaid:
  Number(row.amount_paid || 0),

balanceDue:
  Number(
    row.balance_due ??
      (row.calculations as Invoice["calculations"])?.grandTotal ??
      0
  ),

paymentMethod:
  (row.payment_method as string) || null,

createdAt: row.created_at as string,

    updatedAt: row.updated_at as string,
  };
}

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const subscribedRef = useRef(false);

  // Fetch all invoices from Supabase
  const fetchInvoices = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
  .from("invoices")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

    if (error) {
      console.error('Failed to load invoices:', error);
    } else if (data) {
      setInvoices(data.map(mapRowToInvoice));
    }
    setLoading(false);
  }, [user]);

  // Initial fetch + realtime subscription
  useEffect(() => {
    if (!user) {
      setInvoices([]);
      setLoading(false);
      return;
    }

    fetchInvoices();

    if (!subscribedRef.current) {
      subscribedRef.current = true;
      const channel = supabase
        .channel('invoices-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'invoices', filter: `user_id=eq.${user.id}` },
          () => {
            fetchInvoices();
          }
        )
        .subscribe();

      return () => {
        subscribedRef.current = false;
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchInvoices]);

  const addInvoice = useCallback(async (invoice: Invoice): Promise<{ error: string | null }> => {
    const withCalculations: Invoice = {
      ...invoice,
      calculations: calculateInvoice(invoice.items),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  return { error: "User not logged in" };
}

const row = {
  user_id: user.id,

  invoice_number: withCalculations.invoiceNumber,
  company: withCalculations.company,
  customer: withCalculations.customer,
  items: withCalculations.items,
  calculations: withCalculations.calculations,
  invoice_date: withCalculations.invoiceDate,
  due_date: withCalculations.dueDate,
  notes: withCalculations.notes,
  terms_and_conditions: withCalculations.termsAndConditions,
  upi_id: withCalculations.upiId,
  status: withCalculations.status,
  payment_status: withCalculations.paymentStatus,
amount_paid: withCalculations.amountPaid,
balance_due: withCalculations.balanceDue,
payment_method: withCalculations.paymentMethod,
};


    const { data, error } = await supabase.from('invoices').insert(row).select().maybeSingle();
    if (error) {
      console.error('Failed to insert invoice:', error);
      return { error: error.message };
    }
    if (data) {
      setInvoices(prev => [mapRowToInvoice(data), ...prev]);
    }
    return { error: null };
  }, []);

  const updateInvoice = useCallback(async (invoice: Invoice): Promise<{ error: string | null }> => {
    const withCalculations: Invoice = {
      ...invoice,
      calculations: calculateInvoice(invoice.items),
      updatedAt: new Date().toISOString(),
    };

    const row = {


  invoice_number: withCalculations.invoiceNumber,
  company: withCalculations.company,
  customer: withCalculations.customer,
  items: withCalculations.items,
  calculations: withCalculations.calculations,
  invoice_date: withCalculations.invoiceDate,
  due_date: withCalculations.dueDate,
  notes: withCalculations.notes,
  terms_and_conditions: withCalculations.termsAndConditions,
  upi_id: withCalculations.upiId,
  status: withCalculations.status,
  payment_status: withCalculations.paymentStatus,
amount_paid: withCalculations.amountPaid,
balance_due: withCalculations.balanceDue,
payment_method: withCalculations.paymentMethod,
};

    const { data, error } = await supabase.from('invoices').update(row).eq('id', invoice.id).select().maybeSingle();
    if (error) {
      console.error('Failed to update invoice:', error);
      return { error: error.message };
    }
    if (data) {
      setInvoices(prev => prev.map(i => i.id === invoice.id ? mapRowToInvoice(data) : i));
    }
    return { error: null };
  }, []);

  const deleteInvoice = useCallback(async (id: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete invoice:', error);
      return { error: error.message };
    }
    setInvoices(prev => prev.filter(i => i.id !== id));
    return { error: null };
  }, []);

  const getInvoice = useCallback((id: string) => {
    return invoices.find(i => i.id === id);
  }, [invoices]);

  const getStats = useCallback((): DashboardStats => {
    const totalRevenue = invoices.reduce((sum, i) => sum + i.calculations.grandTotal, 0);
    return {
      totalInvoices: invoices.length,
      totalRevenue,
      paidInvoices: invoices.filter(i => i.status === 'paid').length,
      pendingInvoices: invoices.filter(i => i.status === 'sent').length,
      overdueInvoices: invoices.filter(i => i.status === 'overdue').length,
      draftInvoices: invoices.filter(i => i.status === 'draft').length,
    };
  }, [invoices]);

  return (
    <InvoiceContext.Provider value={{ invoices, loading, addInvoice, updateInvoice, deleteInvoice, getInvoice, getStats }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoiceStore() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error('useInvoiceStore must be used within InvoiceProvider');
  return ctx;
}

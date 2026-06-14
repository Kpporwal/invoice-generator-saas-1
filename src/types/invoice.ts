export interface Company {
  name: string;
  address: string;
  gstNumber: string;
  logo: string | null;
}

export interface Customer {
  name: string;
  address: string;
  gstNumber: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  gstPercent: number;
}

export interface InvoiceCalculations {
  subtotal: number;
  gstTotal: number;
  grandTotal: number;
  amountInWords: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  company: Company;
  customer: Customer;
  items: InvoiceItem[];
  calculations: InvoiceCalculations;
  invoiceDate: string;
  dueDate: string;
  notes: string;
  termsAndConditions: string;
  upiId: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalInvoices: number;
  totalRevenue: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  draftInvoices: number;
}

export type InvoiceFormData = Omit<Invoice, 'id' | 'calculations' | 'createdAt' | 'updatedAt'>;

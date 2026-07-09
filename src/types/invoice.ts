export interface Company {
  name: string;
  address: string;
  gstNumber: string;

  phone: string;
  email: string;
  website: string;
  upiId: string;

  logo: string | null;
  signature: string | null;
}

export interface Customer {
  name: string;
  address: string;
  gstNumber: string;
  whatsappNumber: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description: string;

  hsnSac?: string;
  unit?: string;

  quantity: number;
  rate: number;
  gstPercent: number;
  discount: number;
}

export interface InvoiceCalculations {
  subtotal: number;
  discountTotal: number;
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
  paymentStatus: 'credit' | 'paid' | 'partial';
amountPaid: number;
balanceDue: number;
paymentMethod: string | null;
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

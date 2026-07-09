export interface Customer {
  id?: string;
  user_id: string;

  customer_name: string;
  phone?: string;
  address?: string;
  gst_number?: string;

  opening_balance: number;
  outstanding: number;

  total_purchase: number;
  total_paid: number;

  last_purchase_date?: string;
  last_payment_date?: string;

  last_invoice_number?: string;
  last_invoice_date?: string;
  last_invoice_due_date?: string;

  notes?: string;

  created_at?: string;
  updated_at?: string;
}
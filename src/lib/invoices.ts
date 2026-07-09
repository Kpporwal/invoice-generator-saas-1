import { supabase } from "./supabase";

export interface CreateInvoiceData {
  user_id: string;
  invoice_number: string;

  customer_name: string;
  customer_address?: string;
  customer_gst_number?: string;
  customer_phone?: string;

  invoice_date: string;
  due_date: string;

  subtotal: number;
  gst_total: number;
  grand_total: number;

    payment_status: "credit" | "partial" | "paid";
  amount_paid: number;
  balance_due: number;
  payment_method?: string | null;

  status: string;
  notes?: string;
  terms_and_conditions?: string;
}

export async function createInvoice(data: CreateInvoiceData) {
  return await supabase
    .from("invoices")
    .insert(data)
    .select()
    .single();
}
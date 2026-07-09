import { supabase } from "./supabase";

export async function getCustomerLedger(customerId: string) {
  return await supabase
    .from("customer_ledger")
    .select("*")
    .eq("customer_id", customerId)
    .order("entry_date", { ascending: false });
}

export async function addLedgerEntry(entry: {
  user_id: string;
  customer_id: string;
  entry_type: "opening_balance" | "invoice" | "payment" | "adjustment";
  amount: number;
  description?: string;
  invoice_id?: string | null;
  payment_method?: string | null;
}) {
  return await supabase
    .from("customer_ledger")
    .insert(entry)
    .select()
    .single();
}

export async function deleteLedgerEntry(id: string) {
  return await supabase
    .from("customer_ledger")
    .delete()
    .eq("id", id);
}

export async function getCollectedToday(userId: string) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("customer_ledger")
    .select("amount")
    .eq("user_id", userId)
    .eq("entry_type", "payment")
    .gte("entry_date", startOfToday.toISOString())
    .lte("entry_date", endOfToday.toISOString());

  if (error) {
    console.error("Collected today error:", error);
    return { total: 0, error };
  }

  const total = (data || []).reduce(
    (sum, entry) => sum + Number(entry.amount || 0),
    0
  );

  return { total, error: null };
}
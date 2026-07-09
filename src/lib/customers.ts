import { supabase } from "./supabase";

export async function getCustomers(userId: string) {
  return await supabase
    .from("customers")
    .select("*")
    .eq("user_id", userId)
    .order("customer_name");
}

export async function addCustomer(customer: any) {
  return await supabase
    .from("customers")
    .insert(customer)
    .select()
    .single();
}

export async function updateCustomer(id: string, customer: any) {
  return await supabase
    .from("customers")
    .update(customer)
    .eq("id", id)
    .select()
    .single();
}

export async function deleteCustomer(id: string) {
  return await supabase
    .from("customers")
    .delete()
    .eq("id", id);
}

export async function getCustomer(id: string) {
  return await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();
}
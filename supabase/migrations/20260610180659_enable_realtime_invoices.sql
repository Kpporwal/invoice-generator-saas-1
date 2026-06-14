/*
# Enable Supabase Realtime on invoices table

1. Changes
   - Add the `invoices` table to the `supabase_realtime` publication so that
     INSERT, UPDATE, DELETE events are broadcast to subscribed clients.
   - This enables the `supabase.channel('invoices-changes').on('postgres_changes', ...)` 
     subscription in the frontend InvoiceContext to receive live updates.

2. Security
   - No RLS changes. Realtime respects RLS: clients only receive events for rows
     they can SELECT (i.e., rows where auth.uid() = user_id).
*/

ALTER PUBLICATION supabase_realtime ADD TABLE invoices;

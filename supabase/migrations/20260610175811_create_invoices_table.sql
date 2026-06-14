/*
# Create invoices table for multi-user InvoicePro app

1. New Tables
   - `invoices`
     - `id` (uuid, primary key) — unique invoice identifier
     - `user_id` (uuid, not null, defaults to auth.uid()) — owner of the invoice, FK to auth.users
     - `invoice_number` (text, not null) — human-readable invoice number (e.g. INV-2606-0001)
     - `company` (jsonb, not null) — company details: name, address, gst_number, logo
     - `customer` (jsonb, not null) — customer details: name, address, gst_number
     - `items` (jsonb, not null) — array of line items: id, name, description, quantity, rate, gst_percent
     - `calculations` (jsonb, not null) — computed totals: subtotal, gst_total, grand_total, amount_in_words
     - `invoice_date` (date, not null) — date on the invoice
     - `due_date` (date, not null) — payment due date
     - `notes` (text) — optional notes section
     - `terms_and_conditions` (text) — optional T&C section
     - `upi_id` (text) — optional UPI ID for QR code payment
     - `status` (text, not null, default 'draft') — one of: draft, sent, paid, overdue
     - `created_at` (timestamptz) — row creation timestamp
     - `updated_at` (timestamptz) — row update timestamp

2. Security
   - Enable RLS on `invoices`.
   - Four separate owner-scoped policies (SELECT, INSERT, UPDATE, DELETE).
   - All policies restrict to `authenticated` role only.
   - INSERT policy relies on `DEFAULT auth.uid()` on `user_id` so client inserts omitting `user_id` succeed.

3. Indexes
   - Index on `user_id` for fast owner-scoped queries.
   - Index on `invoice_number` for search lookups.
*/

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number text NOT NULL,
  company jsonb NOT NULL DEFAULT '{}',
  customer jsonb NOT NULL DEFAULT '{}',
  items jsonb NOT NULL DEFAULT '[]',
  calculations jsonb NOT NULL DEFAULT '{}',
  invoice_date date NOT NULL DEFAULT current_date,
  due_date date NOT NULL DEFAULT (current_date + interval '30 days'),
  notes text DEFAULT '',
  terms_and_conditions text DEFAULT '',
  upi_id text DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_invoices" ON invoices;
CREATE POLICY "select_own_invoices" ON invoices FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_invoices" ON invoices;
CREATE POLICY "insert_own_invoices" ON invoices FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_invoices" ON invoices;
CREATE POLICY "update_own_invoices" ON invoices FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_invoices" ON invoices;
CREATE POLICY "delete_own_invoices" ON invoices FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);

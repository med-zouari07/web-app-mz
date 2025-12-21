/*
  # Create Donations Table for Payment Processing

  1. New Tables
    - `donations` - Store donation records with payment status
      - `id` (uuid, primary key)
      - `order_id` (text, unique - order identifier from payment gateway)
      - `amount` (decimal)
      - `currency` (text, default 'MAD')
      - `donor_name` (text)
      - `donor_email` (text)
      - `donor_phone` (text)
      - `campaign_id` (text - which campaign the donation is for)
      - `message` (text, optional donor message)
      - `status` (text - pending, completed, failed)
      - `payment_method` (text - default 'cmi')
      - `transaction_id` (text - CMI transaction ID)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on donations table
    - Add policy for public inserts (creating donations)
    - Add policy for reading all donations
    - Add policy for backend updates

  3. Indexes
    - Index on order_id for fast lookups
    - Index on status for filtering
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text UNIQUE NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'MAD',
  donor_name text NOT NULL,
  donor_email text NOT NULL,
  donor_phone text NOT NULL,
  campaign_id text,
  message text,
  status text DEFAULT 'pending',
  payment_method text DEFAULT 'cmi',
  transaction_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_donations_order_id ON donations(order_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(donor_email);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create donations"
  ON donations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view donations"
  ON donations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can update donations"
  ON donations
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

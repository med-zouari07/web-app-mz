/*
  # Create Activities and Contact Messages Tables

  1. New Tables
    - `activities` - Store custom activities that admins can create
      - `id` (uuid, primary key)
      - `title_en`, `title_fr`, `title_ar` (text, activity titles in different languages)
      - `description_en`, `description_fr`, `description_ar` (text, activity descriptions)
      - `image` (text, URL to activity image)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      
    - `contact_messages` - Store contact form submissions
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `created_at` (timestamp)
      - `read` (boolean, default false)

  2. Security
    - Enable RLS on both tables
    - Add public policy for reading activities
    - Add public policy for inserting contact messages
*/

CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_fr text NOT NULL,
  title_ar text NOT NULL,
  description_en text NOT NULL,
  description_fr text NOT NULL,
  description_ar text NOT NULL,
  image text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view activities"
  ON activities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

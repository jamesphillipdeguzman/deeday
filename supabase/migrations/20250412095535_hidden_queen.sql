/*
  # Create Family Members Table

  1. New Tables
    - `family_members`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `birthdate` (date)
      - `relationship` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `family_members` table
    - Add policies for authenticated users to:
      - Read their own family members
      - Create new family members
      - Update their own family members
      - Delete their own family members
*/

CREATE TABLE family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  birthdate date NOT NULL,
  relationship text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own family members"
  ON family_members
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create family members"
  ON family_members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own family members"
  ON family_members
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own family members"
  ON family_members
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
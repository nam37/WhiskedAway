/*
  # Bakery Content Management System Schema

  1. New Tables
    - `bakery_about` - Stores the "About the Baker" content
    - `bakery_bakes` - Stores the "Best Bakes" entries with images
    - `bakery_recipes` - Stores the "Favorite Recipes" entries
    - `bakery_settings` - General site settings and configuration

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
    - Public read access for website content
*/

-- Create bakery_about table for "About the Baker" content
CREATE TABLE IF NOT EXISTS bakery_about (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  baker_name text,
  baker_image_url text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES profiles(id)
);

ALTER TABLE bakery_about ENABLE ROW LEVEL SECURITY;

-- Create bakery_bakes table for "Best Bakes" entries
CREATE TABLE IF NOT EXISTS bakery_bakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  updated_by uuid REFERENCES profiles(id)
);

ALTER TABLE bakery_bakes ENABLE ROW LEVEL SECURITY;

-- Create bakery_recipes table for "Favorite Recipes" entries
CREATE TABLE IF NOT EXISTS bakery_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  ingredients text,
  instructions text,
  prep_time_minutes integer,
  cook_time_minutes integer,
  servings integer,
  difficulty_level text DEFAULT 'medium',
  category text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  updated_by uuid REFERENCES profiles(id)
);

ALTER TABLE bakery_recipes ENABLE ROW LEVEL SECURITY;

-- Create bakery_settings table for general site configuration
CREATE TABLE IF NOT EXISTS bakery_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text,
  description text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES profiles(id)
);

ALTER TABLE bakery_settings ENABLE ROW LEVEL SECURITY;

-- Add constraint for difficulty levels
ALTER TABLE bakery_recipes 
ADD CONSTRAINT bakery_recipes_difficulty_check 
CHECK (difficulty_level IN ('easy', 'medium', 'hard'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS bakery_bakes_display_order_idx ON bakery_bakes(display_order);
CREATE INDEX IF NOT EXISTS bakery_bakes_featured_idx ON bakery_bakes(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS bakery_bakes_active_idx ON bakery_bakes(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS bakery_recipes_featured_idx ON bakery_recipes(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS bakery_recipes_active_idx ON bakery_recipes(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS bakery_recipes_category_idx ON bakery_recipes(category);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_bakery_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bakery_about_updated_at BEFORE UPDATE ON bakery_about FOR EACH ROW EXECUTE PROCEDURE update_bakery_updated_at_column();
CREATE TRIGGER update_bakery_bakes_updated_at BEFORE UPDATE ON bakery_bakes FOR EACH ROW EXECUTE PROCEDURE update_bakery_updated_at_column();
CREATE TRIGGER update_bakery_recipes_updated_at BEFORE UPDATE ON bakery_recipes FOR EACH ROW EXECUTE PROCEDURE update_bakery_updated_at_column();
CREATE TRIGGER update_bakery_settings_updated_at BEFORE UPDATE ON bakery_settings FOR EACH ROW EXECUTE PROCEDURE update_bakery_updated_at_column();

-- RLS Policies

-- Public read access for website content
CREATE POLICY "Anyone can view active bakes"
  ON bakery_bakes FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can view active recipes"
  ON bakery_recipes FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can view about content"
  ON bakery_about FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view settings"
  ON bakery_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin management policies (employees can manage content)
CREATE POLICY "Employees can manage bakes"
  ON bakery_bakes FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'employee'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'employee'
  ));

CREATE POLICY "Employees can manage recipes"
  ON bakery_recipes FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'employee'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'employee'
  ));

CREATE POLICY "Employees can manage about content"
  ON bakery_about FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'employee'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'employee'
  ));

CREATE POLICY "Employees can manage settings"
  ON bakery_settings FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'employee'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'employee'
  ));
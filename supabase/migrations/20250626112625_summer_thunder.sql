/*
  # Add Full Recipe Field

  1. Schema Changes
    - Add `full_recipe` text field to `bakery_recipes` table
    - This will store the complete recipe content

  2. Purpose
    - Allow storing complete recipe details
    - Enable modal display of full recipes
*/

-- Add full_recipe field to bakery_recipes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bakery_recipes' AND column_name = 'full_recipe'
  ) THEN
    ALTER TABLE bakery_recipes ADD COLUMN full_recipe text;
  END IF;
END $$;
-- Add missing columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update existing profiles with empty values for new columns
UPDATE public.profiles
SET 
  company = '',
  role = '',
  phone = ''
WHERE company IS NULL OR role IS NULL OR phone IS NULL; 
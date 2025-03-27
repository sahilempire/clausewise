-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;

-- Add insert policy for user_settings
CREATE POLICY "Users can insert their own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Grant insert permission to authenticated users
GRANT INSERT ON public.user_settings TO authenticated; 
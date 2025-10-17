-- Fix security linter issues

-- 1. Add RLS policies for user_roles table
-- Only admins and system can modify roles
CREATE POLICY "Anyone can view roles" ON user_roles FOR SELECT USING (true);
CREATE POLICY "Only system can insert roles" ON user_roles FOR INSERT WITH CHECK (false);
CREATE POLICY "Only system can update roles" ON user_roles FOR UPDATE USING (false);
CREATE POLICY "Only system can delete roles" ON user_roles FOR DELETE USING (false);

-- 2. Fix function search_path for update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
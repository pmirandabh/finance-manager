-- Fix RLS policy for inserting logs
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can insert logs" ON system_logs;

-- Create new policy that allows authenticated users to insert their own logs
CREATE POLICY "Users can insert logs" 
ON system_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Also allow admins to insert any log
CREATE POLICY "Admins can insert any log" 
ON system_logs FOR INSERT 
WITH CHECK (
    auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin' OR email = 'admin@financemanager.com'
    )
);

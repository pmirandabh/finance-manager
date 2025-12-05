-- Create system_logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('INFO', 'WARN', 'ERROR', 'CRITICAL')),
    category TEXT NOT NULL CHECK (category IN ('AUTH', 'DATA', 'SYSTEM', 'ADMIN')),
    action TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT
);

-- Enable RLS
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all logs
CREATE POLICY "Admins can view all logs" 
ON system_logs FOR SELECT 
USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin' OR email = 'admin@financemanager.com'
    )
);

-- Policy: Authenticated users can insert logs (for their own actions)
CREATE POLICY "Users can insert logs" 
ON system_logs FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_category ON system_logs(category);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);

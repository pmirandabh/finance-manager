-- Add description column to system_logs
ALTER TABLE system_logs 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing logs to have a default description (optional)
UPDATE system_logs 
SET description = action 
WHERE description IS NULL;

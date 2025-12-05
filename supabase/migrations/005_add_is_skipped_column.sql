-- Add is_skipped column to transactions table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS is_skipped BOOLEAN DEFAULT FALSE;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_is_skipped 
ON transactions(is_skipped);

-- Add comment
COMMENT ON COLUMN transactions.is_skipped IS 'Indica se a transação foi dispensada (não paga/recebida naquele mês)';

-- SCRIPT COMPLETO: Recriar tabela system_logs do zero
-- Execute este script INTEIRO de uma vez

-- 1. Remover tabela antiga (se existir)
DROP TABLE IF EXISTS system_logs CASCADE;

-- 2. Criar tabela nova
CREATE TABLE system_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('INFO', 'WARN', 'ERROR', 'CRITICAL')),
    category TEXT NOT NULL CHECK (category IN ('AUTH', 'DATA', 'SYSTEM', 'ADMIN', 'FINANCE')),
    action TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    details JSONB DEFAULT '{}'::jsonb,
    description TEXT,
    ip_address TEXT
);

-- 3. Habilitar RLS
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- 4. Policy para SELECT (admins podem ver tudo)
CREATE POLICY "Admins can view all logs" 
ON system_logs FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role = 'admin' OR profiles.email = 'admin@financemanager.com')
    )
);

-- 5. Policy para INSERT (qualquer usuário autenticado pode inserir)
CREATE POLICY "Authenticated users can insert logs" 
ON system_logs FOR INSERT 
TO authenticated
WITH CHECK (true);

-- 6. Criar índices
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at DESC);
CREATE INDEX idx_system_logs_category ON system_logs(category);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);

-- 7. Verificar se funcionou
SELECT 'Tabela system_logs criada com sucesso!' as status;

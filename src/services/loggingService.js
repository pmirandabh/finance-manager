import { supabase } from '../supabaseClient';

export const LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    CRITICAL: 'CRITICAL'
};

export const LOG_CATEGORIES = {
    AUTH: 'AUTH',
    DATA: 'DATA',
    SYSTEM: 'SYSTEM',
    ADMIN: 'ADMIN',
    FINANCE: 'FINANCE'
};

const formatMessage = (category, action, details, user) => {
    const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário';

    switch (category) {
        case LOG_CATEGORIES.AUTH:
            if (action === 'LOGIN') {
                return `✅ ${userName} fez login no sistema`;
            }
            if (action === 'LOGOUT') {
                return `🚪 ${userName} saiu do sistema`;
            }
            if (action === 'LOGIN_FAILED') {
                return `❌ Tentativa de login falhou para ${details.email || 'usuário desconhecido'}`;
            }
            break;

        case LOG_CATEGORIES.ADMIN:
            if (action === 'BLOCK_USER') {
                const status = details.action === 'bloquear' ? 'bloqueou' : 'desbloqueou';
                const targetName = details.target_email?.split('@')[0] || 'usuário';
                return `🛡️ ${userName} ${status} o acesso de ${targetName}`;
            }
            break;

        case LOG_CATEGORIES.FINANCE:
            if (action === 'TRANSACTION_CREATE') {
                const type = details.type === 'income' ? 'receita' : 'despesa';
                const desc = details.description || 'transação';
                const amount = details.amount ? `R$ ${details.amount.toFixed(2)}` : '';
                return `➕ ${userName} criou ${type}: ${desc} ${amount}`.trim();
            }
            if (action === 'TRANSACTION_UPDATE') {
                const desc = details.description || 'transação';
                return `✏️ ${userName} editou: ${desc}`;
            }
            if (action === 'TRANSACTION_DELETE') {
                const desc = details.description || 'transação';
                return `🗑️ ${userName} excluiu: ${desc}`;
            }
            break;

        case LOG_CATEGORIES.DATA:
            if (action === 'CATEGORY_CREATE') {
                return `📁 ${userName} criou a categoria: ${details.name || 'Nova categoria'}`;
            }
            if (action === 'CATEGORY_DELETE') {
                return `🗑️ ${userName} excluiu a categoria: ${details.name || 'Categoria'}`;
            }
            break;
    }

    return `${action} - ${userName}`;
};

export const loggingService = {
    /**
     * Logs a system event
     * @param {string} category - One of LOG_CATEGORIES
     * @param {string} action - Short description of action
     * @param {object} details - Additional data
     * @param {string} level - One of LOG_LEVELS
     */
    logEvent: async (category, action, details = {}, level = LOG_LEVELS.INFO) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const description = formatMessage(category, action, details, user);

            const logEntry = {
                category,
                action,
                details,
                level,
                description,
                user_id: user?.id || null,
                created_at: new Date().toISOString()
            };

            console.log('📝 Tentando inserir log:', logEntry);

            const { data, error } = await supabase
                .from('system_logs')
                .insert([logEntry])
                .select();

            if (error) {
                console.error('❌ Erro ao inserir log:', error);
            } else {
                console.log('✅ Log inserido com sucesso:', data);
            }
        } catch (err) {
            console.error('❌ Erro geral no loggingService:', err);
        }
    },

    /**
     * Fetches logs for admin dashboard
     */
    getLogs: async (filters = {}, page = 1, limit = 50) => {
        try {
            let query = supabase
                .from('system_logs')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false });

            if (filters.category && filters.category !== 'all') {
                query = query.eq('category', filters.category);
            }

            if (filters.level && filters.level !== 'all') {
                query = query.eq('level', filters.level);
            }

            const from = (page - 1) * limit;
            const to = from + limit - 1;

            const { data, error, count } = await query.range(from, to);

            if (error) throw error;

            return { data, count };
        } catch (error) {
            console.error('Error fetching logs:', error);
            throw error;
        }
    }
};

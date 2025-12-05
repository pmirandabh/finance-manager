import { supabase } from '../supabaseClient';
import { loggingService, LOG_CATEGORIES } from './loggingService';

export const transactionService = {
    async getAll(userId) {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data;
    },

    async save(transaction, userId) {
        const { id, ...dataToSave } = transaction;

        // Garantir que user_id está presente
        const payload = { ...dataToSave, user_id: userId };

        if (id) {
            // Update
            const { data, error } = await supabase
                .from('transactions')
                .update(payload)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Log transaction update
            await loggingService.logEvent(LOG_CATEGORIES.FINANCE, 'TRANSACTION_UPDATE', { ...payload, id });

            return data;
        } else {
            // Insert
            const { data, error } = await supabase
                .from('transactions')
                .insert([payload])
                .select()
                .single();

            if (error) throw error;

            // Log transaction creation
            await loggingService.logEvent(LOG_CATEGORIES.FINANCE, 'TRANSACTION_CREATE', payload);

            return data;
        }
    },

    async delete(id, description = 'Transação') {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Log transaction deletion
        await loggingService.logEvent(LOG_CATEGORIES.FINANCE, 'TRANSACTION_DELETE', { id, description });
    }
};

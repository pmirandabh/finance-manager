import { supabase } from '../supabaseClient';
import { loggingService, LOG_CATEGORIES } from './loggingService';
import { defaultCategories } from '../utils/defaultCategories';

export const categoryService = {
    async getAll(userId) {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        // Se o usuário não tiver categorias, criar as padrão
        if (data.length === 0) {
            return await this.createDefaults(userId);
        }

        return data;
    },

    async createDefaults(userId) {
        // defaultCategories é um objeto com expense e income
        const allCategories = [
            ...defaultCategories.expense.map(cat => ({ ...cat, type: 'expense' })),
            ...defaultCategories.income.map(cat => ({ ...cat, type: 'income' }))
        ];

        const categoriesToCreate = allCategories.map(cat => ({
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
            type: cat.type,
            user_id: userId,
            is_default: true
        }));

        const { data, error } = await supabase
            .from('categories')
            .insert(categoriesToCreate)
            .select();

        if (error) throw error;

        return data;
    },

    async save(category, userId) {
        const { id, ...dataToSave } = category;
        const payload = { ...dataToSave, user_id: userId };

        if (id) {
            const { data, error } = await supabase
                .from('categories')
                .update(payload)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        } else {
            const { data, error } = await supabase
                .from('categories')
                .insert([payload])
                .select()
                .single();
            if (error) throw error;

            // Log category creation
            await loggingService.logEvent(LOG_CATEGORIES.DATA, 'CATEGORY_CREATE', { name: category.name });

            return data;
        }
    },

    async delete(id) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Log category deletion
        await loggingService.logEvent(LOG_CATEGORIES.DATA, 'CATEGORY_DELETE', { name: 'Categoria ' + id });
    }
};

import { supabase } from '../supabaseClient';
import { defaultCategories } from '../utils/defaultCategories';
import { migrateTransactions } from '../utils/migration';
import { generateCategoryId } from '../utils/idGenerator';

export const StorageService = {
    /**
     * Load categories from Supabase
     */
    async loadCategories(userId) {
        try {
            // Fetch from Supabase
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            // If no categories, return empty array (user manages their own)
            if (!data || data.length === 0) {
                return [];
            }

            // Map snake_case fields to camelCase for app usage
            return data.map(cat => ({
                id: cat.id,
                name: cat.name,
                icon: cat.icon,
                color: cat.color,
                type: cat.type,
                isActive: cat.is_active !== false, // default to true if undefined
                createdAt: cat.created_at
            }));
        } catch (error) {
            console.error('StorageService: Error loading categories', error);
            throw error;
        }
    },

    /**
     * Initialize default categories for new user
     */
    async initializeDefaultCategories(userId) {
        try {
            const categoriesToCreate = [
                ...defaultCategories.expense.map(c => ({ ...c, type: 'expense' })),
                ...defaultCategories.income.map(c => ({ ...c, type: 'income' }))
            ].map(cat => ({
                id: generateCategoryId(),
                user_id: userId,
                name: cat.name,
                icon: cat.icon,
                color: cat.color,
                type: cat.type,
                is_active: true
            }));

            const { data, error } = await supabase
                .from('categories')
                .upsert(categoriesToCreate, { onConflict: 'id' })
                .select();

            if (error) throw error;

            return data.map(cat => ({
                id: cat.id,
                name: cat.name,
                icon: cat.icon,
                color: cat.color,
                type: cat.type,
                isActive: cat.is_active !== false,
                createdAt: cat.created_at
            }));
        } catch (error) {
            console.error('StorageService: Error initializing default categories', error);
            return [];
        }
    },

    /**
     * Save a single category (upsert)
     */
    async saveCategory(userId, category) {
        try {
            const categoryData = {
                id: category.id,
                user_id: userId,
                name: category.name,
                icon: category.icon,
                color: category.color,
                type: category.type,
                is_active: category.isActive !== false // default to true
            };

            const { data, error } = await supabase
                .from('categories')
                .upsert(categoryData, { onConflict: 'id' })
                .select()
                .single();

            if (error) {
                console.error('Supabase error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code,
                    categoryData: categoryData
                });
                throw error;
            }

            return data;
        } catch (error) {
            console.error('StorageService: Error saving category', error);
            throw error;
        }
    },

    /**
     * Save multiple categories
     */
    async saveCategories(userId, categories) {
        try {
            const categoriesData = categories.map(cat => ({
                ...cat,
                user_id: userId
            }));

            const { data, error } = await supabase
                .from('categories')
                .upsert(categoriesData, { onConflict: 'id' })
                .select();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('StorageService: Error saving categories', error);
            throw error;
        }
    },

    /**
     * Delete a category
     */
    async deleteCategory(userId, categoryId) {
        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', categoryId)
                .eq('user_id', userId);

            if (error) throw error;
        } catch (error) {
            console.error('StorageService: Error deleting category', error);
            throw error;
        }
    },

    /**
     * Load transactions from Supabase
     */
    async loadTransactions(userId) {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map DB fields to app fields
            const mappedData = (data || []).map(t => ({
                ...t,
                createdDate: t.created_at,
                categoryId: t.category_id,
                dueDate: t.due_date,
                paymentDate: t.payment_date,
                competenceMonth: t.competence_month,
                isRecurring: t.is_recurring,
                isTemplate: t.is_template,
                isRecurring: t.is_recurring,
                isTemplate: t.is_template,
                isPaid: t.is_paid,
                isSkipped: t.is_skipped
            }));

            // Migrate to ensure latest format
            return migrateTransactions(mappedData);
        } catch (error) {
            console.error('StorageService: Error loading transactions', error);
            throw error;
        }
    },

    /**
     * Save a single transaction (upsert)
     */
    async saveTransaction(userId, transaction) {
        try {
            const transactionData = {
                id: transaction.id,
                user_id: userId,
                description: transaction.description,
                amount: transaction.amount,
                type: transaction.type,
                notes: transaction.notes || '',
                // Convert dates to ISO strings
                due_date: transaction.dueDate || null,
                payment_date: transaction.paymentDate || null,
                // Map field names
                category_id: transaction.categoryId,
                competence_month: transaction.competenceMonth,
                is_recurring: transaction.isRecurring || false,
                is_template: transaction.isTemplate || false,
                is_paid: transaction.isPaid || false,
                is_skipped: transaction.isSkipped || false
            };

            // Only add created_at if updating (preserve original creation time)
            if (transaction.id && transaction.createdDate) {
                transactionData.created_at = transaction.createdDate;
            }

            const { data, error } = await supabase
                .from('transactions')
                .upsert(transactionData, { onConflict: 'id' })
                .select()
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('StorageService: Error saving transaction', error);
            throw error;
        }
    },

    /**
     * Save multiple transactions
     */
    async saveTransactions(userId, transactions) {
        try {
            const transactionsData = transactions.map(t => {
                const data = {
                    id: t.id,
                    user_id: userId,
                    description: t.description,
                    amount: t.amount,
                    type: t.type,
                    notes: t.notes || '',
                    due_date: t.dueDate || null,
                    payment_date: t.paymentDate || null,
                    category_id: t.categoryId,
                    competence_month: t.competenceMonth,
                    is_recurring: t.isRecurring || false,
                    is_recurring: t.isRecurring || false,
                    is_paid: t.isPaid || false,
                    is_skipped: t.isSkipped || false
                };

                // Only add created_at if updating (preserve original creation time)
                if (t.id && t.createdDate) {
                    data.created_at = t.createdDate;
                }

                return data;
            });

            const { data, error } = await supabase
                .from('transactions')
                .upsert(transactionsData, { onConflict: 'id' })
                .select();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('StorageService: Error saving transactions', error);
            throw error;
        }
    },

    /**
     * Delete a transaction
     */
    async deleteTransaction(userId, transactionId) {
        try {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', transactionId)
                .eq('user_id', userId);

            if (error) throw error;
        } catch (error) {
            console.error('StorageService: Error deleting transaction', error);
            throw error;
        }
    }
};

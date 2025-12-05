/**
 * Validation utilities for input sanitization and validation
 */

export const validators = {
    /**
     * Validates monetary amounts
     * @param {any} value - Value to validate
     * @returns {{isValid: boolean, error: string|null}}
     */
    validateAmount(value) {
        const num = parseFloat(value);

        if (isNaN(num)) {
            return { isValid: false, error: 'Valor deve ser um número válido' };
        }

        if (num <= 0) {
            return { isValid: false, error: 'Valor deve ser maior que zero' };
        }

        if (num > 999999999.99) {
            return { isValid: false, error: 'Valor muito grande (máximo: 999.999.999,99)' };
        }

        if (!isFinite(num)) {
            return { isValid: false, error: 'Valor inválido' };
        }

        return { isValid: true, error: null };
    },

    /**
     * Validates text descriptions
     * @param {string} text - Text to validate
     * @param {number} maxLength - Maximum length (default: 200)
     * @returns {{isValid: boolean, error: string|null}}
     */
    validateDescription(text, maxLength = 200) {
        if (!text || typeof text !== 'string') {
            return { isValid: false, error: 'Descrição é obrigatória' };
        }

        const trimmed = text.trim();

        if (trimmed.length === 0) {
            return { isValid: false, error: 'Descrição não pode estar vazia' };
        }

        if (trimmed.length > maxLength) {
            return { isValid: false, error: `Descrição muito longa (máximo: ${maxLength} caracteres)` };
        }

        return { isValid: true, error: null };
    },

    /**
     * Validates dates
     * @param {string} dateString - Date string to validate
     * @param {Object} options - Validation options
     * @returns {{isValid: boolean, error: string|null}}
     */
    validateDate(dateString, options = {}) {
        if (!dateString) {
            if (options.required) {
                return { isValid: false, error: 'Data é obrigatória' };
            }
            return { isValid: true, error: null };
        }

        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return { isValid: false, error: 'Data inválida' };
        }

        // Check if date is not too far in the past (more than 10 years)
        if (options.notTooOld) {
            const tenYearsAgo = new Date();
            tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

            if (date < tenYearsAgo) {
                return { isValid: false, error: 'Data muito antiga (máximo: 10 anos atrás)' };
            }
        }

        // Check if date is not in the future
        if (options.notFuture) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            if (date >= tomorrow) {
                return { isValid: false, error: 'Data não pode ser no futuro' };
            }
        }

        return { isValid: true, error: null };
    },

    /**
     * Validates category names
     * @param {string} name - Category name
     * @param {Array} existingCategories - List of existing categories
     * @param {string} currentId - ID of current category (for edit mode)
     * @returns {{isValid: boolean, error: string|null}}
     */
    validateCategoryName(name, existingCategories = [], currentId = null) {
        if (!name || typeof name !== 'string') {
            return { isValid: false, error: 'Nome da categoria é obrigatório' };
        }

        const trimmed = name.trim();

        if (trimmed.length === 0) {
            return { isValid: false, error: 'Nome não pode estar vazio' };
        }

        if (trimmed.length > 50) {
            return { isValid: false, error: 'Nome muito longo (máximo: 50 caracteres)' };
        }

        // Check for duplicates
        const duplicate = existingCategories.find(cat =>
            cat.name.toLowerCase() === trimmed.toLowerCase() &&
            cat.id !== currentId
        );

        if (duplicate) {
            return { isValid: false, error: 'Já existe uma categoria com este nome' };
        }

        return { isValid: true, error: null };
    },

    /**
     * Validates user names
     * @param {string} name - User name
     * @returns {{isValid: boolean, error: string|null}}
     */
    validateUserName(name) {
        if (!name || typeof name !== 'string') {
            return { isValid: false, error: 'Nome é obrigatório' };
        }

        const trimmed = name.trim();

        if (trimmed.length < 2) {
            return { isValid: false, error: 'Nome muito curto (mínimo: 2 caracteres)' };
        }

        if (trimmed.length > 100) {
            return { isValid: false, error: 'Nome muito longo (máximo: 100 caracteres)' };
        }

        return { isValid: true, error: null };
    }
};

/**
 * Error handling utilities for better user feedback
 */

export const errorHandler = {
    /**
     * Checks if error is a network error
     * @param {Error} error
     * @returns {boolean}
     */
    isNetworkError(error) {
        if (!error) return false;

        const message = error.message?.toLowerCase() || '';
        const name = error.name?.toLowerCase() || '';

        return (
            message.includes('failed to fetch') ||
            message.includes('network') ||
            message.includes('timeout') ||
            message.includes('connection') ||
            name === 'networkerror' ||
            !navigator.onLine
        );
    },

    /**
     * Checks if error is an authentication error
     * @param {Error} error
     * @returns {boolean}
     */
    isAuthError(error) {
        if (!error) return false;

        const message = error.message?.toLowerCase() || '';
        const code = error.code?.toLowerCase() || '';

        return (
            message.includes('invalid login') ||
            message.includes('invalid credentials') ||
            message.includes('unauthorized') ||
            message.includes('authentication') ||
            code === 'invalid_credentials' ||
            code === 'auth_error'
        );
    },

    /**
     * Checks if error is a validation error
     * @param {Error} error
     * @returns {boolean}
     */
    isValidationError(error) {
        if (!error) return false;

        const message = error.message?.toLowerCase() || '';

        return (
            message.includes('validation') ||
            message.includes('invalid') ||
            message.includes('required')
        );
    },

    /**
     * Gets user-friendly error message
     * @param {Error} error
     * @param {string} context - Context where error occurred
     * @returns {string}
     */
    getErrorMessage(error, context = '') {
        if (!error) return 'Erro desconhecido';

        // Network errors
        if (this.isNetworkError(error)) {
            return 'Sem conexão com a internet. Verifique sua conexão e tente novamente.';
        }

        // Authentication errors
        if (this.isAuthError(error)) {
            const message = error.message?.toLowerCase() || '';

            if (message.includes('email')) {
                return 'Email ou senha incorretos';
            }
            if (message.includes('password')) {
                return 'Senha incorreta';
            }
            if (message.includes('blocked') || error.code === 'ACCOUNT_BLOCKED') {
                return 'Sua conta está bloqueada. Entre em contato com o administrador.';
            }

            return 'Erro de autenticação. Verifique suas credenciais.';
        }

        // Supabase specific errors
        const supabaseMessage = error.message || '';

        if (supabaseMessage.includes('already registered')) {
            return 'Este email já está cadastrado';
        }

        if (supabaseMessage.includes('Email not confirmed')) {
            return 'Email não confirmado. Verifique sua caixa de entrada.';
        }

        if (supabaseMessage.includes('Invalid email')) {
            return 'Email inválido';
        }

        if (supabaseMessage.includes('Password should be')) {
            return 'Senha muito fraca. Use pelo menos 6 caracteres.';
        }

        // Storage errors
        if (supabaseMessage.includes('quota') || supabaseMessage.includes('storage')) {
            return 'Armazenamento local cheio. Libere espaço e tente novamente.';
        }

        // Context-specific messages
        if (context) {
            switch (context) {
                case 'login':
                    return 'Erro ao fazer login. Verifique suas credenciais.';
                case 'register':
                    return 'Erro ao criar conta. Tente novamente.';
                case 'load':
                    return 'Erro ao carregar dados. Tente recarregar a página.';
                case 'save':
                    return 'Erro ao salvar. Tente novamente.';
                case 'delete':
                    return 'Erro ao excluir. Tente novamente.';
                default:
                    break;
            }
        }

        // Return original message if it's user-friendly
        if (error.message && error.message.length < 100 && !error.message.includes('Error:')) {
            return error.message;
        }

        return 'Ocorreu um erro inesperado. Tente novamente.';
    },

    /**
     * Handles error and shows appropriate feedback
     * @param {Error} error
     * @param {string} context
     * @param {Function} toastError - Toast error function
     */
    handleError(error, context, toastError) {
        const message = this.getErrorMessage(error, context);

        if (toastError) {
            toastError(message);
        }

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error(`[${context}]`, error);
        }

        return message;
    }
};

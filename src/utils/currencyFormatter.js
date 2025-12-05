/**
 * Formata um número como moeda
 * @param {number} value - Valor a ser formatado
 * @param {string} locale - Locale (ex: 'pt-BR', 'en-US')
 * @param {string} currency - Código da moeda (ex: 'BRL', 'USD')
 * @returns {string} - Valor formatado
 */
export const formatCurrency = (value, locale = 'pt-BR', currency = 'BRL') => {
    if (value === null || value === undefined || isNaN(value)) {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(0);
    }

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(value);
};

/**
 * Formata um número com separadores de milhar e vírgula decimal
 * @param {number} value - Valor a ser formatado
 * @param {number} decimals - Número de casas decimais (padrão: 2)
 * @returns {string} - Valor formatado como 1.234,56
 */
export const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) {
        return '0,00';
    }

    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
};

/**
 * Converte string formatada em pt-BR para número
 * @param {string} formattedValue - Valor formatado (ex: "1.234,56" ou "R$ 1.234,56")
 * @returns {number} - Valor numérico
 */
export const parseCurrency = (formattedValue) => {
    if (!formattedValue) return 0;

    // Remove R$, espaços e pontos (separador de milhar)
    const cleaned = formattedValue
        .replace(/R\$/g, '')
        .replace(/\s/g, '')
        .replace(/\./g, '')
        .replace(',', '.');

    return parseFloat(cleaned) || 0;
};

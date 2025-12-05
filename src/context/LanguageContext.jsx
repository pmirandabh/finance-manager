import React, { createContext, useContext, useState, useEffect } from 'react';
import { pt } from '../locales/pt';
import { en } from '../locales/en';

const LanguageContext = createContext();

const translations = {
    'pt-BR': pt,
    'en-US': en
};

export const LanguageProvider = ({ children }) => {
    // Estado para Idioma
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'pt-BR';
    });

    // Estado para Moeda
    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem('currency') || 'BRL';
    });

    // Persistir mudanças
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    // Função de tradução
    // Função de tradução com suporte a chaves aninhadas (ex: 'auth.login')
    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language] || translations['pt-BR'];

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // Retorna a chave se não encontrar a tradução
            }
        }

        return value;
    };

    // Mapeamento de moeda para locale
    const getLocale = () => {
        switch (currency) {
            case 'USD': return 'en-US';
            case 'GBP': return 'en-GB';
            case 'BRL': return 'pt-BR';
            default: return 'pt-BR';
        }
    };

    const value = {
        language,
        changeLanguage: setLanguage,
        currency,
        changeCurrency: setCurrency,
        t,
        locale: getLocale()
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};


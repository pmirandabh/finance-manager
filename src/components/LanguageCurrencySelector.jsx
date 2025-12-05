import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageCurrencySelector = () => {
    const { language, changeLanguage, currency, changeCurrency, t } = useLanguage();

    const languages = [
        { code: 'pt-BR', label: '🇧🇷 Português' },
        { code: 'en-US', label: '🇺🇸 English' }
    ];

    const currencies = [
        { code: 'BRL', label: 'R$ (BRL)' },
        { code: 'USD', label: '$ (USD)' },
        { code: 'GBP', label: '£ (GBP)' }
    ];

    return (
        <div className="language-currency-selector" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            marginTop: '10px'
        }}>
            {/* Seletor de Idioma */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {language === 'pt-BR' ? 'Idioma' : 'Language'}
                </label>
                <select
                    value={language}
                    onChange={(e) => changeLanguage(e.target.value)}
                    style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        padding: '6px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                    }}
                >
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Seletor de Moeda */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {language === 'pt-BR' ? 'Moeda' : 'Currency'}
                </label>
                <select
                    value={currency}
                    onChange={(e) => changeCurrency(e.target.value)}
                    style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        padding: '6px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                    }}
                >
                    {currencies.map(curr => (
                        <option key={curr.code} value={curr.code}>
                            {curr.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default LanguageCurrencySelector;

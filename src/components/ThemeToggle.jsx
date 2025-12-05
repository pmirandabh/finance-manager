import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={`Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
            style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-primary)',
                transition: 'all 0.2s ease',
                width: '100%',
                justifyContent: 'center'
            }}
        >
            {theme === 'dark' ? '☀️ Tema Claro' : '🌙 Tema Escuro'}
        </button>
    );
};

export default ThemeToggle;

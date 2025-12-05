import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AppearanceSettings = () => {
    const [theme, setTheme] = useState('dark');
    const [accentColor, setAccentColor] = useState('purple');
    const [fontSize, setFontSize] = useState('medium');

    const handleSave = () => {
        // Aqui você implementaria a lógica de salvar preferências
        toast.success('Preferências de aparência salvas!');
    };

    const accentColors = [
        { id: 'purple', name: 'Roxo', color: '#BB86FC' },
        { id: 'blue', name: 'Azul', color: '#03DAC6' },
        { id: 'green', name: 'Verde', color: '#4CAF50' },
        { id: 'pink', name: 'Rosa', color: '#E91E63' },
        { id: 'orange', name: 'Laranja', color: '#FF9800' },
    ];

    return (
        <div className="glass-panel card">
            <h2 style={{ marginTop: 0 }}>🎨 Aparência</h2>

            {/* Tema */}
            <div className="form-group" style={{ marginBottom: '30px' }}>
                <label style={{ marginBottom: '10px', display: 'block' }}>Tema</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setTheme('dark')}
                        style={{ flex: 1 }}
                    >
                        🌙 Escuro
                    </button>
                    <button
                        className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setTheme('light')}
                        style={{ flex: 1 }}
                    >
                        ☀️ Claro
                    </button>
                    <button
                        className={`btn ${theme === 'auto' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setTheme('auto')}
                        style={{ flex: 1 }}
                    >
                        🌗 Automático
                    </button>
                </div>
                <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
                    {theme === 'auto' ? 'Segue as configurações do sistema operacional' :
                        theme === 'light' ? 'Tema claro (em desenvolvimento)' :
                            'Tema escuro (atual)'}
                </small>
            </div>

            {/* Cor de Destaque */}
            <div className="form-group" style={{ marginBottom: '30px' }}>
                <label style={{ marginBottom: '10px', display: 'block' }}>Cor de Destaque</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
                    {accentColors.map(color => (
                        <button
                            key={color.id}
                            onClick={() => setAccentColor(color.id)}
                            style={{
                                padding: '15px',
                                borderRadius: '8px',
                                border: accentColor === color.id ? `2px solid ${color.color}` : '2px solid rgba(255,255,255,0.1)',
                                background: accentColor === color.id ? `${color.color}20` : 'rgba(255,255,255,0.05)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <div style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                background: color.color
                            }} />
                            <span style={{ fontSize: '0.85rem' }}>{color.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tamanho da Fonte */}
            <div className="form-group" style={{ marginBottom: '30px' }}>
                <label style={{ marginBottom: '10px', display: 'block' }}>Tamanho da Fonte</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className={`btn ${fontSize === 'small' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setFontSize('small')}
                        style={{ flex: 1, fontSize: '0.85rem' }}
                    >
                        Pequeno
                    </button>
                    <button
                        className={`btn ${fontSize === 'medium' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setFontSize('medium')}
                        style={{ flex: 1 }}
                    >
                        Médio
                    </button>
                    <button
                        className={`btn ${fontSize === 'large' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setFontSize('large')}
                        style={{ flex: 1, fontSize: '1.1rem' }}
                    >
                        Grande
                    </button>
                </div>
            </div>

            {/* Preview */}
            <div style={{
                padding: '20px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                marginBottom: '20px'
            }}>
                <h4 style={{ marginTop: 0, color: accentColors.find(c => c.id === accentColor)?.color }}>
                    Preview
                </h4>
                <p style={{
                    fontSize: fontSize === 'small' ? '0.9rem' : fontSize === 'large' ? '1.1rem' : '1rem',
                    color: 'var(--text-secondary)'
                }}>
                    Este é um exemplo de como o texto ficará com as configurações selecionadas.
                </p>
            </div>

            {/* Botão Salvar */}
            <button className="btn btn-primary" onClick={handleSave} style={{ width: '100%' }}>
                💾 Salvar Preferências
            </button>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '15px', textAlign: 'center' }}>
                ⚠️ Algumas configurações estão em desenvolvimento e serão aplicadas em breve
            </p>
        </div>
    );
};

export default AppearanceSettings;

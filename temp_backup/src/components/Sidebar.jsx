import React from 'react';

const Sidebar = ({ activeView, onNavigate, onLogout }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Visão Geral', icon: '📊' },
        { id: 'analytics', label: 'Análises', icon: '📈' },
        { id: 'settings', label: 'Configurações', icon: '⚙️' },
    ];

    return (
        <div className="sidebar glass-panel" style={{
            width: '200px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 0,
            zIndex: 1000,
            background: 'rgba(18, 18, 18, 0.98)'
        }}>
            <div style={{ marginBottom: '30px', paddingLeft: '5px' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', background: 'linear-gradient(45deg, #BB86FC, #03DAC6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.8rem', WebkitTextFillColor: '#03DAC6' }}>$</span>
                    Saldo+ v1.0
                </h1>
                <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block', marginTop: '5px' }}>
                    Gestão Pessoal Financeira
                </small>
                <small style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', display: 'block', marginTop: '5px', opacity: 0.7 }}>
                    Desenvolvido por Paulo Miranda
                </small>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`btn ${activeView === item.id ? 'btn-primary' : 'btn-ghost'}`}
                        style={{
                            justifyContent: 'flex-start',
                            padding: '10px 12px',
                            width: '100%',
                            textAlign: 'left',
                            background: activeView === item.id ? 'rgba(187, 134, 252, 0.15)' : 'transparent',
                            border: activeView === item.id ? '1px solid var(--primary-color)' : 'none',
                            color: activeView === item.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                            transition: 'all 0.2s ease',
                            fontSize: '0.95rem'
                        }}
                    >
                        <span style={{ marginRight: '10px', fontSize: '1.1rem' }}>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px', paddingBottom: '60px' }}>
                <button
                    onClick={onLogout}
                    className="btn btn-ghost"
                    style={{
                        justifyContent: 'flex-start',
                        padding: '10px 12px',
                        width: '100%',
                        textAlign: 'left',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        transition: 'all 0.2s ease',
                        fontSize: '0.95rem'
                    }}
                >
                    <span style={{ marginRight: '10px', fontSize: '1.1rem' }}>🚪</span>
                    Sair
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

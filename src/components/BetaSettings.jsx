import React, { useState } from 'react';
import ProfileSettings from './ProfileSettings';
import AppearanceSettings from './AppearanceSettings';

const BetaSettings = ({ user }) => {
    const [activeTab, setActiveTab] = useState('profile');

    // Verificação de segurança - só permite acesso ao admin
    if (user?.email !== 'pmirandabh@gmail.com') {
        return null;
    }

    const tabs = [
        { id: 'profile', icon: '👤', label: 'Perfil', section: 'account' },
        { id: 'appearance', icon: '🎨', label: 'Aparência', section: 'customization' },
    ];

    return (
        <div className="settings-container fade-in">
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ margin: 0, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    ⚡ Configurações BETA
                    <span style={{
                        fontSize: '0.7rem',
                        background: 'rgba(255, 193, 7, 0.2)',
                        color: '#FFC107',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 'normal'
                    }}>
                        Exclusivo Admin
                    </span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    Funcionalidades em teste - Disponível apenas para administradores
                </p>
            </div>

            {/* Tabs por Seção */}
            <div className="glass-panel" style={{ marginBottom: '20px', padding: '20px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    📁 CONTA
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' }}>
                    {tabs.filter(t => t.section === 'account').map(tab => (
                        <button
                            key={tab.id}
                            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    📁 PERSONALIZAÇÃO
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {tabs.filter(t => t.section === 'customization').map(tab => (
                        <button
                            key={tab.id}
                            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Conteúdo da aba ativa */}
            <div>
                {activeTab === 'profile' && <ProfileSettings user={user} />}
                {activeTab === 'appearance' && <AppearanceSettings />}
            </div>
        </div>
    );
};

export default BetaSettings;

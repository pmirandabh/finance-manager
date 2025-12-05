import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = ({ activeView, onNavigate, onLogout, isAdmin, userEmail, isOpen = true, onClose }) => {
    const { t } = useLanguage();

    const menuItems = [
        { id: 'dashboard', label: t('menu.dashboard'), icon: '📊' },
        { id: 'analytics', label: t('menu.analytics'), icon: '📈' },
        { id: 'settings', label: t('menu.settings'), icon: '⚙️' },
    ];

    // Beta Settings - só para admin geral
    if (userEmail === 'pmirandabh@gmail.com') {
        menuItems.push({ id: 'beta-settings', label: 'Configurações BETA', icon: '⚡', badge: 'BETA' });
    }

    if (isAdmin) {
        menuItems.push({ id: 'admin', label: t('menu.admin'), icon: '🛡️' });
    }

    const handleNavigate = (viewId) => {
        onNavigate(viewId);
        // Close sidebar on mobile after navigation
        if (onClose && window.innerWidth < 768) {
            onClose();
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && onClose && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}

            <div className={`sidebar glass-panel ${isOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', marginBottom: '10px', paddingLeft: '5px' }}>
                    {/* Branding removed from here as requested */}

                    {/* Close button for mobile */}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="sidebar-close-btn"
                            style={{ marginTop: '-5px' }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigate(item.id)}
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
                            {item.badge && (
                                <span style={{
                                    marginLeft: 'auto',
                                    fontSize: '0.65rem',
                                    background: 'rgba(255, 193, 7, 0.2)',
                                    color: '#FFC107',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 'bold'
                                }}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px', paddingBottom: '60px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                        {t('menu.logout')}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;

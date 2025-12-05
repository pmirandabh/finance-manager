import React from 'react';

const EmptyState = ({ title, description, actionLabel, onAction, icon = '📭' }) => {
    return (
        <div className="empty-state glass-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center',
            margin: '20px 0',
            minHeight: '300px'
        }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                {icon}
            </div>
            <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '10px',
                color: 'var(--text-primary)'
            }}>
                {title}
            </h3>
            <p style={{
                color: 'var(--text-secondary)',
                maxWidth: '400px',
                marginBottom: '25px',
                lineHeight: '1.5'
            }}>
                {description}
            </p>
            {actionLabel && onAction && (
                <button
                    className="btn btn-primary"
                    onClick={onAction}
                    style={{
                        padding: '12px 24px',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <span>➕</span> {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;

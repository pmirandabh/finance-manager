import React from 'react';
import { formatCurrency } from '../utils/currencyFormatter';
import { useLanguage } from '../context/LanguageContext';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, transaction }) => {
    const { t, locale, currency } = useLanguage();

    if (!isOpen || !transaction) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '400px', maxWidth: '95%', padding: '25px' }}>
                <h2 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: 'var(--error-color)', textAlign: 'center' }}>
                    ⚠️ Confirmar Exclusão
                </h2>

                <p style={{ color: 'var(--text-primary)', marginBottom: '20px', textAlign: 'center' }}>
                    {t('dashboard.confirmDelete')}
                </p>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        color: transaction.type === 'income' ? 'var(--secondary-color)' : 'var(--error-color)',
                        fontSize: '1.3rem',
                        fontWeight: '600'
                    }}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount, locale, currency)}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(transaction.id)}
                        className="btn"
                        style={{
                            flex: 1,
                            background: 'var(--error-color)',
                            color: '#fff'
                        }}
                    >
                        {t('common.delete')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;

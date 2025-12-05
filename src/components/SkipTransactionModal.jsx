import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const SkipTransactionModal = ({ isOpen, transaction, onConfirm, onCancel }) => {
    const { t } = useLanguage();
    const [justification, setJustification] = useState('');
    const [error, setError] = useState('');

    if (!isOpen || !transaction) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validação
        if (!justification.trim()) {
            setError('Justificativa é obrigatória');
            return;
        }

        if (justification.trim().length < 10) {
            setError('Justificativa deve ter no mínimo 10 caracteres');
            return;
        }

        onConfirm(justification.trim());
        setJustification('');
        setError('');
    };

    const handleCancel = () => {
        setJustification('');
        setError('');
        onCancel();
    };

    return (
        <>
            <div className="modal-overlay" onClick={handleCancel} />
            <div
                className="modal-container"
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    width: '90%',
                    maxWidth: '500px'
                }}
            >
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h2 style={{ marginTop: 0, fontSize: '1.2rem', marginBottom: '16px' }}>
                        ⏭️ Dispensar Pendência
                    </h2>

                    <div style={{
                        background: 'rgba(100, 181, 246, 0.1)',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        border: '1px solid rgba(100, 181, 246, 0.3)'
                    }}>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                            {transaction.description}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            {transaction.type === 'expense' ? 'Despesa' : 'Receita'}: R$ {transaction.amount.toFixed(2)}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                                Justificativa <span style={{ color: 'var(--error-color)' }}>*</span>
                            </label>
                            <textarea
                                className="form-control"
                                value={justification}
                                onChange={(e) => {
                                    setJustification(e.target.value);
                                    setError('');
                                }}
                                placeholder={t('dashboard.justificationPlaceholder')}
                                rows={3}
                                style={{ width: '100%', resize: 'vertical' }}
                                autoFocus
                            />
                            {error && (
                                <div style={{ color: 'var(--error-color)', fontSize: '0.85rem', marginTop: '4px' }}>
                                    {error}
                                </div>
                            )}
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                Mínimo 10 caracteres
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end',
                            marginTop: '24px'
                        }}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancel}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-skip"
                            >
                                ⏭️ Dispensar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SkipTransactionModal;

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import CategorySelector from './CategorySelector';
import { useLanguage } from '../context/LanguageContext';

const EditTransactionModal = ({ transaction, categories, onSave, onCancel }) => {
    const { t } = useLanguage();
    const [description, setDescription] = useState(transaction.description);
    const [amount, setAmount] = useState(transaction.amount.toString());
    const [categoryId, setCategoryId] = useState(transaction.categoryId);
    const [competenceMonth, setCompetenceMonth] = useState(transaction.competenceMonth || '');
    const [notes, setNotes] = useState(transaction.notes || '');
    const [dueDate, setDueDate] = useState(transaction.dueDate || '');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!description || !amount || !categoryId) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }

        const updatedTransaction = {
            ...transaction,
            description,
            amount: parseFloat(amount),
            categoryId,
            competenceMonth,
            dueDate: dueDate || null,
            notes: notes.trim()
        };

        onSave(updatedTransaction);
    };

    const handleReturnToPending = () => {
        const updatedTransaction = {
            ...transaction,
            isSkipped: false,
            isPaid: false,
            paymentDate: null,
            notes: transaction.isSkipped ? '' : transaction.notes // Clear notes only if skipped
        };
        onSave(updatedTransaction);
    };

    return (
        <div className="modal-overlay" onClick={onCancel} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '600px', maxWidth: '95%', padding: '25px' }}>
                <h2 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                    Editar Transação
                </h2>


                {transaction.isSkipped && (
                    <div style={{
                        background: 'rgba(100, 181, 246, 0.1)',
                        border: '1px solid rgba(100, 181, 246, 0.3)',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '15px'
                    }}>
                        <div>
                            <div style={{ color: '#64b5f6', fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                ⏭️ Transação Dispensada
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                {transaction.notes.replace('[DISPENSADA] ', '')}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={handleReturnToPending}
                            title={t('dashboard.returnToPending')}
                        >
                            ↩️ Retornar
                        </button>
                    </div>
                )}

                {transaction.isPaid && !transaction.isSkipped && (
                    <div style={{
                        background: 'rgba(76, 175, 80, 0.1)',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '15px'
                    }}>
                        <div>
                            <div style={{ color: '#4caf50', fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                ✅ Transação Paga
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Esta transação já foi efetivada.
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={handleReturnToPending}
                            title={t('dashboard.undoPayment')}
                        >
                            ↩️ Marcar como Pendente
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <CategorySelector
                                categories={categories}
                                selectedCategoryId={categoryId}
                                type={transaction.type}
                                onChange={setCategoryId}
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Descrição</label>
                            <input
                                type="text"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Valor (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="form-control"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                onBlur={(e) => {
                                    if (e.target.value) {
                                        const formatted = parseFloat(e.target.value).toFixed(2);
                                        setAmount(formatted);
                                    }
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Mês de Competência</label>
                            <input
                                type="month"
                                className="form-control"
                                value={competenceMonth}
                                onChange={(e) => setCompetenceMonth(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Vencimento (Opcional)</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Observações</label>
                            <textarea
                                className="form-control"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows="2"
                                style={{ resize: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '25px', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ minWidth: '120px' }}>
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
};

export default EditTransactionModal;

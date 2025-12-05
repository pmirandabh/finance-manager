import React, { useState } from 'react';
import CategorySelector from './CategorySelector';

const EditTransactionModal = ({ transaction, categories, onSave, onCancel }) => {
    const [description, setDescription] = useState(transaction.description);
    const [amount, setAmount] = useState(transaction.amount.toString());
    const [categoryId, setCategoryId] = useState(transaction.categoryId);
    const [competenceMonth, setCompetenceMonth] = useState(transaction.competenceMonth || '');
    const [notes, setNotes] = useState(transaction.notes || '');
    const [dueDate, setDueDate] = useState(transaction.dueDate || '');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!description || !amount || !categoryId) {
            alert('Preencha todos os campos obrigatórios');
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

    return (
        <div className="modal-overlay" onClick={onCancel} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '600px', maxWidth: '95%', padding: '25px' }}>
                <h2 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                    Editar Transação
                </h2>
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
        </div>
    );
};

export default EditTransactionModal;

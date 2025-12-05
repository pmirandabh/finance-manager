import React, { useState } from 'react';
import CategorySelector from './CategorySelector';

const TransactionForm = ({ onAddTransaction, categories }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [categoryId, setCategoryId] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [notes, setNotes] = useState('');
    const [dueDate, setDueDate] = useState('');

    // Competence month defaults to current month
    const getCurrentMonthString = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };

    const [competenceMonth, setCompetenceMonth] = useState(getCurrentMonthString());

    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description || !amount || !categoryId) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        const transaction = {
            id: Date.now().toString(),
            description,
            amount: parseFloat(amount),
            type,
            categoryId,
            competenceMonth, // Month of reference
            dueDate: dueDate || null, // Due date
            createdDate: new Date().toISOString(),
            paymentDate: null, // Will be set when confirmed
            isRecurring,
            isTemplate: isRecurring,
            isPaid: false,
            notes: notes.trim()
        };

        onAddTransaction(transaction);

        setDescription('');
        setAmount('');
        setCategoryId('');
        setIsRecurring(false);
        setNotes('');
        setDueDate('');
        setCompetenceMonth(getCurrentMonthString());
    };

    // Reset category when type changes
    const handleTypeChange = (newType) => {
        setType(newType);
        setCategoryId('');
    };

    return (
        <div className="glass-panel card" style={{ transition: 'all 0.3s ease', padding: '15px' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: isExpanded ? '15px' : '0'
                }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 style={{ margin: 0, fontSize: '1rem' }}>Nova Transação</h2>
                <button
                    className="btn-icon"
                    style={{
                        background: 'var(--primary-color)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    {isExpanded ? '−' : '+'}
                </button>
            </div>

            {isExpanded && (
                <form onSubmit={handleSubmit} style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div className="form-group">
                        <label>Tipo</label>
                        <div className="type-selector">
                            <button
                                type="button"
                                className={`type-option ${type === 'expense' ? 'selected expense' : ''}`}
                                onClick={() => handleTypeChange('expense')}
                            >
                                💸 Despesa
                            </button>
                            <button
                                type="button"
                                className={`type-option ${type === 'income' ? 'selected income' : ''}`}
                                onClick={() => handleTypeChange('income')}
                            >
                                💰 Receita
                            </button>
                        </div>
                    </div>

                    <CategorySelector
                        categories={categories}
                        selectedCategoryId={categoryId}
                        type={type}
                        onChange={setCategoryId}
                    />

                    <div className="form-group">
                        <label>Descrição</label>
                        <input
                            type="text"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex: Supermercado Extra"
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
                            placeholder="0,00"
                        />
                    </div>

                    <div className="form-group">
                        <label>Data de Vencimento (Opcional)</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
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
                        <small className="help-text" style={{ marginLeft: 0 }}>
                            Mês de referência da despesa/receita
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Observações (opcional)</label>
                        <textarea
                            className="form-control"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Notas, motivos, justificativas..."
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                            />
                            <span>Transação recorrente (mensal)</span>
                        </label>
                        {isRecurring ? (
                            <small className="help-text">
                                Gera uma pendência todo mês automaticamente.
                            </small>
                        ) : (
                            <small className="help-text">
                                Será criada como pendente. Confirme o pagamento na lista abaixo.
                            </small>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Adicionar
                    </button>
                </form>
            )}
        </div>
    );
};

export default TransactionForm;

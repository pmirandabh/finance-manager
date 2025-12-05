import React, { useState } from 'react';
import { formatDateLocal } from '../utils/dateUtils';

const RecurringTransactions = ({ transactions, onPayTransaction, onDeleteTransaction, categories }) => {
    // Filter all pending transactions (recurring or manual) that are not templates
    const pendingTransactions = transactions.filter(t => !t.isPaid && !t.isTemplate);

    const pendingIncome = pendingTransactions.filter(t => t.type === 'income');
    const pendingExpense = pendingTransactions.filter(t => t.type === 'expense');

    const totalPendingIncome = pendingIncome.reduce((sum, t) => sum + t.amount, 0);
    const totalPendingExpense = pendingExpense.reduce((sum, t) => sum + t.amount, 0);

    // State for collapsible sections - moved to parent to persist across re-renders
    const [isPendingIncomesExpanded, setIsPendingIncomesExpanded] = useState(false);
    const [isPendingExpensesExpanded, setIsPendingExpensesExpanded] = useState(false);

    const getCategoryColor = (categoryId) => {
        const category = categories.find(c => c.id == categoryId);
        return category ? category.color : '#b0b0b0';
    };

    const getCategoryIcon = (categoryId) => {
        const category = categories.find(c => c.id == categoryId);
        return category ? category.icon : '📝';
    };

    const formatCompetence = (competenceMonth) => {
        if (!competenceMonth) return 'Sem competência';
        const [year, month] = competenceMonth.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return `${monthNames[parseInt(month) - 1]}/${year}`;
    };

    const getStatus = (competenceMonth) => {
        if (!competenceMonth) return { text: 'Sem data', color: '#999' };

        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        if (competenceMonth < currentMonthKey) {
            return { text: '⚠️ Atrasado', color: '#ff6b6b' };
        } else if (competenceMonth === currentMonthKey) {
            return { text: '✓ No prazo', color: '#51cf66' };
        } else {
            return { text: '📅 Futuro', color: '#4ecdc4' };
        }
    };

    const PendingList = ({ title, list, total, color, isExpanded, setIsExpanded }) => {
        return (
            <div style={{ marginBottom: '15px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden' }}>
                <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        padding: '12px 15px',
                        background: 'rgba(255,255,255,0.02)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        borderLeft: `4px solid ${color}`
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {isExpanded ? '▼' : '▶'}
                        </span>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>{title}</h3>
                    </div>
                    <span style={{ fontWeight: 'bold', color: color }}>
                        R$ {total.toFixed(2)}
                    </span>
                </div>

                {isExpanded && (
                    <div style={{ padding: '0 15px 15px 15px' }}>
                        {list.length === 0 ? (
                            <p className="text-muted" style={{ padding: '15px 0', textAlign: 'center', margin: 0 }}>
                                Nenhuma pendência.
                            </p>
                        ) : (
                            <ul className="transaction-list">
                                {list.map(transaction => {
                                    const status = getStatus(transaction.competenceMonth);
                                    return (
                                        <li key={transaction.id} className="transaction-item">
                                            <div className="transaction-info">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div
                                                        className="category-icon-small"
                                                        style={{ backgroundColor: getCategoryColor(transaction.categoryId) }}
                                                    >
                                                        {getCategoryIcon(transaction.categoryId)}
                                                    </div>
                                                    <div>
                                                        <span className="transaction-title">{transaction.description}</span>
                                                        <div className="transaction-date">
                                                            <span style={{ marginRight: '10px' }}>
                                                                Competência: {formatCompetence(transaction.competenceMonth)}
                                                            </span>
                                                            {transaction.dueDate && (
                                                                <span style={{ marginRight: '10px', color: '#b0b0b0' }}>
                                                                    Venc: {formatDateLocal(transaction.dueDate)}
                                                                </span>
                                                            )}
                                                            <span style={{ color: status.color, fontWeight: 600 }}>
                                                                {status.text}
                                                            </span>
                                                        </div>
                                                        {transaction.isRecurring && (
                                                            <div className="transaction-date" style={{ fontSize: '0.75rem' }}>
                                                                🔄 Recorrente Mensal
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <span className={`transaction-amount ${transaction.type}`}>
                                                    R$ {transaction.amount.toFixed(2)}
                                                </span>
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onPayTransaction(transaction.id);
                                                    }}
                                                    title={transaction.type === 'expense' ? 'Confirmar Pagamento' : 'Confirmar Recebimento'}
                                                >
                                                    {transaction.type === 'expense' ? '✅ Pagar' : '✅ Receber'}
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('Tem certeza que deseja excluir esta pendência?')) {
                                                            onDeleteTransaction(transaction.id);
                                                        }
                                                    }}
                                                    title="Excluir Pendência"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="glass-panel card" style={{ transition: 'all 0.3s ease', padding: '15px' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '15px' }}>📅 Transações Pendentes</h2>

            {pendingTransactions.length === 0 ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '15px', margin: 0, fontSize: '0.9rem' }}>
                    Tudo pago! Nenhuma pendência. 🎉
                </p>
            ) : (
                <>
                    <PendingList
                        title="Receitas Pendentes"
                        list={pendingIncome}
                        total={totalPendingIncome}
                        color="var(--secondary-color)"
                        isExpanded={isPendingIncomesExpanded}
                        setIsExpanded={setIsPendingIncomesExpanded}
                    />

                    <PendingList
                        title="Despesas Pendentes"
                        list={pendingExpense}
                        total={totalPendingExpense}
                        color="var(--error-color)"
                        isExpanded={isPendingExpensesExpanded}
                        setIsExpanded={setIsPendingExpensesExpanded}
                    />
                </>
            )}
        </div>
    );
};

export default RecurringTransactions;

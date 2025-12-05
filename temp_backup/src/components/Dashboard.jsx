import React, { useState } from 'react';
import { formatDateLocal } from '../utils/dateUtils';

const Dashboard = ({ transactions, categories, onDeleteTransaction, onEditTransaction }) => {
    // Only count PAID transactions (not pending, not templates)
    const paidTransactions = transactions.filter(t => t.isPaid && !t.isTemplate);

    const income = paidTransactions
        .filter((t) => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const expense = paidTransactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expense;

    const incomes = paidTransactions.filter(t => t.type === 'income');
    const expenses = paidTransactions.filter(t => t.type === 'expense');

    // State for collapsible sections - moved to parent to persist across re-renders
    const [isIncomesExpanded, setIsIncomesExpanded] = useState(false);
    const [isExpensesExpanded, setIsExpensesExpanded] = useState(false);

    const TransactionList = ({ title, list, emptyMessage, total, color, isExpanded, setIsExpanded }) => {
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
                            <p className="text-muted" style={{ padding: '15px 0', textAlign: 'center', margin: 0 }}>{emptyMessage}</p>
                        ) : (
                            <ul className="transaction-list">
                                {list.slice().reverse().map((t) => {
                                    const category = categories.find(c => c.id == t.categoryId) || {
                                        name: 'Sem Categoria',
                                        color: '#b2bec3',
                                        icon: '❓'
                                    };
                                    return (
                                        <li key={t.id} className="transaction-item">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div
                                                    className="category-icon-small"
                                                    style={{
                                                        backgroundColor: category.color,
                                                        width: '28px',
                                                        height: '28px',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1rem'
                                                    }}
                                                    title={category.name}
                                                >
                                                    {category.icon}
                                                </div>
                                                <div className="transaction-info">
                                                    <span className="transaction-title">
                                                        {t.description}
                                                        {t.isRecurring && <span title="Recorrente"> 🔄</span>}
                                                    </span>
                                                    <span className="transaction-date">
                                                        {new Date(t.paymentDate || t.createdDate).toLocaleDateString()} • {category.name}
                                                        {t.dueDate && (
                                                            <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: '#b0b0b0' }}>
                                                                (Venc: {formatDateLocal(t.dueDate)})
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <span className={`transaction-amount ${t.type}`}>
                                                    {t.type === 'expense' ? '-' : '+'} R$ {t.amount.toFixed(2)}
                                                </span>
                                                <button
                                                    className="btn-secondary"
                                                    style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEditTransaction(t);
                                                    }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn-secondary"
                                                    style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
                                                            onDeleteTransaction(t.id);
                                                        }
                                                    }}
                                                >
                                                    Excluir
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
        <div className="glass-panel card" style={{ gridColumn: 'span 2', padding: '15px' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '15px' }}>Últimas Transações</h2>

            {paidTransactions.length === 0 ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '15px', fontSize: '0.9rem' }}>
                    Nenhuma transação confirmada neste mês.
                </p>
            ) : (
                <>
                    <TransactionList
                        title="Receitas"
                        list={incomes}
                        emptyMessage="Nenhuma receita registrada"
                        total={income}
                        color="var(--secondary-color)"
                        isExpanded={isIncomesExpanded}
                        setIsExpanded={setIsIncomesExpanded}
                    />

                    <TransactionList
                        title="Despesas"
                        list={expenses}
                        emptyMessage="Nenhuma despesa registrada"
                        total={expense}
                        color="var(--error-color)"
                        isExpanded={isExpensesExpanded}
                        setIsExpanded={setIsExpensesExpanded}
                    />
                </>
            )}
        </div>
    );
};

export default Dashboard;

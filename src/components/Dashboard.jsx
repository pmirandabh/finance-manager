import React, { useState } from 'react';
import { formatDateLocal } from '../utils/dateUtils';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EmptyState from './EmptyState';
import { formatCurrency } from '../utils/currencyFormatter';
import { useLanguage } from '../context/LanguageContext';

import { useFinancialSummary } from '../hooks/useFinancialSummary';

const Dashboard = ({ transactions, categories, onDeleteTransaction, onEditTransaction, onNewTransaction, lastAddedTransactionId }) => {
    const { t, locale, currency } = useLanguage();
    // Use hook for financial calculations
    const { income, expense, incomes, expenses, paidTransactions } = useFinancialSummary(transactions);

    // State for collapsible sections - moved to parent to persist across re-renders
    const [isIncomesExpanded, setIsIncomesExpanded] = useState(false);
    const [isExpensesExpanded, setIsExpensesExpanded] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);

    const handleDeleteClick = (transaction) => {
        setTransactionToDelete(transaction);
    };

    const handleConfirmDelete = (id) => {
        onDeleteTransaction(id);
        setTransactionToDelete(null);
    };

    const handleCancelDelete = () => {
        setTransactionToDelete(null);
    };

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
                        {formatCurrency(total, locale, currency)}
                    </span>
                </div>

                {isExpanded && (
                    <div style={{ padding: '0 15px 15px 15px' }}>
                        {list.length === 0 ? (
                            <p className="text-muted" style={{ padding: '15px 0', textAlign: 'center', margin: 0 }}>{emptyMessage}</p>
                        ) : (
                            <ul className="transaction-list">
                                {list.slice().reverse().map((transaction) => {
                                    const category = categories.find(c => c.id == transaction.categoryId) || {
                                        name: 'Sem Categoria',
                                        color: '#b2bec3',
                                        icon: '❓'
                                    };
                                    return (
                                        <li key={transaction.id} className={`transaction-item ${lastAddedTransactionId === transaction.id ? 'highlight' : ''} ${transaction.isSkipped ? 'skipped' : ''}`}>
                                            <div className="transaction-info">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div
                                                        className="category-icon-small"
                                                        style={{ backgroundColor: category.color }}
                                                    >
                                                        {category.icon}
                                                    </div>
                                                    <div>
                                                        <span className="transaction-title">
                                                            {transaction.description}
                                                            {transaction.isRecurring && <span title={t('common.recurring')}> 🔄</span>}
                                                            {transaction.isSkipped && (
                                                                <span style={{
                                                                    fontSize: '0.7rem',
                                                                    padding: '2px 6px',
                                                                    borderRadius: '4px',
                                                                    background: 'rgba(100, 181, 246, 0.1)',
                                                                    color: '#64b5f6',
                                                                    marginLeft: '8px',
                                                                    border: '1px solid rgba(100, 181, 246, 0.3)'
                                                                }}>
                                                                    ⏭️ DISPENSADA
                                                                </span>
                                                            )}
                                                        </span>
                                                        <div className="transaction-date">
                                                            <span style={{ marginRight: '10px' }}>
                                                                {new Date(transaction.paymentDate || transaction.createdDate).toLocaleDateString(locale)} • {category.name}
                                                            </span>
                                                            {transaction.dueDate && (
                                                                <span style={{ color: '#b0b0b0' }}>
                                                                    (Venc: {formatDateLocal(transaction.dueDate)})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <span className={`transaction-amount ${transaction.type}`}>
                                                    {transaction.type === 'expense' ? '-' : '+'} {formatCurrency(transaction.amount, locale, currency)}
                                                </span>
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEditTransaction(transaction);
                                                    }}
                                                    title={t('common.editTransaction')}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(transaction);
                                                    }}
                                                    title={t('common.deleteTransaction')}
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
        <div className="glass-panel card dashboard-main-card">
            <h2 style={{ fontSize: '1rem', marginBottom: '15px' }}>{t('dashboard.recentTransactions')}</h2>

            {paidTransactions.length === 0 ? (
                <EmptyState
                    title={t('dashboard.noTransactions')}
                    description={t('dashboard.emptyDescription')}
                    actionLabel={t('dashboard.addTransaction')}
                    onAction={onNewTransaction}
                    icon="💸"
                />
            ) : (
                <>
                    <TransactionList
                        title={t('dashboard.income')}
                        list={incomes}
                        emptyMessage={t('dashboard.noIncome')}
                        total={income}
                        color="var(--secondary-color)"
                        isExpanded={isIncomesExpanded}
                        setIsExpanded={setIsIncomesExpanded}
                    />

                    <TransactionList
                        title={t('dashboard.expense')}
                        list={expenses}
                        emptyMessage={t('dashboard.noExpense')}
                        total={expense}
                        color="var(--error-color)"
                        isExpanded={isExpensesExpanded}
                        setIsExpanded={setIsExpensesExpanded}
                    />
                </>
            )}

            <DeleteConfirmationModal
                isOpen={!!transactionToDelete}
                transaction={transactionToDelete}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default Dashboard;

import React, { useState } from 'react';
import { formatCurrency } from '../utils/currencyFormatter';
import { formatDateLocal } from '../utils/dateUtils';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import SkipTransactionModal from './SkipTransactionModal';
import { useLanguage } from '../context/LanguageContext';

const RecurringTransactions = ({ transactions, onPayTransaction, onDeleteTransaction, onSkipTransaction, categories }) => {
    const { t, locale, currency } = useLanguage();
    const [showCurrentMonthOnly, setShowCurrentMonthOnly] = useState(false);

    // Filter pending transactions (not paid, not template, not skipped)
    const pendingTransactions = transactions
        .filter(t => {
            if (t.isPaid || t.isTemplate || t.isSkipped) return false;

            // Current month filter
            if (showCurrentMonthOnly) {
                const now = new Date();
                const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                if (t.competenceMonth !== currentMonthKey) return false;
            }
            return true;
        })
        .sort((a, b) => {
            // Sort by Due Date (asc), then Competence
            // If no due date, use competence month as fallback for sorting
            const dateA = a.dueDate || a.competenceMonth || '9999';
            const dateB = b.dueDate || b.competenceMonth || '9999';
            return dateA.localeCompare(dateB);
        });

    const pendingIncome = pendingTransactions.filter(t => t.type === 'income');
    const pendingExpense = pendingTransactions.filter(t => t.type === 'expense');

    const totalPendingIncome = pendingIncome.reduce((sum, t) => sum + t.amount, 0);
    const totalPendingExpense = pendingExpense.reduce((sum, t) => sum + t.amount, 0);

    // State for collapsible sections - moved to parent to persist across re-renders
    const [isPendingIncomesExpanded, setIsPendingIncomesExpanded] = useState(false);
    const [isPendingExpensesExpanded, setIsPendingExpensesExpanded] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [transactionToSkip, setTransactionToSkip] = useState(null);

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

    const handleSkipClick = (transaction) => {
        setTransactionToSkip(transaction);
    };

    const handleConfirmSkip = (justification) => {
        onSkipTransaction(transactionToSkip.id, justification);
        setTransactionToSkip(null);
    };

    const handleCancelSkip = () => {
        setTransactionToSkip(null);
    };

    const getCategoryColor = (categoryId) => {
        const category = categories.find(c => c.id == categoryId);
        return category ? category.color : '#b0b0b0';
    };

    const getCategoryIcon = (categoryId) => {
        const category = categories.find(c => c.id == categoryId);
        return category ? category.icon : '📝';
    };

    const formatCompetence = (competenceMonth) => {
        if (!competenceMonth) return t('pending.noCompetence');
        const [year, month] = competenceMonth.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return `${monthNames[parseInt(month) - 1]}/${year}`;
    };

    const getStatus = (competenceMonth) => {
        if (!competenceMonth) return { text: t('pending.noDate'), color: '#999' };

        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        if (competenceMonth < currentMonthKey) {
            return { text: t('pending.overdue'), color: '#ff6b6b' };
        } else if (competenceMonth === currentMonthKey) {
            return { text: t('pending.onTime'), color: '#51cf66' };
        } else {
            return { text: t('pending.future'), color: '#4ecdc4' };
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
                        {formatCurrency(total, locale, currency)}
                    </span>
                </div>

                {isExpanded && (
                    <div style={{ padding: '0 15px 15px 15px' }}>
                        {list.length === 0 ? (
                            <p className="text-muted" style={{ padding: '15px 0', textAlign: 'center', margin: 0 }}>
                                {t('pending.noPendingItems')}
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
                                                                {t('pending.competence')}: {formatCompetence(transaction.competenceMonth)}
                                                            </span>
                                                            {transaction.dueDate && (
                                                                <span style={{ marginRight: '10px', color: '#b0b0b0' }}>
                                                                    {t('pending.dueDate')}: {formatDateLocal(transaction.dueDate)}
                                                                </span>
                                                            )}
                                                            <span style={{ color: status.color, fontWeight: 600 }}>
                                                                {status.text}
                                                            </span>
                                                        </div>
                                                        {transaction.isRecurring && (
                                                            <div className="transaction-date" style={{ fontSize: '0.75rem' }}>
                                                                {t('pending.recurring')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <span className={`transaction-amount ${transaction.type}`}>
                                                    {formatCurrency(transaction.amount, locale, currency)}
                                                </span>
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onPayTransaction(transaction.id);
                                                    }}
                                                    title={transaction.type === 'expense' ? t('pending.confirmPayment') : t('pending.confirmReceipt')}
                                                >
                                                    ✅
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-skip"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSkipClick(transaction);
                                                    }}
                                                    title={t('pending.skipPending')}
                                                >
                                                    ⏭️
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(transaction);
                                                    }}
                                                    title={t('pending.deletePending')}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ fontSize: '1rem', margin: 0 }}>📅 {t('pending.title')}</h2>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <input
                        type="checkbox"
                        checked={showCurrentMonthOnly}
                        onChange={(e) => setShowCurrentMonthOnly(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                    />
                    {t('pending.onlyCurrentMonth')}
                </label>
            </div>

            {pendingTransactions.length === 0 ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '15px', margin: 0, fontSize: '0.9rem' }}>
                    {t('pending.noPending')}
                </p>
            ) : (
                <>
                    <PendingList
                        title={t('pending.incomeTitle')}
                        list={pendingIncome}
                        total={totalPendingIncome}
                        color="var(--secondary-color)"
                        isExpanded={isPendingIncomesExpanded}
                        setIsExpanded={setIsPendingIncomesExpanded}
                    />

                    <PendingList
                        title={t('pending.expenseTitle')}
                        list={pendingExpense}
                        total={totalPendingExpense}
                        color="var(--error-color)"
                        isExpanded={isPendingExpensesExpanded}
                        setIsExpanded={setIsPendingExpensesExpanded}
                    />
                </>
            )}

            <DeleteConfirmationModal
                isOpen={!!transactionToDelete}
                transaction={transactionToDelete}
                onConfirm={handleConfirmDelete}
                onClose={handleCancelDelete}
            />

            <SkipTransactionModal
                isOpen={!!transactionToSkip}
                transaction={transactionToSkip}
                onConfirm={handleConfirmSkip}
                onCancel={handleCancelSkip}
            />
        </div>
    );
};

export default RecurringTransactions;

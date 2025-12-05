import React from 'react';
import { formatCurrency } from '../utils/currencyFormatter';
import { useLanguage } from '../context/LanguageContext';

const SummaryCards = ({ transactions }) => {
    const { t, locale, currency } = useLanguage();

    const paidTransactions = transactions.filter(t => t.isPaid && !t.isTemplate);

    const totalTransactions = paidTransactions.length;
    const totalExpenses = paidTransactions.filter(t => t.type === 'expense').length;
    const totalIncome = paidTransactions.filter(t => t.type === 'income').length;

    const largestExpense = paidTransactions
        .filter(t => t.type === 'expense')
        .sort((a, b) => b.amount - a.amount)[0];

    const largestIncome = paidTransactions
        .filter(t => t.type === 'income')
        .sort((a, b) => b.amount - a.amount)[0];

    return (
        <div className="summary-cards">
            <div className="summary-card glass-panel" style={{ padding: '15px', minHeight: 'auto' }}>
                <div className="summary-icon" style={{ fontSize: '1.5rem', width: '40px', height: '40px' }}>📝</div>
                <div className="summary-content">
                    <div className="summary-label" style={{ fontSize: '0.8rem' }}>{t('dashboard.total')}</div>
                    <div className="summary-value" style={{ fontSize: '1.2rem' }}>{totalTransactions}</div>
                    <div className="summary-detail" style={{ fontSize: '0.75rem' }}>
                        {totalExpenses} {t('dashboard.expense').toLowerCase()} • {totalIncome} {t('dashboard.income').toLowerCase()}
                    </div>
                </div>
            </div>

            {largestExpense && (
                <div className="summary-card glass-panel" style={{ padding: '15px', minHeight: 'auto' }}>
                    <div className="summary-icon" style={{ fontSize: '1.5rem', width: '40px', height: '40px' }}>💸</div>
                    <div className="summary-content">
                        <div className="summary-label" style={{ fontSize: '0.8rem' }}>{t('dashboard.largestExpense')}</div>
                        <div className="summary-value expense" style={{ fontSize: '1.2rem' }}>
                            {formatCurrency(largestExpense.amount, locale, currency)}
                        </div>
                        <div className="summary-detail" style={{ fontSize: '0.75rem' }}>{largestExpense.description}</div>
                    </div>
                </div>
            )}

            {largestIncome && (
                <div className="summary-card glass-panel" style={{ padding: '15px', minHeight: 'auto' }}>
                    <div className="summary-icon" style={{ fontSize: '1.5rem', width: '40px', height: '40px' }}>💰</div>
                    <div className="summary-content">
                        <div className="summary-label" style={{ fontSize: '0.8rem' }}>{t('dashboard.largestIncome')}</div>
                        <div className="summary-value income" style={{ fontSize: '1.2rem' }}>
                            {formatCurrency(largestIncome.amount, locale, currency)}
                        </div>
                        <div className="summary-detail" style={{ fontSize: '0.75rem' }}>{largestIncome.description}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SummaryCards;

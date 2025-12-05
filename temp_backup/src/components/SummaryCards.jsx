import React from 'react';

const SummaryCards = ({ transactions }) => {
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
                    <div className="summary-label" style={{ fontSize: '0.8rem' }}>Transações</div>
                    <div className="summary-value" style={{ fontSize: '1.2rem' }}>{totalTransactions}</div>
                    <div className="summary-detail" style={{ fontSize: '0.75rem' }}>
                        {totalExpenses} despesas • {totalIncome} receitas
                    </div>
                </div>
            </div>

            {largestExpense && (
                <div className="summary-card glass-panel" style={{ padding: '15px', minHeight: 'auto' }}>
                    <div className="summary-icon" style={{ fontSize: '1.5rem', width: '40px', height: '40px' }}>💸</div>
                    <div className="summary-content">
                        <div className="summary-label" style={{ fontSize: '0.8rem' }}>Maior Despesa</div>
                        <div className="summary-value expense" style={{ fontSize: '1.2rem' }}>R$ {largestExpense.amount.toFixed(2)}</div>
                        <div className="summary-detail" style={{ fontSize: '0.75rem' }}>{largestExpense.description}</div>
                    </div>
                </div>
            )}

            {largestIncome && (
                <div className="summary-card glass-panel" style={{ padding: '15px', minHeight: 'auto' }}>
                    <div className="summary-icon" style={{ fontSize: '1.5rem', width: '40px', height: '40px' }}>💰</div>
                    <div className="summary-content">
                        <div className="summary-label" style={{ fontSize: '0.8rem' }}>Maior Receita</div>
                        <div className="summary-value income" style={{ fontSize: '1.2rem' }}>R$ {largestIncome.amount.toFixed(2)}</div>
                        <div className="summary-detail" style={{ fontSize: '0.75rem' }}>{largestIncome.description}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SummaryCards;

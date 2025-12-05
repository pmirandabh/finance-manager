import React, { useState } from 'react';
import { formatCurrency } from '../utils/currencyFormatter';
import { useLanguage } from '../context/LanguageContext';

const CategoryChart = ({ transactions, categories }) => {
    const { t, locale, currency } = useLanguage();
    const [viewType, setViewType] = useState('expense'); // 'expense' or 'income'

    // Group transactions by category based on selected type
    const categoryTotals = transactions
        .filter(t => t.type === viewType && t.isPaid)
        .reduce((acc, t) => {
            const categoryId = t.categoryId;
            acc[categoryId] = (acc[categoryId] || 0) + t.amount;
            return acc;
        }, {});

    const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

    // Convert to array and sort by amount
    const categoryData = Object.entries(categoryTotals)
        .map(([categoryId, amount]) => {
            const category = categories.find(c => c.id == categoryId) || {
                name: 'Sem Categoria',
                color: '#b2bec3',
                icon: '❓'
            };
            return {
                ...category,
                amount,
                percentage: (amount / total) * 100
            };
        })
        .sort((a, b) => b.amount - a.amount);

    return (
        <div className="glass-panel card" style={{ padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2 style={{ margin: 0, fontSize: '1rem' }}>📊 {viewType === 'expense' ? t('categoryChart.expenses') : t('categoryChart.income')} {t('categoryChart.byCategory')}</h2>
                <div className="type-selector" style={{ gap: '5px' }}>
                    <button
                        type="button"
                        className={`type-option ${viewType === 'expense' ? 'selected expense' : ''}`}
                        onClick={() => setViewType('expense')}
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                        💸 {t('categoryChart.expenses')}
                    </button>
                    <button
                        type="button"
                        className={`type-option ${viewType === 'income' ? 'selected income' : ''}`}
                        onClick={() => setViewType('income')}
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                        💰 {t('categoryChart.income')}
                    </button>
                </div>
            </div>

            {total === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 10px', fontSize: '0.9rem' }}>
                    {viewType === 'expense' ? t('categoryChart.noExpenseConfirmed') : t('categoryChart.noIncomeConfirmed')}
                </p>
            ) : (
                <>
                    <div className="category-chart-vertical" style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        height: '150px',
                        gap: '10px',
                        paddingTop: '10px',
                        overflowX: 'auto'
                    }}>
                        {categoryData.map((cat, index) => (
                            <div key={cat.id || index} className="category-bar-item-vertical" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                height: '100%',
                                flex: 1,
                                minWidth: '35px'
                            }}>
                                <div className="category-bar-value" style={{ marginBottom: '3px', fontSize: '0.7rem' }}>
                                    {cat.percentage.toFixed(0)}%
                                </div>
                                <div
                                    className="category-bar-fill-vertical"
                                    style={{
                                        width: '100%',
                                        height: `${Math.max(cat.percentage, 2)}%`,
                                        backgroundColor: cat.color,
                                        borderRadius: '6px 6px 0 0',
                                        transition: 'height 0.5s ease',
                                        minHeight: '4px'
                                    }}
                                    title={formatCurrency(cat.amount, locale, currency)}
                                ></div>
                                <div className="category-bar-label-vertical" style={{ marginTop: '5px', textAlign: 'center' }}>
                                    <div className="category-icon-mini" style={{ backgroundColor: cat.color, margin: '0 auto 3px', width: '20px', height: '20px', fontSize: '0.8rem' }}>
                                        {cat.icon}
                                    </div>
                                    <span className="category-bar-name" style={{ fontSize: '0.7rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60px' }}>
                                        {cat.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {t('categoryChart.total')}: <strong>{formatCurrency(total, locale, currency)}</strong>
                    </div>
                </>
            )}
        </div>
    );
};

export default CategoryChart;

import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/currencyFormatter';
import { useLanguage } from '../context/LanguageContext';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = ({ transactions, categories }) => {
    const { t, locale, currency } = useLanguage();
    const [startMonth, setStartMonth] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 5);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    });

    const [endMonth, setEndMonth] = useState(() => {
        const date = new Date();
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    });

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [transactionType, setTransactionType] = useState('expense'); // 'expense', 'income', 'both'

    // Filter transactions by date range and type
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            if (t.isTemplate) return false;
            if (!t.isPaid) return false;

            // Date filter
            if (t.competenceMonth && (t.competenceMonth < startMonth || t.competenceMonth > endMonth)) {
                return false;
            }

            // Type filter
            if (transactionType !== 'both' && t.type !== transactionType) {
                return false;
            }

            // Category filter
            if (selectedCategories.length > 0 && !selectedCategories.includes(t.categoryId)) {
                return false;
            }

            return true;
        });
    }, [transactions, startMonth, endMonth, selectedCategories, transactionType]);

    // Pie Chart Data - Category Distribution
    const pieChartData = useMemo(() => {
        const categoryTotals = {};
        filteredTransactions.forEach(t => {
            categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + t.amount;
        });

        return Object.entries(categoryTotals).map(([categoryId, amount]) => {
            const category = categories.find(c => c.id == categoryId) || { name: 'Sem Categoria', color: '#999' };
            return {
                name: category.name,
                value: amount,
                color: category.color
            };
        }).sort((a, b) => b.value - a.value);
    }, [filteredTransactions, categories]);

    // Bar Chart Data - Monthly Comparison
    const barChartData = useMemo(() => {
        const monthlyData = {};

        filteredTransactions.forEach(t => {
            const month = t.competenceMonth || 'Sem mês';
            if (!monthlyData[month]) {
                monthlyData[month] = { month, income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                monthlyData[month].income += t.amount;
            } else {
                monthlyData[month].expense += t.amount;
            }
        });

        return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
    }, [filteredTransactions]);

    // Line Chart Data - Balance Evolution
    const lineChartData = useMemo(() => {
        const monthlyBalance = {};

        filteredTransactions.forEach(t => {
            const month = t.competenceMonth || 'Sem mês';
            if (!monthlyBalance[month]) {
                monthlyBalance[month] = { month, balance: 0 };
            }
            if (t.type === 'income') {
                monthlyBalance[month].balance += t.amount;
            } else {
                monthlyBalance[month].balance -= t.amount;
            }
        });

        return Object.values(monthlyBalance).sort((a, b) => a.month.localeCompare(b.month));
    }, [filteredTransactions]);

    // Summary Statistics
    const stats = useMemo(() => {
        const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

        const monthCount = new Set(filteredTransactions.map(t => t.competenceMonth)).size;
        const avgMonthlyExpense = monthCount > 0 ? totalExpense / monthCount : 0;

        const topCategory = pieChartData[0] || { name: 'N/A', value: 0 };

        return {
            totalIncome,
            totalExpense,
            avgMonthlyExpense,
            topCategory: topCategory.name,
            topCategoryAmount: topCategory.value
        };
    }, [filteredTransactions, pieChartData]);

    const formatMonth = (monthStr) => {
        if (!monthStr || monthStr === 'Sem mês') return monthStr;
        const [year, month] = monthStr.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return `${monthNames[parseInt(month) - 1]}/${year}`;
    };

    return (
        <div style={{ padding: '20px' }}>
            {/* Filters Panel */}
            <div className="glass-panel card" style={{ marginBottom: '30px' }}>
                <h2>🔍 {t('analytics.filters')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div className="form-group">
                        <label>{t('analytics.startPeriod')}</label>
                        <input
                            type="month"
                            className="form-control"
                            value={startMonth}
                            onChange={(e) => setStartMonth(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('analytics.endPeriod')}</label>
                        <input
                            type="month"
                            className="form-control"
                            value={endMonth}
                            onChange={(e) => setEndMonth(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('analytics.transactionType')}</label>
                        <select
                            className="form-control"
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)}
                        >
                            <option value="expense" style={{ backgroundColor: '#1e1e1e', color: '#ffffff' }}>{t('analytics.expenses')}</option>
                            <option value="income" style={{ backgroundColor: '#1e1e1e', color: '#ffffff' }}>{t('analytics.income')}</option>
                            <option value="both" style={{ backgroundColor: '#1e1e1e', color: '#ffffff' }}>{t('analytics.both')}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards" style={{ marginBottom: '30px' }}>
                <div className="summary-card glass-panel">
                    <div className="summary-icon">💰</div>
                    <div className="summary-content">
                        <div className="summary-label">{t('analytics.totalIncome')}</div>
                        <div className="summary-value income">{formatCurrency(stats.totalIncome, locale, currency)}</div>
                    </div>
                </div>
                <div className="summary-card glass-panel">
                    <div className="summary-icon">💸</div>
                    <div className="summary-content">
                        <div className="summary-label">{t('analytics.totalExpenses')}</div>
                        <div className="summary-value expense">{formatCurrency(stats.totalExpense, locale, currency)}</div>
                    </div>
                </div>
                <div className="summary-card glass-panel">
                    <div className="summary-icon">📊</div>
                    <div className="summary-content">
                        <div className="summary-label">{t('analytics.monthlyAverage')}</div>
                        <div className="summary-value">{formatCurrency(stats.avgMonthlyExpense, locale, currency)}</div>
                    </div>
                </div>
                <div className="summary-card glass-panel">
                    <div className="summary-icon">🏆</div>
                    <div className="summary-content">
                        <div className="summary-label">{t('analytics.topCategory')}</div>
                        <div className="summary-value" style={{ fontSize: '1.2rem' }}>{stats.topCategory}</div>
                        <div className="summary-detail">{formatCurrency(stats.topCategoryAmount, locale, currency)}</div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="analytics-grid">
                {/* Pie Chart */}
                <div className="glass-panel card">
                    <h2>{t('analytics.categoryDistribution')}</h2>
                    {pieChartData.length > 0 ? (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius="70%"
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value, locale, currency)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                            {t('analytics.noData')}
                        </p>
                    )}
                </div>

                {/* Bar Chart */}
                <div className="glass-panel card">
                    <h2>{t('analytics.monthlyComparison')}</h2>
                    {barChartData.length > 0 ? (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="month" tickFormatter={formatMonth} stroke="var(--text-secondary)" />
                                    <YAxis stroke="var(--text-secondary)" />
                                    <Tooltip
                                        formatter={(value) => formatCurrency(value, locale, currency)}
                                        labelFormatter={formatMonth}
                                        contentStyle={{ backgroundColor: 'var(--surface-color)', border: '1px solid rgba(255,255,255,0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" fill="#03dac6" name={t('analytics.income')} />
                                    <Bar dataKey="expense" fill="#cf6679" name={t('analytics.expenses')} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                            {t('analytics.noData')}
                        </p>
                    )}
                </div>

                {/* Line Chart */}
                <div className="glass-panel card full-width-card">
                    <h2>{t('analytics.balanceEvolution')}</h2>
                    {lineChartData.length > 0 ? (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="month" tickFormatter={formatMonth} stroke="var(--text-secondary)" />
                                    <YAxis stroke="var(--text-secondary)" />
                                    <Tooltip
                                        formatter={(value) => formatCurrency(value, locale, currency)}
                                        labelFormatter={formatMonth}
                                        contentStyle={{ backgroundColor: 'var(--surface-color)', border: '1px solid rgba(255,255,255,0.1)' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="balance" stroke="#bb86fc" strokeWidth={2} name={t('analytics.balance')} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                            {t('analytics.noData')}
                        </p>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Analytics;

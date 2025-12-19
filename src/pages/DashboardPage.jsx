import React from 'react';
import { useOutletContext } from 'react-router-dom';
import MonthFilter from '../components/MonthFilter';
import TransactionFilters from '../components/TransactionFilters';
import SummaryCards from '../components/SummaryCards';
import CategoryChart from '../components/CategoryChart';
import TransactionForm from '../components/TransactionForm';
import Dashboard from '../components/Dashboard';
import RecurringTransactions from '../components/RecurringTransactions';
import EditTransactionModal from '../components/EditTransactionModal';
import { formatCurrency } from '../utils/currencyFormatter';
import { useLanguage } from '../context/LanguageContext';

const DashboardPage = () => {
    const { t, locale, currency } = useLanguage();
    const {
        transactions,
        categories,
        financialSummary,
        selectedMonth,
        setSelectedMonth,
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        handleClearFilters,
        filteredTransactions,
        handleAddTransaction,
        handleDeleteTransaction,
        handlePayTransaction,
        handleSkipTransaction,
        setEditingTransaction,
        editingTransaction,
        handleEditTransaction,
        lastAddedTransactionId
    } = useOutletContext();

    return (
        <>
            <div id="month-filter">
                <MonthFilter currentMonth={selectedMonth} onMonthChange={setSelectedMonth} />
            </div>

            <TransactionFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                categories={categories}
                onClearFilters={handleClearFilters}
            />

            <SummaryCards transactions={filteredTransactions} />

            <div className="dashboard-grid" style={{ marginTop: '24px', gap: '20px' }}>
                {/* Left Column: Balance + Chart */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Balance Card */}
                    <div id="balance-card" className="glass-panel card" style={{ padding: '15px' }}>
                        <h2 style={{ fontSize: '1rem', marginBottom: '10px' }}>{t('app.currentBalance')}</h2>
                        <div className={`amount-display ${financialSummary.balance >= 0 ? 'income' : 'expense'}`}
                            style={{ fontSize: '2rem', marginBottom: '15px' }}>
                            {formatCurrency(financialSummary.balance, locale, currency)}
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div>
                                <small style={{ fontSize: '0.75rem' }}>{t('app.income')}</small>
                                <div className="income" style={{ fontSize: '1rem' }}>
                                    {formatCurrency(financialSummary.income, locale, currency)}
                                </div>
                            </div>
                            <div>
                                <small style={{ fontSize: '0.75rem' }}>{t('app.expense')}</small>
                                <div className="expense" style={{ fontSize: '1rem' }}>
                                    {formatCurrency(financialSummary.expense, locale, currency)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Chart */}
                    <CategoryChart
                        transactions={filteredTransactions}
                        categories={categories}
                    />
                </div>

                {/* Right Column: Transaction Form + Last Transactions + Pending */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <TransactionForm onAddTransaction={handleAddTransaction} categories={categories} />

                    <Dashboard
                        transactions={filteredTransactions}
                        categories={categories}
                        onDeleteTransaction={handleDeleteTransaction}
                        onEditTransaction={setEditingTransaction}
                        lastAddedTransactionId={lastAddedTransactionId}
                        onNewTransaction={() => {
                            const toggle = document.getElementById('transaction-form-toggle');
                            const input = document.getElementById('transaction-description');

                            if (toggle && !toggle.classList.contains('expanded')) {
                                toggle.click();
                                setTimeout(() => {
                                    const inputAfterExpand = document.getElementById('transaction-description');
                                    if (inputAfterExpand) {
                                        inputAfterExpand.focus();
                                        inputAfterExpand.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }
                                }, 100);
                            } else if (input) {
                                input.focus();
                                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        }}
                    />

                    <RecurringTransactions
                        transactions={transactions}
                        onPayTransaction={handlePayTransaction}
                        onSkipTransaction={handleSkipTransaction}
                        categories={categories}
                        onDeleteTransaction={handleDeleteTransaction}
                    />
                </div>
            </div>

            {editingTransaction && (
                <EditTransactionModal
                    transaction={editingTransaction}
                    categories={categories}
                    onSave={handleEditTransaction}
                    onCancel={() => setEditingTransaction(null)}
                />
            )}
        </>
    );
};

export default DashboardPage;

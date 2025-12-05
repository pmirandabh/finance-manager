import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Register from './components/Register';
import UpdatePassword from './components/UpdatePassword';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import CategoryManager from './components/CategoryManager';
import RecurringTransactions from './components/RecurringTransactions';
import MonthFilter from './components/MonthFilter';
import CategoryChart from './components/CategoryChart';
import SummaryCards from './components/SummaryCards';
import EditTransactionModal from './components/EditTransactionModal';
import DataManagement from './components/DataManagement';
import Settings from './components/Settings';
import BetaSettings from './components/BetaSettings';
import Sidebar from './components/Sidebar';
import Analytics from './components/Analytics';
import AdminDashboard from './components/AdminDashboard';
import ProfileEditModal from './components/ProfileEditModal';
import OnboardingTour from './components/OnboardingTour';
import TransactionFilters from './components/TransactionFilters';
import { defaultCategories } from './utils/defaultCategories';
import { processRecurringTransactions } from './utils/recurring';
import { migrateTransactions } from './utils/migration';
import { StorageService } from './services/StorageService';
import { useFinancialSummary } from './hooks/useFinancialSummary';
import { formatCurrency } from './utils/currencyFormatter';
import toast from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/main.css';

const MainApp = () => {
  const { user, logout, profile, isAdmin } = useAuth();
  const { t, locale, currency } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lastAddedTransactionId, setLastAddedTransactionId] = useState(null);
  const [runTour, setRunTour] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setRunTour(true);
    }
  }, []);

  const handleTourFinish = () => {
    setRunTour(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  // Filter transactions by selected month
  const filterTransactionsByMonth = (transactions, month) => {
    const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;

    return transactions.filter(t => {
      if (t.isTemplate) return false; // Don't show templates

      // Use competenceMonth for filtering
      if (t.competenceMonth) {
        return t.competenceMonth === monthKey;
      }

      // Fallback for old data without competenceMonth
      if (t.createdDate) {
        const transactionDate = new Date(t.createdDate);
        return transactionDate.getMonth() === month.getMonth() &&
          transactionDate.getFullYear() === month.getFullYear();
      }

      return false;
    });
  };

  // Apply search and category filters
  const applyFilters = (transactions) => {
    let filtered = transactions;

    // Search by description
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(t => t.categoryId === categoryFilter);
    }

    return filtered;
  };

  const monthFilteredTransactions = useMemo(() =>
    filterTransactionsByMonth(transactions, selectedMonth),
    [transactions, selectedMonth]
  );

  const filteredTransactions = useMemo(() =>
    applyFilters(monthFilteredTransactions),
    [monthFilteredTransactions, searchTerm, categoryFilter]
  );

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
  };

  // Calculate financial summary once (optimization)
  // Calculate financial summary using hook
  const financialSummary = useFinancialSummary(filteredTransactions);

  // Load data when user logs in (only once)
  useEffect(() => {
    if (user && !hasLoadedData) {
      loadUserData();
    }
  }, [user, hasLoadedData]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      toast.success(t('app.connectionRestored'), { icon: '🌐' });
    };

    const handleOffline = () => {
      toast.error(t('app.noConnection'), { icon: '📡', duration: 5000 });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [t]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Load Categories
      const loadedCategories = await StorageService.loadCategories(user.id);

      // Load Transactions
      const loadedTransactions = await StorageService.loadTransactions(user.id);

      // Process recurring transactions
      const processedTransactions = processRecurringTransactions(loadedTransactions);

      // Find only NEW transactions that were generated
      const newTransactions = processedTransactions.filter(t =>
        !loadedTransactions.some(loaded => loaded.id === t.id)
      );

      // Save ONLY the new recurring instances FIRST (before updating state)
      if (newTransactions.length > 0) {
        // Save each new transaction individually and wait for all to complete
        for (const transaction of newTransactions) {
          await StorageService.saveTransaction(user.id, transaction);
        }
      }

      // THEN update local state (after saving to database)
      setTransactions(processedTransactions);
      setCategories(loadedCategories);

      // Mark data as loaded
      setHasLoadedData(true);

    } catch (error) {
      console.error("Failed to load user data:", error);
      toast.error(t('app.errorLoading'));
    } finally {
      setIsLoading(false);
    }
  };

  const saveTransactions = async (newTransactions) => {
    setTransactions(newTransactions);
    await StorageService.saveTransactions(user.id, newTransactions);
  };

  const handleAddTransaction = async (newTransaction) => {
    // Save the new transaction individually
    await StorageService.saveTransaction(user.id, newTransaction);

    // Update local state by adding the new transaction
    setTransactions(prev => [newTransaction, ...prev]);

    // Highlight the new transaction
    setLastAddedTransactionId(newTransaction.id);
    setTimeout(() => setLastAddedTransactionId(null), 3000); // Clear highlight after 3 seconds
  };

  const handleDeleteTransaction = async (id) => {
    try {
      // Delete from database
      await StorageService.deleteTransaction(user.id, id);

      // Update local state
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error(t('app.categoryDeleteError')); // Using generic delete error or create specific
    }
  };

  const handlePayTransaction = async (transactionId) => {
    try {
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) return;

      const updatedTransaction = {
        ...transaction,
        isPaid: true,
        paymentDate: new Date().toISOString()
      };

      // Update in database (single transaction)
      await StorageService.saveTransaction(user.id, updatedTransaction);

      // Update local state
      setTransactions(prev => prev.map(t =>
        t.id === transactionId ? updatedTransaction : t
      ));

      toast.success(t('app.paymentConfirmed'));
    } catch (error) {
      console.error('Error paying transaction:', error);
      toast.error(t('app.paymentError'));
    }
  };

  const handleSkipTransaction = async (transactionId, justification) => {
    try {
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) return;

      const updatedTransaction = {
        ...transaction,
        isSkipped: true,
        notes: `[DISPENSADA] ${justification}`
      };

      // Update in database (single transaction)
      await StorageService.saveTransaction(user.id, updatedTransaction);

      // Update local state
      setTransactions(prev => prev.map(t =>
        t.id === transactionId ? updatedTransaction : t
      ));

      toast.success(t('app.skipSuccess'));
    } catch (error) {
      console.error('Erro ao dispensar:', error);
      toast.error(t('app.skipError'));
    }
  };

  const handleEditTransaction = async (updatedTransaction) => {
    try {
      // Update in database (single transaction)
      await StorageService.saveTransaction(user.id, updatedTransaction);

      // Update local state
      setTransactions(prev => prev.map(t =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      ));

      setEditingTransaction(null);
      toast.success(t('app.updateSuccess'));
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error(t('app.updateError'));
    }
  };

  const handleImportData = async (data) => {
    // Validate import data structure
    if (!data || typeof data !== 'object') {
      toast.error(t('app.importError'));
      return;
    }

    if (data.transactions && !Array.isArray(data.transactions)) {
      toast.error(t('app.importError'));
      return;
    }

    if (data.categories && !Array.isArray(data.categories)) {
      toast.error(t('app.importError'));
      return;
    }

    // Import transactions
    if (data.transactions) {
      try {
        const migratedTransactions = migrateTransactions(data.transactions);
        saveTransactions(migratedTransactions);
      } catch (error) {
        console.error('Error importing transactions:', error);
        toast.error(t('app.importError'));
        return;
      }
    }

    // Import categories
    if (data.categories) {
      try {
        setCategories(data.categories);
        await StorageService.saveCategories(user.id, data.categories);
      } catch (error) {
        console.error('Error importing categories:', error);
        toast.error(t('app.importError'));
        return;
      }
    }

    toast.success(t('app.importSuccess'));
    setActiveView('dashboard');
  };

  const handleSaveCategory = async (category) => {
    try {
      await StorageService.saveCategory(user.id, category);

      // Reload categories to get updated list
      const updatedCategories = await StorageService.loadCategories(user.id);
      setCategories(updatedCategories);

      toast.success(t('app.categorySaved'));
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(t('app.categorySaveError'));
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await StorageService.deleteCategory(user.id, categoryId);

      // Update local state
      const updatedCategories = categories.filter(c => c.id !== categoryId);
      setCategories(updatedCategories);

      toast.success(t('app.categoryDeleted'));
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(t('app.categoryDeleteError'));
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onLogout={logout}
        isAdmin={isAdmin}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
            <div style={{ fontSize: '1.2rem', color: 'white' }}>{t('common.loading')}</div>
          </div>
        </div>
      )}

      <div className="main-content">
        {/* Dedicated Branding Bar */}
        <div style={{ marginBottom: '5px', paddingBottom: '5px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', background: 'linear-gradient(45deg, #BB86FC, #03DAC6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.7rem', WebkitTextFillColor: '#03DAC6' }}>$</span>
            Saldo+ v1.0
          </h1>
          <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block', marginTop: '2px' }}>
            {t('menu.subtitle')}
          </small>
          <small style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', display: 'block', marginTop: '0px', opacity: 0.7 }}>
            Desenvolvido por Paulo Miranda
          </small>

          {/* Gradient Separator Line */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)'
          }} />
        </div>

        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="hamburger-menu"
              onClick={() => setIsSidebarOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '1.3rem',
                cursor: 'pointer',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ☰
            </button>

            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {activeView === 'dashboard' && <><span style={{ fontSize: '1.4rem' }}>📊</span> {t('app.overview')}</>}
              {activeView === 'analytics' && <><span style={{ fontSize: '1.4rem' }}>📈</span> {t('app.analytics')}</>}
              {activeView === 'settings' && <><span style={{ fontSize: '1.4rem' }}>⚙️</span> {t('app.settings')}</>}
              {activeView === 'admin' && <><span style={{ fontSize: '1.4rem' }}>🛡️</span> {t('app.admin')}</>}
            </h2>
          </div>
          <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{t('app.hello')}, {profile?.name || user?.email}</span>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="btn btn-ghost"
              style={{ padding: '5px 10px', fontSize: '1.2rem' }}
              title={t('profile.editProfile')}
            >
              ⚙️
            </button>
          </div>
        </header>

        {activeView === 'settings' ? (
          <Settings
            categories={categories}
            onSaveCategory={handleSaveCategory}
            onDeleteCategory={handleDeleteCategory}
            transactions={transactions}
            onImportData={handleImportData}
          />
        ) : activeView === 'analytics' ? (
          <Analytics
            transactions={transactions}
            categories={categories}
          />
        ) : activeView === 'admin' && isAdmin ? (
          <AdminDashboard />
        ) : (
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

                    // If form is not expanded (input not visible or toggle doesn't have expanded class)
                    if (toggle && !toggle.classList.contains('expanded')) {
                      toggle.click();
                      // Wait for animation/render
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
          </>
        )}

        {editingTransaction && (
          <EditTransactionModal
            transaction={editingTransaction}
            categories={categories}
            onSave={handleEditTransaction}
            onCancel={() => setEditingTransaction(null)}
          />
        )}

        <ProfileEditModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />

        <OnboardingTour run={runTour} onFinish={handleTourFinish} />
      </div>
    </div>
  );
};

const App = () => {
  const { user } = useAuth();
  return user ? <MainApp /> : <div className="auth-container"><Login /></div>;
};

const AppWrapper = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthConsumer isRegistering={isRegistering} setIsRegistering={setIsRegistering} />
      </AuthProvider>
    </ErrorBoundary>
  );
};

const AuthConsumer = ({ isRegistering, setIsRegistering }) => {
  const { user } = useAuth();
  const { language, changeLanguage, t } = useLanguage(); // Importar useLanguage
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsUpdatingPassword(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (user && !isUpdatingPassword) {
    return <MainApp />;
  }

  return (
    <div className="auth-container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      position: 'relative' // Para posicionar o seletor
    }}>
      {/* Seletor de Idioma Flutuante */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '8px 16px',
            cursor: 'pointer',
            outline: 'none',
            fontSize: '0.9rem',
            backdropFilter: 'blur(10px)'
          }}
        >
          <option value="pt-BR">🇧🇷 Português</option>
          <option value="en-US">🇺🇸 English</option>
        </select>
      </div>

      <div className="auth-card glass-panel" style={{
        maxWidth: '500px',
        minWidth: '400px',
        width: '100%'
      }}>
        {isUpdatingPassword ? (
          <UpdatePassword onPasswordUpdated={() => setIsUpdatingPassword(false)} />
        ) : isRegistering ? (
          <Register onSwitchToLogin={() => setIsRegistering(false)} />
        ) : (
          <Login onSwitchToRegister={() => setIsRegistering(true)} />
        )}
      </div>
    </div>
  );
};

export default AppWrapper;

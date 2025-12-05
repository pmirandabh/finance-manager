import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
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
import Sidebar from './components/Sidebar';
import Analytics from './components/Analytics';
import { defaultCategories } from './utils/defaultCategories';
import { processRecurringTransactions } from './utils/recurring';
import { migrateTransactions } from './utils/migration';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/main.css';

const MainApp = () => {
  const { currentUser, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'analytics', 'settings'
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isElectron = window.require !== undefined;

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

  const filteredTransactions = filterTransactionsByMonth(transactions, selectedMonth);

  // Calculate financial summary once (optimization)
  const financialSummary = useMemo(() => {
    const paidTransactions = filteredTransactions.filter(t => t.isPaid && !t.isTemplate);
    const income = paidTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = paidTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  // Load data when user logs in
  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      let loadedCategories = [];
      let loadedTransactions = [];
      let shouldSaveTransactions = false;

      if (isElectron) {
        const { ipcRenderer } = window.require('electron');

        // Load Categories
        loadedCategories = await ipcRenderer.invoke('get-categories', currentUser.id);
        if (!loadedCategories || loadedCategories.length === 0) {
          loadedCategories = [
            ...defaultCategories.expense.map(c => ({ ...c, id: Date.now() + Math.random(), type: 'expense', isActive: true })),
            ...defaultCategories.income.map(c => ({ ...c, id: Date.now() + Math.random(), type: 'income', isActive: true }))
          ];
          await ipcRenderer.invoke('save-categories', currentUser.id, loadedCategories);
        } else {
          // Migrate existing categories to have isActive field
          loadedCategories = loadedCategories.map(cat => ({
            ...cat,
            isActive: cat.isActive !== undefined ? cat.isActive : true
          }));
          await ipcRenderer.invoke('save-categories', currentUser.id, loadedCategories);
        }

        // Load Transactions
        loadedTransactions = await ipcRenderer.invoke('get-transactions', currentUser.id) || [];

        // Migrate old data to new format
        loadedTransactions = migrateTransactions(loadedTransactions);
      } else {
        // Fallback for browser dev mode
        const savedTransactions = localStorage.getItem(`transactions_${currentUser.id}`);
        if (savedTransactions) {
          loadedTransactions = JSON.parse(savedTransactions);
          loadedTransactions = migrateTransactions(loadedTransactions);
        }

        const savedCategories = localStorage.getItem(`categories_${currentUser.id}`);
        if (savedCategories) {
          loadedCategories = JSON.parse(savedCategories);
          // Migrate existing categories to have isActive field
          loadedCategories = loadedCategories.map(cat => ({
            ...cat,
            isActive: cat.isActive !== undefined ? cat.isActive : true
          }));
          localStorage.setItem(`categories_${currentUser.id}`, JSON.stringify(loadedCategories));
        } else {
          loadedCategories = [
            ...defaultCategories.expense.map(c => ({ ...c, id: Date.now() + Math.random(), type: 'expense', isActive: true })),
            ...defaultCategories.income.map(c => ({ ...c, id: Date.now() + Math.random(), type: 'income', isActive: true }))
          ];
          localStorage.setItem(`categories_${currentUser.id}`, JSON.stringify(loadedCategories));
        }
      }

      // Process recurring transactions
      const processedTransactions = processRecurringTransactions(loadedTransactions);

      // Check if new transactions were generated
      if (processedTransactions.length !== loadedTransactions.length) {
        shouldSaveTransactions = true;
      }

      setTransactions(processedTransactions);
      setCategories(loadedCategories);

      // Save back if new recurring instances were generated
      if (shouldSaveTransactions) {
        saveTransactions(processedTransactions);
      }

    } catch (error) {
      console.error("Failed to load user data:", error);
      alert('❌ Erro ao carregar dados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTransactions = async (newTransactions) => {
    setTransactions(newTransactions);
    if (isElectron) {
      const { ipcRenderer } = window.require('electron');
      await ipcRenderer.invoke('save-transactions', currentUser.id, newTransactions);
    } else {
      localStorage.setItem(`transactions_${currentUser.id}`, JSON.stringify(newTransactions));
    }
  };

  const handleAddTransaction = (newTransaction) => {
    const updatedTransactions = [...transactions, newTransaction];
    saveTransactions(updatedTransactions);
  };

  const handleDeleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    saveTransactions(updatedTransactions);
  };

  const handlePayTransaction = (transactionId) => {
    const updatedTransactions = transactions.map(t => {
      if (t.id === transactionId) {
        return {
          ...t,
          isPaid: true,
          paymentDate: new Date().toISOString()
        };
      }
      return t;
    });
    saveTransactions(updatedTransactions);
  };

  const handleEditTransaction = (updatedTransaction) => {
    const updatedTransactions = transactions.map(t =>
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    saveTransactions(updatedTransactions);
    setEditingTransaction(null);
  };

  const handleImportData = (data) => {
    // Validate import data structure
    if (!data || typeof data !== 'object') {
      alert('❌ Erro: Arquivo inválido. O arquivo deve ser um JSON válido.');
      return;
    }

    if (data.transactions && !Array.isArray(data.transactions)) {
      alert('❌ Erro: Formato de transações inválido.');
      return;
    }

    if (data.categories && !Array.isArray(data.categories)) {
      alert('❌ Erro: Formato de categorias inválido.');
      return;
    }

    // Import transactions
    if (data.transactions) {
      try {
        const migratedTransactions = migrateTransactions(data.transactions);
        saveTransactions(migratedTransactions);
      } catch (error) {
        console.error('Error importing transactions:', error);
        alert('❌ Erro ao importar transações. Verifique o arquivo.');
        return;
      }
    }

    // Import categories
    if (data.categories) {
      try {
        setCategories(data.categories);
        if (isElectron) {
          const { ipcRenderer } = window.require('electron');
          ipcRenderer.invoke('save-categories', currentUser.id, data.categories);
        } else {
          localStorage.setItem(`categories_${currentUser.id}`, JSON.stringify(data.categories));
        }
      } catch (error) {
        console.error('Error importing categories:', error);
        alert('❌ Erro ao importar categorias. Verifique o arquivo.');
        return;
      }
    }

    alert('✅ Dados importados com sucesso!');
    setActiveView('dashboard');
  };

  const handleSaveCategory = async (category) => {
    let updatedCategories;
    if (categories.find(c => c.id === category.id)) {
      updatedCategories = categories.map(c => c.id === category.id ? category : c);
    } else {
      updatedCategories = [...categories, category];
    }
    setCategories(updatedCategories);

    if (isElectron) {
      const { ipcRenderer } = window.require('electron');
      await ipcRenderer.invoke('save-categories', currentUser.id, updatedCategories);
    } else {
      localStorage.setItem(`categories_${currentUser.id}`, JSON.stringify(updatedCategories));
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const updatedCategories = categories.filter(c => c.id !== categoryId);
    setCategories(updatedCategories);

    if (isElectron) {
      const { ipcRenderer } = window.require('electron');
      await ipcRenderer.invoke('save-categories', currentUser.id, updatedCategories);
    } else {
      localStorage.setItem(`categories_${currentUser.id}`, JSON.stringify(updatedCategories));
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onLogout={logout}
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
            <div style={{ fontSize: '1.2rem', color: 'white' }}>Carregando...</div>
          </div>
        </div>
      )}

      <div className="main-content" style={{ flex: 1, marginLeft: '230px', padding: '30px', maxWidth: '1200px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0 }}>
            {activeView === 'dashboard' && 'Visão Geral'}
            {activeView === 'analytics' && 'Análises'}
            {activeView === 'settings' && 'Configurações'}
          </h2>
          <div className="user-info">
            <span>Olá, {currentUser.username}</span>
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
        ) : (
          <>
            <MonthFilter currentMonth={selectedMonth} onMonthChange={setSelectedMonth} />

            <SummaryCards transactions={filteredTransactions} />

            <div className="dashboard-grid" style={{ marginTop: '24px', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Left Column: Balance + Chart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Balance Card */}
                <div className="glass-panel card" style={{ padding: '15px' }}>
                  <h2 style={{ fontSize: '1rem', marginBottom: '10px' }}>Saldo Atual</h2>
                  <div className={`amount-display ${financialSummary.balance >= 0 ? 'income' : 'expense'}`}
                    style={{ fontSize: '2rem', marginBottom: '15px' }}>
                    R$ {financialSummary.balance.toFixed(2)}
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div>
                      <small style={{ fontSize: '0.75rem' }}>Receitas</small>
                      <div className="income" style={{ fontSize: '1rem' }}>
                        R$ {financialSummary.income.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <small style={{ fontSize: '0.75rem' }}>Despesas</small>
                      <div className="expense" style={{ fontSize: '1rem' }}>
                        R$ {financialSummary.expense.toFixed(2)}
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
                />

                <RecurringTransactions
                  transactions={transactions}
                  onPayTransaction={handlePayTransaction}
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
      </div>
    </div>
  );
};

const App = () => {
  const { currentUser } = useAuth();
  return currentUser ? <MainApp /> : <div className="auth-container"><Login /></div>;
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
  const { currentUser } = useAuth();

  if (currentUser) {
    return <MainApp />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        {isRegistering ? (
          <Register onSwitchToLogin={() => setIsRegistering(false)} />
        ) : (
          <Login onSwitchToRegister={() => setIsRegistering(true)} />
        )}
      </div>
    </div>
  );
};

export default AppWrapper;

import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Sidebar from './Sidebar';
import ProfileEditModal from './ProfileEditModal';
import OnboardingTour from './OnboardingTour';
import { StorageService } from '../services/StorageService';
import { processRecurringTransactions } from '../utils/recurring';
import { migrateTransactions } from '../utils/migration';
import { useFinancialSummary } from '../hooks/useFinancialSummary';
import { defaultCategories } from '../utils/defaultCategories';
import toast from 'react-hot-toast';

const MainLayout = () => {
    const { user, logout, profile, isAdmin } = useAuth();
    const { t, locale, currency } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    // State Management (Moved from App.jsx)
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
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

    // Derived active view for header title only
    const getActiveViewTitle = () => {
        const path = location.pathname;
        if (path === '/analytics') return 'analytics';
        if (path === '/settings') return 'settings';
        if (path === '/admin') return 'admin';
        return 'dashboard';
    };

    const activeView = getActiveViewTitle();

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
            if (t.isTemplate) return false;
            if (t.competenceMonth) {
                return t.competenceMonth === monthKey;
            }
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
        if (searchTerm) {
            filtered = filtered.filter(t =>
                t.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
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

    const financialSummary = useFinancialSummary(filteredTransactions);

    // Load data
    useEffect(() => {
        if (user && !hasLoadedData) {
            loadUserData();
        }
    }, [user, hasLoadedData]);

    // Online/Offline listeners
    useEffect(() => {
        const handleOnline = () => toast.success(t('app.connectionRestored'), { icon: '🌐' });
        const handleOffline = () => toast.error(t('app.noConnection'), { icon: '📡', duration: 5000 });
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
            const loadedCategories = await StorageService.loadCategories(user.id);
            const loadedTransactions = await StorageService.loadTransactions(user.id);
            const processedTransactions = processRecurringTransactions(loadedTransactions);

            const newTransactions = processedTransactions.filter(t =>
                !loadedTransactions.some(loaded => loaded.id === t.id)
            );

            if (newTransactions.length > 0) {
                await Promise.all(
                    newTransactions.map(transaction =>
                        StorageService.saveTransaction(user.id, transaction)
                    )
                );
            }

            setTransactions(processedTransactions);
            setCategories(loadedCategories);
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
        await StorageService.saveTransaction(user.id, newTransaction);

        if (newTransaction.isRecurring && newTransaction.isTemplate) {
            const transactionsWithTemplate = [newTransaction, ...transactions];
            const processedTransactions = processRecurringTransactions(transactionsWithTemplate);
            const newInstances = processedTransactions.filter(t =>
                !transactionsWithTemplate.some(existing => existing.id === t.id)
            );

            if (newInstances.length > 0) {
                await Promise.all(
                    newInstances.map(transaction =>
                        StorageService.saveTransaction(user.id, transaction)
                    )
                );
            }
            setTransactions(processedTransactions);
        } else {
            setTransactions(prev => [newTransaction, ...prev]);
        }

        setLastAddedTransactionId(newTransaction.id);
        setTimeout(() => setLastAddedTransactionId(null), 3000);
    };

    const handleDeleteTransaction = async (id) => {
        try {
            await StorageService.deleteTransaction(user.id, id);
            const updatedTransactions = transactions.filter(t => t.id !== id);
            setTransactions(updatedTransactions);
        } catch (error) {
            console.error('Error deleting transaction:', error);
            toast.error(t('app.categoryDeleteError'));
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

            await StorageService.saveTransaction(user.id, updatedTransaction);
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

            await StorageService.saveTransaction(user.id, updatedTransaction);
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
            await StorageService.saveTransaction(user.id, updatedTransaction);
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
        // ... (Import logic remains same, just brief sync here)
        if (!data || typeof data !== 'object') {
            toast.error(t('app.importError'));
            return;
        }
        if (data.transactions && Array.isArray(data.transactions)) {
            try {
                const migratedTransactions = migrateTransactions(data.transactions);
                saveTransactions(migratedTransactions);
            } catch (error) {
                console.error('Error importing transactions:', error);
                toast.error(t('app.importError'));
                return;
            }
        }
        if (data.categories && Array.isArray(data.categories)) {
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
        navigate('/'); // Redirect to dashboard
    };

    const handleSaveCategory = async (category) => {
        try {
            await StorageService.saveCategory(user.id, category);
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
            const updatedCategories = categories.filter(c => c.id !== categoryId);
            setCategories(updatedCategories);
            toast.success(t('app.categoryDeleted'));
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error(t('app.categoryDeleteError'));
        }
    };

    // Navigation handler for Sidebar
    const handleNavigate = (view) => {
        if (view === 'dashboard') navigate('/');
        else navigate(`/${view}`);
    };

    return (
        <div className="app-container">
            <Sidebar
                activeView={activeView}
                onNavigate={handleNavigate}
                onLogout={logout}
                isAdmin={isAdmin}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {isLoading && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
                        <div style={{ fontSize: '1.2rem', color: 'white' }}>{t('common.loading')}</div>
                    </div>
                </div>
            )}

            <div className="main-content">
                {/* Branding Bar */}
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
                    <div style={{
                        position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)'
                    }} />
                </div>

                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            className="hamburger-menu"
                            onClick={() => setIsSidebarOpen(true)}
                            style={{
                                background: 'transparent', border: 'none', color: 'var(--text-primary)',
                                fontSize: '1.3rem', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center'
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

                <Outlet context={{
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
                    lastAddedTransactionId,
                    handleSaveCategory,
                    handleDeleteCategory,
                    handleImportData
                }} />

                <ProfileEditModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                />

                <OnboardingTour run={runTour} onFinish={handleTourFinish} />
            </div>
        </div>
    );
};

export default MainLayout;

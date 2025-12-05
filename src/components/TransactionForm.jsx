import React, { useState } from 'react';
import toast from 'react-hot-toast';
import CategorySelector from './CategorySelector';
import { validators } from '../utils/validators';
import { generateTransactionId } from '../utils/idGenerator';
import InfoTooltip from './InfoTooltip';
import { useLanguage } from '../context/LanguageContext';

const TransactionForm = ({ onAddTransaction, categories }) => {
    const { t } = useLanguage();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [categoryId, setCategoryId] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [notes, setNotes] = useState('');
    const [dueDate, setDueDate] = useState('');

    // Competence month defaults to current month
    const getCurrentMonthString = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };

    const [competenceMonth, setCompetenceMonth] = useState(getCurrentMonthString());

    const [isExpanded, setIsExpanded] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate description
        const descValidation = validators.validateDescription(description);
        if (!descValidation.isValid) {
            toast.error(descValidation.error);
            return;
        }

        // Validate amount
        const amountValidation = validators.validateAmount(amount);
        if (!amountValidation.isValid) {
            toast.error(amountValidation.error);
            return;
        }

        // Validate category
        if (!categoryId) {
            toast.error(t('transaction.selectCategory'));
            return;
        }

        // Validate due date if provided
        if (dueDate) {
            const dateValidation = validators.validateDate(dueDate, { notTooOld: true });
            if (!dateValidation.isValid) {
                toast.error(dateValidation.error);
                return;
            }
        }

        setIsLoading(true);
        try {
            const transaction = {
                id: generateTransactionId(),
                description: description.trim(),
                amount: parseFloat(amount),
                type,
                categoryId,
                competenceMonth,
                dueDate: dueDate || null,
                createdDate: new Date().toISOString(),
                paymentDate: null,
                isRecurring,
                isTemplate: isRecurring,
                isPaid: false,
                notes: notes.trim()
            };

            await onAddTransaction(transaction);

            // Show success message
            toast.success(type === 'expense' ? t('transaction.expenseAdded') : t('transaction.incomeAdded'));

            setDescription('');
            setAmount('');
            setCategoryId('');
            setIsRecurring(false);
            setNotes('');
            setDueDate('');
            setCompetenceMonth(getCurrentMonthString());
        } catch (error) {
            console.error('Error adding transaction:', error);
            toast.error(`${t('transaction.addError')}${error.message || t('common.tryAgain')}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset category when type changes
    const handleTypeChange = (newType) => {
        setType(newType);
        setCategoryId('');
    };

    return (
        <div className="glass-panel card" style={{ transition: 'all 0.3s ease', padding: '15px' }}>
            <div
                id="transaction-form-toggle"
                className={`glass-panel-header ${isExpanded ? 'expanded' : ''}`}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: isExpanded ? '15px' : '0'
                }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 style={{ margin: 0, fontSize: '1rem' }}>{t('dashboard.addTransaction')}</h2>
                <button
                    className="btn-icon"
                    style={{
                        background: 'var(--primary-color)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    {isExpanded ? '−' : '+'}
                </button>
            </div>

            {isExpanded && (
                <form onSubmit={handleSubmit} style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div className="form-group">
                        <label>{t('transaction.type')}</label>
                        <div className="type-selector">
                            <button
                                type="button"
                                className={`type-option ${type === 'expense' ? 'selected expense' : ''}`}
                                onClick={() => handleTypeChange('expense')}
                            >
                                💸 {t('transaction.expense')}
                            </button>
                            <button
                                type="button"
                                className={`type-option ${type === 'income' ? 'selected income' : ''}`}
                                onClick={() => handleTypeChange('income')}
                            >
                                💰 {t('transaction.income')}
                            </button>
                        </div>
                    </div>

                    <CategorySelector
                        categories={categories}
                        selectedCategoryId={categoryId}
                        type={type}
                        onChange={setCategoryId}
                    />

                    <div className="form-group">
                        <label>{t('transaction.description')}</label>
                        <input
                            type="text"
                            id="transaction-description"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('dashboard.descriptionPlaceholder')}
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('transaction.amount')}</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="form-control"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            onBlur={(e) => {
                                if (e.target.value) {
                                    const formatted = parseFloat(e.target.value).toFixed(2);
                                    setAmount(formatted);
                                }
                            }}
                            placeholder={t('transactionForm.amountPlaceholder')}
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('transaction.dueDate')} {t('common.optional')}</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            {t('transaction.competenceMonth')}
                            <InfoTooltip content="Mês a que se refere a conta (ex: conta de luz de Janeiro que vence em Fevereiro, a competência é Janeiro)." />
                        </label>
                        <input
                            type="month"
                            className="form-control"
                            value={competenceMonth}
                            onChange={(e) => setCompetenceMonth(e.target.value)}
                        />
                        <small className="help-text" style={{ marginLeft: 0 }}>
                            {t('transaction.competenceHelp')}
                        </small>
                    </div>

                    <div className="form-group">
                        <label>{t('transaction.notes')} {t('common.optional')}</label>
                        <textarea
                            className="form-control"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={t('common.notesPlaceholder')}
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                            />
                            <span>{t('transaction.recurring')} ({t('transactionForm.monthly').toLowerCase()})</span>
                            <InfoTooltip content="Repete todo mês automaticamente (ex: Netflix, Aluguel, Salário)." />
                        </label>
                        {isRecurring ? (
                            <small className="help-text">
                                {t('transaction.recurringHelp')}
                            </small>
                        ) : (
                            <small className="help-text">
                                {t('transaction.pendingHelp')}
                            </small>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                {t('common.saving')}
                            </>
                        ) : (
                            t('common.add')
                        )}
                    </button>
                </form>
            )}
        </div>
    );
};

export default TransactionForm;

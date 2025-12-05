import { useMemo } from 'react';
import { formatCurrency } from '../utils/currencyFormatter';

export const useFinancialSummary = (transactions) => {
    return useMemo(() => {
        // Include both paid and skipped transactions in history
        const paidTransactions = transactions.filter(t => (t.isPaid || t.isSkipped) && !t.isTemplate);

        const incomes = paidTransactions.filter(t => t.type === 'income');
        const expenses = paidTransactions.filter(t => t.type === 'expense');

        // Calculate totals excluding skipped transactions
        const income = incomes.filter(t => !t.isSkipped).reduce((sum, t) => sum + t.amount, 0);
        const expense = expenses.filter(t => !t.isSkipped).reduce((sum, t) => sum + t.amount, 0);

        return {
            income,
            expense,
            balance: income - expense,
            paidTransactions,
            incomes,
            expenses
        };
    }, [transactions]);
};

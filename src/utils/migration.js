// Migration utility to convert old transaction format to new format

export const migrateTransaction = (transaction) => {
    // If already has new fields, return as is
    if (transaction.competenceMonth && transaction.hasOwnProperty('paymentDate')) {
        return transaction;
    }

    // Extract month from old 'date' field
    const getCompetenceFromDate = (dateString) => {
        if (!dateString) {
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        }
        const d = new Date(dateString);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    };

    // Migrate old transaction to new format
    return {
        ...transaction,
        // New required fields
        competenceMonth: transaction.competenceMonth || getCompetenceFromDate(transaction.date),
        createdDate: transaction.createdDate || transaction.date || new Date().toISOString(),
        paymentDate: transaction.isPaid ? (transaction.date || new Date().toISOString()) : null,
        notes: transaction.notes || '',

        // Ensure boolean fields exist
        isPaid: transaction.isPaid !== undefined ? transaction.isPaid : false,
        isRecurring: transaction.isRecurring !== undefined ? transaction.isRecurring : false,
        isTemplate: transaction.isTemplate !== undefined ? transaction.isTemplate : false
    };
};

export const migrateTransactions = (transactions) => {
    if (!Array.isArray(transactions)) {
        return [];
    }
    return transactions.map(migrateTransaction);
};

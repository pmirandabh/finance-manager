// Helper functions
const getMonthKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
};

export const processRecurringTransactions = (transactions) => {
    const templates = transactions.filter(t => t.isRecurring && t.isTemplate);
    const nonTemplates = transactions.filter(t => !t.isTemplate);

    const now = new Date();
    const generated = [];

    // Generate for current month + next 2 months (3 months total)
    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
        const targetMonth = addMonths(now, monthOffset);
        const targetMonthKey = getMonthKey(targetMonth);

        templates.forEach(template => {
            // Check if already exists for this month
            const exists = nonTemplates.some(t =>
                t.templateId === template.id &&
                t.competenceMonth === targetMonthKey
            );

            if (!exists && !generated.some(t => t.templateId === template.id && t.competenceMonth === targetMonthKey)) {
                // Calculate new due date if template has one
                let newDueDate = null;
                if (template.dueDate) {
                    const templateDate = new Date(template.dueDate);
                    // Create date in target month with same day
                    const targetDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), templateDate.getDate() + 1); // +1 to fix timezone offset issue if any, or just use UTC?
                    // Better: use string manipulation to avoid timezone issues
                    // targetMonthKey is YYYY-MM
                    const day = String(templateDate.getUTCDate()).padStart(2, '0');
                    // Check for invalid dates (e.g. Feb 30)
                    const year = targetMonth.getFullYear();
                    const month = targetMonth.getMonth();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const validDay = Math.min(parseInt(day), daysInMonth);

                    newDueDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(validDay).padStart(2, '0')}`;
                }

                // Generate UUID v4 for new transaction
                const generateUUID = () => {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        const r = Math.random() * 16 | 0;
                        const v = c === 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                };

                // Create new transaction explicitly (don't spread template)
                generated.push({
                    id: generateUUID(),
                    description: template.description,
                    amount: template.amount,
                    type: template.type,
                    categoryId: template.categoryId,
                    competenceMonth: targetMonthKey,
                    dueDate: newDueDate,
                    createdDate: new Date().toISOString(),
                    paymentDate: null,
                    isPaid: false,
                    isRecurring: true,
                    isTemplate: false,
                    templateId: template.id,
                    notes: template.notes || ''
                });
            }
        });
    }

    return [...nonTemplates, ...generated];
};

export const getPendingTransactions = (transactions) => {
    return transactions.filter(t => t.isRecurring && !t.isPaid && !t.isTemplate);
};

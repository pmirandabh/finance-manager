import React from 'react';

const RecurringManager = ({ transactions, categories, onDeleteTemplate }) => {
    // Filter only recurring templates
    const templates = transactions.filter(t => t.isRecurring && t.isTemplate);

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Sem Categoria';
    };

    const getCategoryColor = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.color : '#b0b0b0';
    };

    if (templates.length === 0) {
        return (
            <div className="glass-panel card">
                <h2>🔄 Recorrências Ativas</h2>
                <p className="text-muted" style={{ textAlign: 'center', padding: '20px' }}>
                    Nenhuma recorrência configurada.
                </p>
            </div>
        );
    }

    return (
        <div className="glass-panel card">
            <h2>🔄 Gerenciar Recorrências</h2>
            <p className="help-text" style={{ marginBottom: '20px', marginLeft: 0 }}>
                Aqui você pode cancelar recorrências. Isso impedirá que novas cobranças sejam geradas, mas não apaga o histórico.
            </p>

            <div className="transaction-list">
                {templates.map(template => (
                    <div key={template.id} className="transaction-item">
                        <div className="transaction-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div
                                    className="category-icon-small"
                                    style={{ backgroundColor: getCategoryColor(template.categoryId) }}
                                >
                                    🔄
                                </div>
                                <div>
                                    <span className="transaction-title">{template.description}</span>
                                    <div className="transaction-date">
                                        {getCategoryName(template.categoryId)} • Mensal
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span className={`transaction-amount ${template.type}`}>
                                R$ {template.amount.toFixed(2)}
                            </span>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => {
                                    if (window.confirm(`Deseja cancelar a recorrência de "${template.description}"?`)) {
                                        onDeleteTemplate(template.id);
                                    }
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecurringManager;

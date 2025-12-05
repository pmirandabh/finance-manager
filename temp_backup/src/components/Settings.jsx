import React, { useState } from 'react';
import CategoryManager from './CategoryManager';
import DataManagement from './DataManagement';

const Settings = ({ categories, onSaveCategory, onDeleteCategory, transactions, onImportData }) => {
    const [activeTab, setActiveTab] = useState('categories');

    return (
        <div className="settings-container">
            <div className="glass-panel" style={{ marginBottom: '20px', padding: '15px', display: 'flex', gap: '10px' }}>
                <button
                    className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('categories')}
                >
                    🏷️ Categorias
                </button>
                <button
                    className={`btn ${activeTab === 'data' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('data')}
                >
                    💾 Dados e Backup
                </button>
            </div>

            {activeTab === 'categories' ? (
                <div className="dashboard-grid">
                    <CategoryManager
                        categories={categories}
                        onSaveCategory={onSaveCategory}
                        onDeleteCategory={onDeleteCategory}
                        type="expense"
                    />
                    <CategoryManager
                        categories={categories}
                        onSaveCategory={onSaveCategory}
                        onDeleteCategory={onDeleteCategory}
                        type="income"
                    />
                </div>
            ) : (
                <DataManagement
                    transactions={transactions}
                    categories={categories}
                    onImportData={onImportData}
                />
            )}
        </div>
    );
};

export default Settings;

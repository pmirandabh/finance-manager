import React, { useState } from 'react';
import CategoryManager from './CategoryManager';
import DataManagement from './DataManagement';
import { useLanguage } from '../context/LanguageContext';

const Settings = ({ categories, onSaveCategory, onDeleteCategory, transactions, onImportData }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('categories');

    return (
        <div className="settings-container">
            <div className="glass-panel" style={{ marginBottom: '20px', padding: '15px', display: 'flex', gap: '10px' }}>
                <button
                    className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('categories')}
                    style={{ fontSize: '0.9rem' }}
                >
                    🏷️ {t('settings.categories')}
                </button>
                <button
                    className={`btn ${activeTab === 'data' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('data')}
                    style={{ fontSize: '0.9rem' }}
                >
                    💾 {t('settings.backup')}
                </button>
            </div>

            {activeTab === 'categories' ? (
                <div className="dashboard-grid">
                    <CategoryManager
                        categories={categories}
                        onSaveCategory={onSaveCategory}
                        onDeleteCategory={onDeleteCategory}
                        type="expense"
                        transactions={transactions}
                    />
                    <CategoryManager
                        categories={categories}
                        onSaveCategory={onSaveCategory}
                        onDeleteCategory={onDeleteCategory}
                        type="income"
                        transactions={transactions}
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

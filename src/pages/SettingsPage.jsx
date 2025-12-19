import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Settings from '../components/Settings';

const SettingsPage = () => {
    const {
        categories,
        handleSaveCategory,
        handleDeleteCategory,
        transactions,
        handleImportData
    } = useOutletContext();

    return (
        <Settings
            categories={categories}
            onSaveCategory={handleSaveCategory}
            onDeleteCategory={handleDeleteCategory}
            transactions={transactions}
            onImportData={handleImportData}
        />
    );
};

export default SettingsPage;

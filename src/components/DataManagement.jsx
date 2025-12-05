import React, { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const DataManagement = ({ transactions, categories, onImportData }) => {
    const { t } = useLanguage();
    const fileInputRef = useRef(null);
    const [lastBackupDate, setLastBackupDate] = useState(null);

    // Load last backup date from localStorage on mount
    useEffect(() => {
        const savedDate = localStorage.getItem('lastBackupDate');
        if (savedDate) {
            setLastBackupDate(new Date(savedDate));
        }
    }, []);

    // Calculate backup status indicator
    const getBackupStatus = () => {
        if (!lastBackupDate) {
            return { color: '#cf6679', text: t('dataManagement.noBackup'), icon: '🔴' };
        }

        const now = new Date();
        const diffMs = now - lastBackupDate;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffDays < 1) {
            return { color: '#03dac6', text: t('dataManagement.recentBackup'), icon: '🟢' };
        } else if (diffDays < 7) {
            return { color: '#ff9800', text: t('dataManagement.outdatedBackup'), icon: '🟡' };
        } else {
            return { color: '#cf6679', text: t('dataManagement.oldBackup'), icon: '🔴' };
        }
    };

    const formatBackupDate = (date) => {
        if (!date) return '';
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate file size estimate
    const getDataSize = () => {
        const data = { transactions, categories };
        const jsonString = JSON.stringify(data);
        const sizeInBytes = new Blob([jsonString]).size;
        const sizeInKB = (sizeInBytes / 1024).toFixed(1);
        return sizeInKB;
    };

    const handleExportJSON = () => {
        const data = {
            transactions,
            categories,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `saldo_plus_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Save backup date to localStorage
        const now = new Date();
        localStorage.setItem('lastBackupDate', now.toISOString());
        setLastBackupDate(now);

        toast.success(t('dataManagement.backupSuccess'));
    };

    const handleExportCSV = () => {
        // CSV Header
        const headers = ['Data', 'Descrição', 'Valor', 'Tipo', 'Categoria', 'Status', 'Competência', 'Observações'];

        // CSV Rows
        const rows = transactions.map(t => {
            const categoryName = categories.find(c => c.id === t.categoryId)?.name || 'Outros';
            const status = t.isPaid ? 'Pago' : 'Pendente';
            const date = t.paymentDate ? new Date(t.paymentDate).toLocaleDateString() : new Date(t.createdDate).toLocaleDateString();
            const amount = t.amount.toFixed(2).replace('.', ',');

            return [
                date,
                `"${t.description}"`, // Quote description to handle commas
                amount,
                t.type === 'expense' ? 'Despesa' : 'Receita',
                `"${categoryName}"`,
                status,
                t.competenceMonth || '',
                `"${t.notes || ''}"`
            ].join(';'); // Use semicolon for Excel compatibility in some regions
        });

        const csvContent = [headers.join(';'), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `saldo_plus_extrato_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(t('dataManagement.csvSuccess'));
    };

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.transactions && data.categories) {
                    if (window.confirm(t('dataManagement.confirmRestore'))) {
                        onImportData(data);
                        // Success toast is handled in App.jsx
                    }
                } else {
                    toast.error(t('dataManagement.invalidBackup'));
                }
            } catch (error) {
                console.error('Erro ao importar:', error);
                toast.error(t('dataManagement.importError'));
            }
        };
        reader.readAsText(file);
        // Reset input
        event.target.value = '';
    };

    const backupStatus = getBackupStatus();

    return (
        <div className="glass-panel card" style={{ marginTop: '24px' }}>
            <h2>{t('dataManagement.title')}</h2>

            {/* Data Preview */}
            <div style={{
                background: 'rgba(187, 134, 252, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '15px',
                border: '1px solid rgba(187, 134, 252, 0.2)'
            }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {t('dataManagement.currentData')}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                    {transactions.length} {t('dataManagement.transactions')} • {categories.length} {t('dataManagement.categories')}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                    {t('dataManagement.approxSize')}: {getDataSize()} KB
                </div>
            </div>

            {/* Last Backup Info */}
            <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: `1px solid ${backupStatus.color}40`
            }}>
                <span style={{ fontSize: '1.2rem' }}>{backupStatus.icon}</span>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: backupStatus.color }}>
                        {backupStatus.text}
                    </div>
                    {lastBackupDate && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {t('dataManagement.lastBackup')}: {formatBackupDate(lastBackupDate)}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" onClick={handleExportJSON}>
                    {t('dataManagement.backupJson')}
                </button>
                <button className="btn btn-secondary" onClick={handleExportCSV}>
                    {t('dataManagement.exportCsv')}
                </button>
                <button className="btn btn-secondary" onClick={handleImportClick}>
                    {t('dataManagement.restoreBackup')}
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    style={{ display: 'none' }}
                />
            </div>
            <p className="help-text" style={{ marginTop: '10px', marginLeft: '0' }}>
                {t('dataManagement.helpText')}
            </p>
        </div>
    );
};

export default DataManagement;

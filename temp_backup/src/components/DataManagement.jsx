import React, { useRef } from 'react';

const DataManagement = ({ transactions, categories, onImportData }) => {
    const fileInputRef = useRef(null);

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
                    if (window.confirm('Isso substituirá seus dados atuais. Deseja continuar?')) {
                        onImportData(data);
                        alert('Dados importados com sucesso!');
                    }
                } else {
                    alert('Arquivo de backup inválido.');
                }
            } catch (error) {
                console.error('Erro ao importar:', error);
                alert('Erro ao ler o arquivo. Certifique-se de que é um JSON válido.');
            }
        };
        reader.readAsText(file);
        // Reset input
        event.target.value = '';
    };

    return (
        <div className="glass-panel card" style={{ marginTop: '24px' }}>
            <h2>💾 Backup e Dados</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" onClick={handleExportJSON}>
                    ⬇️ Backup (JSON)
                </button>
                <button className="btn btn-secondary" onClick={handleExportCSV}>
                    📊 Exportar Excel (CSV)
                </button>
                <button className="btn btn-secondary" onClick={handleImportClick}>
                    ⬆️ Restaurar Backup
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
                Salve seus dados regularmente. O arquivo JSON serve para backup completo. O CSV é para abrir no Excel.
            </p>
        </div>
    );
};

export default DataManagement;

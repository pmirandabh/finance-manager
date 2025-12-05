import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const TransactionFilters = ({
    searchTerm,
    onSearchChange,
    categoryFilter,
    onCategoryChange,
    categories,
    onClearFilters
}) => {
    const { t } = useLanguage();
    const hasActiveFilters = searchTerm || categoryFilter;

    return (
        <div className="glass-panel" style={{ padding: '15px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Search by description */}
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        🔍 {t('filters.searchLabel')}
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={t('filters.searchPlaceholder')}
                        style={{ width: '100%' }}
                    />
                </div>

                {/* Filter by category */}
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        📁 {t('filters.categoryLabel')}
                    </label>
                    <select
                        className="form-control"
                        value={categoryFilter}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        style={{ width: '100%' }}
                    >
                        <option value="">{t('filters.allCategories')}</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.icon} {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Clear filters button */}
                {hasActiveFilters && (
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button
                            onClick={onClearFilters}
                            className="btn btn-secondary"
                            style={{ padding: '10px 15px' }}
                        >
                            ✕ {t('filters.clearFilters')}
                        </button>
                    </div>
                )}
            </div>

            {/* Active filters indicator */}
            {hasActiveFilters && (
                <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <strong>{t('filters.activeFilters')}</strong>
                    {searchTerm && <span style={{ marginLeft: '8px', color: 'var(--secondary-color)' }}>{t('filters.search')}: "{searchTerm}"</span>}
                    {categoryFilter && (
                        <span style={{ marginLeft: '8px', color: 'var(--secondary-color)' }}>
                            {t('filters.category')}: {categories.find(c => c.id === categoryFilter)?.name}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default TransactionFilters;

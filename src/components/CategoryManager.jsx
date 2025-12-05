import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { availableIcons, availableColors } from '../utils/defaultCategories';
import { validators } from '../utils/validators';
import { generateCategoryId } from '../utils/idGenerator';
import { useLanguage } from '../context/LanguageContext';

const CategoryManager = ({ categories, onSaveCategory, onDeleteCategory, type, transactions = [] }) => {
    const { t } = useLanguage();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isInactiveExpanded, setIsInactiveExpanded] = useState(false);
    const [highlightedCategoryId, setHighlightedCategoryId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        icon: '📦',
        color: '#b2bec3'
    });

    // Separate active and inactive categories and sort alphabetically
    const activeCategories = categories
        .filter(c => c.type === type && c.isActive !== false)
        .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    const inactiveCategories = categories
        .filter(c => c.type === type && c.isActive === false)
        .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

    // Count transactions per category
    const getCategoryUsageCount = (categoryId) => {
        return transactions.filter(t => t.categoryId === categoryId).length;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate category name
        const nameValidation = validators.validateCategoryName(
            formData.name,
            categories,
            editingId
        );

        if (!nameValidation.isValid) {
            toast.error(nameValidation.error);
            return;
        }

        const category = {
            id: editingId || generateCategoryId(),
            ...formData,
            name: formData.name.trim(),
            type,
            isActive: true
        };

        onSaveCategory(category);

        // Highlight the saved category
        setHighlightedCategoryId(category.id);
        setTimeout(() => setHighlightedCategoryId(null), 3000);

        resetForm();
        // Success toast handled in parent or here? Parent handles it in App.jsx but we can keep it consistent
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            icon: category.icon,
            color: category.color
        });
        setIsAdding(true);
    };

    const handleDelete = (id) => {
        if (window.confirm(t('categoryManager.confirmDelete'))) {
            onDeleteCategory(id);
        }
    };

    const handleToggleActive = (category) => {
        onSaveCategory({
            ...category,
            isActive: category.isActive === false ? true : false
        });
        toast.success(`Categoria ${category.isActive === false ? t('categoryManager.reactivated') : t('categoryManager.hiddenMsg')}`);
    };

    const resetForm = () => {
        setFormData({ name: '', icon: '📦', color: '#b2bec3' });
        setEditingId(null);
        setIsAdding(false);
    };

    return (
        <div className="category-manager glass-panel card">
            <div className="category-header">
                <h3>{type === 'expense' ? t('categoryManager.expenses') : t('categoryManager.incomes')}</h3>
                {!isAdding && (
                    <button className="btn btn-small" onClick={() => setIsAdding(true)}>
                        {t('categoryManager.new')}
                    </button>
                )}
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="category-form-compact">
                    <div className="form-row-compact">
                        <div className="icon-input-group">
                            <div className="selected-icon-preview" style={{ backgroundColor: formData.color }}>
                                {formData.icon}
                            </div>
                            <select
                                className="form-control icon-select"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            >
                                {availableIcons.map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                        </div>

                        <input
                            type="text"
                            className="form-control name-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={t('categoryManager.namePlaceholder')}
                            autoFocus
                        />

                        <div className="color-picker-compact">
                            {availableColors.slice(0, 7).map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`color-dot ${formData.color === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setFormData({ ...formData, color })}
                                />
                            ))}
                            <input
                                type="color"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                                title={t('categoryManager.chooseColor')}
                            />
                        </div>

                        <div className="form-actions-compact">
                            <button type="submit" className="btn btn-primary btn-sm">{t('common.save')}</button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>✕</button>
                        </div>
                    </div>
                </form>
            )}

            {/* ACTIVE CATEGORIES */}
            <div className="category-list-compact">
                {activeCategories.length > 0 && (
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', marginTop: '15px' }}>
                        {t('categoryManager.active')} ({activeCategories.length})
                    </h4>
                )}
                {activeCategories.map(category => {
                    const usageCount = getCategoryUsageCount(category.id);
                    const isHighlighted = highlightedCategoryId === category.id;

                    return (
                        <div
                            key={category.id}
                            className={`category-row ${isHighlighted ? 'category-highlight' : ''}`}
                        >
                            <div className="category-info">
                                <div className="category-icon-tiny" style={{ backgroundColor: category.color }}>
                                    {category.icon}
                                </div>
                                <span className="category-name-compact">
                                    {category.name} <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>({usageCount})</span>
                                </span>
                            </div>
                            <div className="category-actions-compact">
                                <button className="btn-icon-text" onClick={() => handleEdit(category)}>{t('categoryManager.edit')}</button>
                                <button className="btn-icon-text delete" onClick={() => handleDelete(category.id)}>{t('categoryManager.delete')}</button>
                                <button
                                    className="btn-icon-text"
                                    onClick={() => handleToggleActive(category)}
                                    title={t('categoryManager.hide')}
                                    style={{ color: '#ff9800' }}
                                >
                                    {t('categoryManager.hide')}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* INACTIVE CATEGORIES */}
            {inactiveCategories.length > 0 && (
                <div className="category-list-compact" style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                    <div
                        onClick={() => setIsInactiveExpanded(!isInactiveExpanded)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            padding: '8px 0',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        <h4 style={{ fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {t('categoryManager.inactive')} ({inactiveCategories.length}) - {t('categoryManager.hidden')}
                        </h4>
                        <span style={{ transform: isInactiveExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                            ▼
                        </span>
                    </div>

                    {isInactiveExpanded && (
                        <div style={{ marginTop: '10px', animation: 'fadeIn 0.3s ease' }}>
                            {inactiveCategories.map(category => (
                                <div key={category.id} className="category-row" style={{ opacity: 0.6 }}>
                                    <div className="category-info">
                                        <div className="category-icon-tiny" style={{ backgroundColor: category.color }}>
                                            {category.icon}
                                        </div>
                                        <span className="category-name-compact" style={{ textDecoration: 'line-through' }}>
                                            {category.name}
                                        </span>
                                    </div>
                                    <button
                                        className="btn-icon-text"
                                        onClick={() => handleToggleActive(category)}
                                        style={{ color: 'var(--secondary-color)' }}
                                        title={t('categoryManager.reactivate')}
                                    >
                                        {t('categoryManager.reactivate')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryManager;

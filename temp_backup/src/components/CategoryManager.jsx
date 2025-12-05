import React, { useState } from 'react';
import { availableIcons, availableColors } from '../utils/defaultCategories';

const CategoryManager = ({ categories, onSaveCategory, onDeleteCategory, type }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        icon: '📦',
        color: '#b2bec3'
    });

    // Separate active and inactive categories
    const activeCategories = categories.filter(c => c.type === type && c.isActive !== false);
    const inactiveCategories = categories.filter(c => c.type === type && c.isActive === false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        const category = {
            id: editingId || Date.now().toString(),
            ...formData,
            type,
            isDefault: false,
            isActive: true
        };

        onSaveCategory(category);
        resetForm();
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
        if (confirm('Tem certeza que deseja excluir esta categoria?')) {
            onDeleteCategory(id);
        }
    };

    const handleToggleActive = (category) => {
        onSaveCategory({
            ...category,
            isActive: category.isActive === false ? true : false
        });
    };

    const resetForm = () => {
        setFormData({ name: '', icon: '📦', color: '#b2bec3' });
        setEditingId(null);
        setIsAdding(false);
    };

    return (
        <div className="category-manager glass-panel card">
            <div className="category-header">
                <h3>{type === 'expense' ? '💸 Despesas' : '💰 Receitas'}</h3>
                {!isAdding && (
                    <button className="btn btn-small" onClick={() => setIsAdding(true)}>
                        + Nova
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
                            placeholder="Nome da categoria"
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
                        </div>

                        <div className="form-actions-compact">
                            <button type="submit" className="btn btn-primary btn-sm">Salvar</button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>✕</button>
                        </div>
                    </div>
                </form>
            )}

            {/* ACTIVE CATEGORIES */}
            <div className="category-list-compact">
                {activeCategories.length > 0 && (
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', marginTop: '15px' }}>
                        Ativas ({activeCategories.length})
                    </h4>
                )}
                {activeCategories.map(category => (
                    <div key={category.id} className="category-row">
                        <div className="category-info">
                            <div className="category-icon-tiny" style={{ backgroundColor: category.color }}>
                                {category.icon}
                            </div>
                            <span className="category-name-compact">{category.name}</span>
                        </div>
                        <div className="category-actions-compact">
                            {!category.isDefault && (
                                <>
                                    <button className="btn-icon-text" onClick={() => handleEdit(category)}>Editar</button>
                                    <button className="btn-icon-text delete" onClick={() => handleDelete(category.id)}>Excluir</button>
                                </>
                            )}
                            <button
                                className="btn-icon-text"
                                onClick={() => handleToggleActive(category)}
                                title="Ocultar categoria dos seletores"
                                style={{ color: '#ff9800' }}
                            >
                                Ocultar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* INACTIVE CATEGORIES */}
            {inactiveCategories.length > 0 && (
                <div className="category-list-compact" style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        Inativas ({inactiveCategories.length}) - Ocultas dos seletores
                    </h4>
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
                                title="Reativar categoria"
                            >
                                Reativar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryManager;

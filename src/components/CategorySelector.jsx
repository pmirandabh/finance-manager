import React from 'react';

const CategorySelector = ({ categories, selectedCategoryId, type, onChange }) => {
    // Filter to show only active categories
    const filteredCategories = categories.filter(c =>
        c.type === type && c.isActive !== false
    );
    const selectedCategory = categories.find(c => c.id === selectedCategoryId);

    return (
        <div className="form-group">
            <label>Categoria</label>
            <div className="custom-select-container">
                <select
                    className="form-control custom-select"
                    value={selectedCategoryId}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange(val);
                    }}
                    style={{ paddingLeft: selectedCategory ? '50px' : '10px' }}
                >
                    <option value="">Selecione uma categoria...</option>
                    {filteredCategories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                {selectedCategory && (
                    <div className="select-icon-preview" style={{ backgroundColor: selectedCategory.color }}>
                        {selectedCategory.icon}
                    </div>
                )}
            </div>
            {filteredCategories.length === 0 && (
                <small className="text-muted">
                    Nenhuma categoria ativa. Ative categorias em Configurações.
                </small>
            )}
        </div>
    );
};

export default CategorySelector;

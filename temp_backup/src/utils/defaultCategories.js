// Default categories for new users
export const defaultCategories = {
    expense: [
        {
            name: 'Alimentação',
            icon: '🍔',
            color: '#ff6b6b',
            isDefault: true
        },
        {
            name: 'Transporte',
            icon: '🚗',
            color: '#4ecdc4',
            isDefault: true
        },
        {
            name: 'Moradia',
            icon: '🏠',
            color: '#45b7d1',
            isDefault: true
        },
        {
            name: 'Saúde',
            icon: '💊',
            color: '#96ceb4',
            isDefault: true
        },
        {
            name: 'Educação',
            icon: '📚',
            color: '#ffeaa7',
            isDefault: true
        },
        {
            name: 'Lazer',
            icon: '🎮',
            color: '#dfe6e9',
            isDefault: true
        },
        {
            name: 'Compras',
            icon: '🛍️',
            color: '#fd79a8',
            isDefault: true
        },
        {
            name: 'Contas',
            icon: '📄',
            color: '#fdcb6e',
            isDefault: true
        },
        {
            name: 'Outros',
            icon: '📦',
            color: '#b2bec3',
            isDefault: true
        }
    ],
    income: [
        {
            name: 'Salário',
            icon: '💰',
            color: '#00b894',
            isDefault: true
        },
        {
            name: 'Freelance',
            icon: '💼',
            color: '#00cec9',
            isDefault: true
        },
        {
            name: 'Investimentos',
            icon: '📈',
            color: '#55efc4',
            isDefault: true
        },
        {
            name: 'Vendas',
            icon: '🏷️',
            color: '#81ecec',
            isDefault: true
        },
        {
            name: 'Outros',
            icon: '💵',
            color: '#74b9ff',
            isDefault: true
        }
    ]
};

// Icon options for custom categories
export const availableIcons = [
    '🍔', '🍕', '☕', '🍰', '🥗', // Food
    '🚗', '🚌', '🚇', '✈️', '🚲', // Transport
    '🏠', '🔑', '🛋️', '🚿', '💡', // Home
    '💊', '🏥', '💉', '🩺', '😷', // Health
    '📚', '✏️', '🎓', '📖', '🖊️', // Education
    '🎮', '🎬', '🎵', '🎨', '⚽', // Entertainment
    '🛍️', '👕', '👟', '💄', '🎁', // Shopping
    '📄', '💳', '🔌', '📱', '💻', // Bills/Tech
    '💰', '💵', '💴', '💶', '💷', // Money
    '💼', '📈', '📊', '🏆', '⭐', // Work/Success
    '📦', '🔧', '⚙️', '🔨', '🎯'  // Others
];

// Color options for custom categories
export const availableColors = [
    '#ff6b6b', '#ee5a6f', '#c44569',
    '#4ecdc4', '#45b7d1', '#3867d6',
    '#00b894', '#00cec9', '#55efc4',
    '#ffeaa7', '#fdcb6e', '#e17055',
    '#fd79a8', '#e84393', '#a29bfe',
    '#74b9ff', '#0984e3', '#6c5ce7',
    '#b2bec3', '#636e72', '#2d3436'
];

// Default categories for new users
export const defaultCategories = {
    expense: [
        { name: 'Alimentação', icon: '🍔', color: '#ff6b6b' },
        { name: 'Moradia', icon: '🏠', color: '#4ecdc4' },
        { name: 'Transporte', icon: '🚗', color: '#45b7d1' },
        { name: 'Saúde', icon: '💊', color: '#e17055' },
        { name: 'Lazer', icon: '🎮', color: '#a29bfe' },
        { name: 'Educação', icon: '📚', color: '#fdcb6e' },
        { name: 'Compras', icon: '🛍️', color: '#fd79a8' },
        { name: 'Contas', icon: '📄', color: '#636e72' }
    ],
    income: [
        { name: 'Salário', icon: '💰', color: '#00b894' },
        { name: 'Freelance', icon: '💻', color: '#0984e3' },
        { name: 'Investimentos', icon: '📈', color: '#6c5ce7' },
        { name: 'Outros', icon: '📦', color: '#b2bec3' }
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

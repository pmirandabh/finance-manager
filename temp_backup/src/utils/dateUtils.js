// Utility function to format date strings without timezone issues
export const formatDateLocal = (dateString) => {
    if (!dateString) return '';

    // If it's already in YYYY-MM-DD format, parse it as local date
    const parts = dateString.split('-');
    if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Month is 0-indexed
        const day = parseInt(parts[2]);
        const date = new Date(year, month, day);
        return date.toLocaleDateString('pt-BR');
    }

    // Fallback for other formats
    return new Date(dateString).toLocaleDateString('pt-BR');
};

/**
 * ID generation utilities using nanoid for secure, unique IDs
 */
import { nanoid } from 'nanoid';

/**
 * Generates a unique ID
 * @param {number} size - Length of ID (default: 21)
 * @returns {string}
 */
export const generateId = (size = 21) => {
    return nanoid(size);
};

/**
 * Generates a unique category ID (UUID v4)
 * @returns {string}
 */
export const generateCategoryId = () => {
    // Generate UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/**
 * Generates a unique transaction ID
 * @returns {string}
 */
export const generateTransactionId = () => {
    // Generate UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

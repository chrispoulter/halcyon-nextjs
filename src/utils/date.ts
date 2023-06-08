export const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export const currentYear = new Date().getUTCFullYear();

export const formatForDisplay = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);

    return date.toLocaleDateString('en', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

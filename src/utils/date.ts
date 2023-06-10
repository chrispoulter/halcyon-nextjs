export const currentYear = new Date().getUTCFullYear();

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

export const formatForDisplay = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();

    return `${day} ${monthNames[month]} ${year}`;
};

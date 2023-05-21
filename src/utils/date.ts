export const formatForDisplay = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    return `${year} / ${month} / ${day}`;
};

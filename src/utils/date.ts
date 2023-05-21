export const today = new Date();

export const currentYear = today.getUTCFullYear();

export const parseForOutput = (value: string) => new Date(value).toISOString();

export const formatForInput = (value: string) => value.split('T')[0];

export const formatForDisplay = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    return `${year} / ${month} / ${day}`;
};

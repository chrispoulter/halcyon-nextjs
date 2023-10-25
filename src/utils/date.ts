export const currentYear = new Date().getUTCFullYear();

export const monthNames = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(0, i);
    return date.toLocaleString('en', { month: 'long' });
});

export const formatUTCDate = (value: string) => {
    const date = parseUTCDate(value);
    if (!date) {
        return undefined;
    }
    return date.toLocaleString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const parseUTCDate = (dateString: string) => {
    if (!dateString) {
        return undefined;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(dateString)) {
        return undefined;
    }

    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const parsedDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

    if (
        parsedDate.getUTCFullYear() !== year &&
        parsedDate.getUTCMonth() !== month - 1 &&
        parsedDate.getUTCDate() !== day
    ) {
        return undefined;
    }

    return parsedDate;
};

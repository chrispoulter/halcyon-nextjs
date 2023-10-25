export const currentYear = new Date().getUTCFullYear();

export const monthNames = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(0, i);
    return date.toLocaleString('en', { month: 'long' });
});

export const toDateOnlyString = (date: Date) =>
    date.toISOString().split('T')[0];

const toDateOnlyDate = (value: string) => {
    if (!value) {
        return undefined;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(value)) {
        return undefined;
    }

    const parts = value.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

    if (
        date.getUTCFullYear() !== year &&
        date.getUTCMonth() !== month - 1 &&
        date.getUTCDate() !== day
    ) {
        return undefined;
    }

    return date;
};

export const toDateOnlyISOString = (value: string) => {
    const date = toDateOnlyDate(value);

    if (!date) {
        return undefined;
    }

    return date.toISOString();
};

export const toDateOnlyLocaleString = (value: string) => {
    const date = toDateOnlyDate(value);

    if (!date) {
        return undefined;
    }

    return date.toLocaleString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

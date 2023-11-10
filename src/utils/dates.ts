export const currentYear = new Date().getUTCFullYear();

export const monthNames = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(0, i);
    return date.toLocaleString('en', { month: 'long' });
});

export const now = () => {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    return now;
};

export const toLocaleString = (value: string) =>
    new Date(`${value}T00:00:00.000Z`).toLocaleString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

export const toDate = (value: string) => {
    const isoString = `${value}T00:00:00.000Z`;
    const date = new Date(isoString);

    return !isNaN(date.getTime()) && isoString === date.toISOString()
        ? date
        : undefined;
};

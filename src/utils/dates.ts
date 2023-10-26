export const currentYear = new Date().getUTCFullYear();

export const monthNames = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(0, i);
    return date.toLocaleString('en', { month: 'long' });
});

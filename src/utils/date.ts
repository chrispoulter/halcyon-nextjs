export const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

export const getCurrentYear = () => getToday().getFullYear();

export const toDateString = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    return date.toISOString().split('T')[0];
};

export const toDisplayString = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    return date.toISOString().split('T')[0].split('-').join(' / ');
};

export const isLessThanOrEqualToday = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    console.log(date, getToday());
    return date <= getToday();
};

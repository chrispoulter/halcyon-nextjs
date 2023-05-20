import { endOfToday, format, parseISO, getYear } from 'date-fns';

export const today = endOfToday();

export const currentYear = getYear(today);

export const parseForOutput = (date: string) => parseISO(`${date}T00:00:00.000Z`);

export const formatForInput = (date: string | Date) =>
    format(date instanceof Date ? date : parseISO(date), 'yyyy-MM-dd');

export const formatForDisplay = (date: string | Date) =>
    format(date instanceof Date ? date : parseISO(date), 'PP');

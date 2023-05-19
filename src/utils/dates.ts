import {
    startOfToday,
    endOfToday,
    format,
    parseISO,
    subYears,
    getYear
} from 'date-fns';

const todayStart = startOfToday();

const todayEnd = endOfToday();

export const currentYear = getYear(todayStart);

export const minDateOfBirth = subYears(todayStart, 120);

export const maxDateOfBirth = subYears(todayEnd, 18);

export const parseForOutput = (date: string) => parseISO(date);

export const formatForInput = (date: string | Date) =>
    format(date instanceof Date ? date : parseISO(date), 'yyyy-MM-dd');

export const formatForDisplay = (date: string | Date) =>
    format(date instanceof Date ? date : parseISO(date), 'PP');

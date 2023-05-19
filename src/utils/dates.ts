const addYears = (date: Date, years: number) => {
    const dateCopy = new Date(date);
    dateCopy.setFullYear(dateCopy.getFullYear() + years);
    return dateCopy;
};

export const format = (date: Date) => date.toISOString().slice(0, 10);

const currentDateTime = new Date();

const currentDate = new Date(format(currentDateTime));

export const minDateOfBirth = addYears(currentDate, -120);

export const maxDateOfBirth = currentDate;

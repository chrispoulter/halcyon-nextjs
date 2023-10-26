import * as yup from 'yup';

declare module 'yup' {
    interface StringSchema {
        dateOnly(): StringSchema<string>;
        past(): StringSchema<string>;
    }
}

yup.addMethod(yup.string, 'dateOnly', function () {
    return this.test({
        name: 'date-only',
        message: '${label} must be a valid date',
        test: value => {
            if (!value) {
                return true;
            }

            const isoString = `${value}T00:00:00.000Z`;
            const date = new Date(isoString);

            return !isNaN(date.getTime()) && isoString === date.toISOString();
        }
    });
});

yup.addMethod(yup.string, 'past', function () {
    return this.test({
        name: 'date-in-past',
        message: '${label} must be in the past',
        test: value => {
            if (!value) {
                return true;
            }

            const isoString = `${value}T00:00:00.000Z`;
            const date = new Date(isoString);

            if (isNaN(date.getTime()) || isoString !== date.toISOString()) {
                return false;
            }

            const now = new Date();
            now.setUTCHours(0, 0, 0, 0);

            return date < now;
        }
    });
});

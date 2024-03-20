import { addMethod, string } from 'yup';
import { now, toDate } from './dates';

declare module 'yup' {
    interface StringSchema {
        dateOnly(): StringSchema<string>;
        past(): StringSchema<string>;
    }
}

addMethod(string, 'dateOnly', function () {
    return this.test({
        name: 'date-only',
        message: '${label} must be a valid date',
        test: value => {
            if (!value) {
                return true;
            }

            return !!toDate(value);
        }
    });
});

addMethod(string, 'past', function () {
    return this.test({
        name: 'date-in-past',
        message: '${label} must be in the past',
        test: value => {
            if (!value) {
                return true;
            }

            const date = toDate(value);

            if (!date) {
                return false;
            }

            return date < now();
        }
    });
});

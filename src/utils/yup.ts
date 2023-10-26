import * as yup from 'yup';
import { now, toDate } from './dates';

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

            return !!toDate(value);
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

            const date = toDate(value);

            if (!date) {
                return false;
            }

            return date < now();
        }
    });
});

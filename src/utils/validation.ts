import * as yup from 'yup';
import { toDateOnlyISOString } from './date';

declare module 'yup' {
    interface StringSchema {
        transformDateOnly(): StringSchema<string>;
        past(): StringSchema<string>;
    }
}

yup.addMethod(yup.string, 'past', function () {
    return this.test({
        name: 'date-in-past',
        message: '${label} must be in the past',
        test: function (value) {
            if (!value) {
                return true;
            }

            return new Date(value) < new Date();
        }
    });
});

yup.addMethod(yup.string, 'transformDateOnly', function () {
    return this.transform(toDateOnlyISOString);
});

import * as Yup from 'yup';

export const validationMiddleware =
    schema =>
    async ({ body, query }, res, next) => {
        try {
            await Promise.all([
                Yup.object(schema.query).validate(query || {}),
                Yup.object(schema.body).validate(body || {})
            ]);
        } catch (err) {
            return res.status(400).json({
                code: 'INVALID_REQUEST',
                message: err.errors[0]
            });
        }

        return next();
    };

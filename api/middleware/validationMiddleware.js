export const validationMiddleware =
    schema =>
    async ({ body }, res, next) => {
        try {
            await schema.validate(body);
        } catch (err) {
            return res.status(400).json({
                code: 'INVALID_REQUEST',
                message: err.errors[0]
            });
        }

        return next();
    };

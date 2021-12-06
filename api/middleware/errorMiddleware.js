export const errorMiddleware = (err, _, res, __) =>
    res.json({
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message
    });

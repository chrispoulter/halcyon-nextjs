export const errorMiddleware = (err, _, res, __) => {
    console.error(err.stack);

    return res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message
    });
};

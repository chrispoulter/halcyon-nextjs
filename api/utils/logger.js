export const plugin = () => {
    return {
        requestDidStart({ context, request }) {
            const query = request?.query;
            const variables = Object.keys(request?.variables || {});
            const payload = context?.payload;

            console.log('graphql', {
                query,
                variables,
                payload
            });

            return {
                didEncounterErrors({ errors }) {
                    for (const error of errors) {
                        if (
                            error.extensions?.code &&
                            error.extensions?.code !== 'INTERNAL_SERVER_ERROR'
                        ) {
                            continue;
                        }

                        console.error('graphql', {
                            query,
                            variables,
                            payload,
                            error
                        });
                    }
                }
            };
        }
    };
};

export const captureError = (source, data) => console.error(source, data);

export const captureMessage = (source, data) => console.log(source, data);

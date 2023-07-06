export type UpdatedResponse = { id: number };

export type HandlerResponse<T = unknown> = {
    code?: string;
    message?: string;
    data?: T;
};

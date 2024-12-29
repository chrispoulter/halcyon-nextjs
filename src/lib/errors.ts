export class FetchError extends Error {
    status: number;
    statusText: string;
    content: any;

    constructor(response: Response, content: any) {
        super(`${response.status} - ${response.statusText}`);
        this.name = 'FetchError';
        this.status = response.status;
        this.statusText = response.statusText;
        this.content = content;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FetchError);
        }
    }
}

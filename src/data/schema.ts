export type User = {
    id: number;
    email_address: string;
    password?: string;
    password_reset_token?: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    is_locked_out: boolean;
    roles?: string[];
    search: string;
    xmin: number;
};

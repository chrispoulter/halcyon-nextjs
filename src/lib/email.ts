export enum EmailTemplate {
    ResetPassword = 'RESET_PASSWORD',
}

type EmailMessage = {
    from?: string;
    to: string;
    template: EmailTemplate;
    context: object;
};

export const sendEmail = async (message: EmailMessage): Promise<void> => {
    // TODO: Implement sendEmail
    console.log('Sending email:', message);
};

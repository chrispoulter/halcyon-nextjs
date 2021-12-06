export const templateRepository = {
    getByKey: async key => {
        return Promise.resolve({
            id: 1,
            key: 'RESET_PASSWORD',
            subject: 'Password Reset // Halcyon',
            html: '<html><head><title>Password Reset // Halcyon</title></head><body><p style="font-family: verdana, geneva, sans-serif; font-size: 11px">We have received a request to reset your password.</p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px">In order to complete the process and select a new password pleaseclick here:</p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px"><a href="{{ passwordResetUrl }}">Reset your password</a></p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px"><strong>Important</strong>: If you did not request a password reset do not worry. Your account is still secure and your old password will remain active.</p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px">Regards,<br /><strong>Halcyon</strong><br /><a href="{{ siteUrl }}">{{ siteUrl }}</a></p></body></html>'
        });
    },
    upsert: async model => {
        return Promise.resolve({ id: 1 });
    }
};

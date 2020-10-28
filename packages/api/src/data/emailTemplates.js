module.exports = {
    resetPassword: {
        subject: 'Password Reset // Halcyon',
        html:
            '<html><head><title>Halcyon</title></head><body><p style="font-family: verdana, geneva, sans-serif; font-size: 11px;">We have received a request to reset your password.</p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px;">In order to complete the process and select a new password please click here:</p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px;"><a href="https://halcyon-graphql.chrispoulter.com/reset-password/{token}">Reset your password</a></p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px;"><strong>Important</strong>: If you did not request a password reset do not worry. Your account is still secure and your old password will remain active.</p><p style="font-family: verdana, geneva, sans-serif; font-size: 11px;">Regards,<br /><strong>Halcyon</strong><br /><a href="https://halcyon-graphql.chrispoulter.com">https://halcyon-graphql.chrispoulter.com</a></p></body></html>'
    }
};

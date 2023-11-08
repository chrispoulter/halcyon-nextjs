import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createTokenSchema } from '@/features/token/tokenTypes';
import { User, query } from '@/utils/db';
import { verifyPassword } from '@/utils/hash';
import { config } from '@/utils/config';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                emailAddress: { label: 'Email Address', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const body = await createTokenSchema.validate(credentials);

                const {
                    rows: [user]
                } = await query<User>(
                    'SELECT id, email_address, password, first_name, last_name, is_locked_out, roles FROM users WHERE email_address = $1 LIMIT 1',
                    [body.emailAddress]
                );

                if (!user || !user.password) {
                    throw new Error('The credentials provided were invalid.');
                }

                const verified = await verifyPassword(
                    body.password,
                    user.password
                );

                if (!verified) {
                    throw new Error('The credentials provided were invalid.');
                }

                if (user.is_locked_out) {
                    throw new Error(
                        'This account has been locked out, please try again later.'
                    );
                }

                return {
                    id: user.id,
                    emailAddress: user.email_address,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    roles: user.roles
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.emailAddress;
                token.name = `${user.firstName} ${user.lastName}`;
                token.picture = null;
                token.roles = user.roles;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.picture;
                session.user.roles = token.roles;
            }

            return session;
        }
    },
    pages: {
        signIn: '/login'
    },
    session: {
        maxAge: config.NEXTAUTH_SESSION_MAXAGE
    },
    secret: config.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);

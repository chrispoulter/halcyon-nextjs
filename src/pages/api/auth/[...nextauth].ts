import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JwtPayload, verify } from 'jsonwebtoken';
import { createTokenSchema } from '@/features/token/tokenTypes';
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

                const response = await fetch(
                    `${config.EXTERNAL_API_URL}/token`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    }
                );

                if (!response.ok) {
                    throw new Error('The credentials provided were invalid.');
                }

                const accessToken = await response.text();

                const payload = verify(accessToken, config.JWT_SECURITY_KEY, {
                    issuer: config.JWT_ISSUER,
                    audience: config.JWT_AUDIENCE
                }) as JwtPayload;

                return {
                    accessToken,
                    id: parseInt(payload.sub!),
                    emailAddress: payload.email,
                    firstName: payload.given_name,
                    lastName: payload.family_name,
                    roles:
                        typeof payload.roles === 'string'
                            ? [payload.roles]
                            : payload.roles || []
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.email = user.emailAddress;
                token.name = `${user.firstName} ${user.lastName}`;
                token.picture = null;
                token.roles = user.roles;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.accessToken = token.accessToken;
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

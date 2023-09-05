import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JwtPayload, verify } from 'jsonwebtoken';
import { createTokenSchema } from '@/models/token.types';
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

                try {
                    const response = await fetch(`${config.API_URL}/token`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });

                    if (!response.ok) {
                        return null;
                    }

                    const result = await response.json();

                    const accessToken = result.data;

                    const decodedToken = verify(
                        accessToken,
                        config.JWT_SECURITY_KEY,
                        {
                            issuer: config.JWT_ISSUER,
                            audience: config.JWT_AUDIENCE
                        }
                    ) as JwtPayload;

                    return {
                        accessToken,
                        id: decodedToken.sub!,
                        email: decodedToken.email!,
                        given_name: decodedToken.given_name!,
                        family_name: decodedToken.family_name!,
                        roles:
                            typeof decodedToken.roles === 'string'
                                ? [decodedToken.roles]
                                : decodedToken.roles || []
                    };
                } catch (error) {
                    console.error('auth error', error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.email = user.email;
                token.name = `${user.given_name} ${user.family_name}`;
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

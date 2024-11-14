import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtVerify } from 'jose';
import { z } from 'zod';
import { config } from '@/lib/config';
import { Role } from '@/lib/roles';

const secretKey = new TextEncoder().encode(config.JWT_SECURITY_KEY);

type JwtPayload = {
    sub: string;
    email: string;
    given_name: string;
    family_name: string;
    roles?: Role | Role[];
};

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address is a required field' })
        .email('Email Address must be a valid email'),
    password: z.string({ message: 'Password is a required field' })
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                emailAddress: { label: 'Email Address', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const result = await schema.safeParseAsync(credentials);

                if (!result.success) {
                    throw new Error(result.error.issues[0].message);
                }

                const response = await fetch(
                    `${config.API_URL}/account/login`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(result.data)
                    }
                );

                // console.log('response', response);

                if (!response.ok) {
                    switch (response.status) {
                        case 401:
                            throw new Error(
                                'The credentials provided were invalid.'
                            );

                        case 429:
                            throw new Error(
                                'Sorry, the server is currently experiencing a high load. Please try again later.'
                            );

                        default:
                            throw new Error(
                                'Sorry, something went wrong. Please try again later.'
                            );
                    }
                }

                const accessToken = await response.text();

                const { payload } = await jwtVerify<JwtPayload>(
                    accessToken,
                    secretKey,
                    {
                        audience: config.JWT_AUDIENCE,
                        issuer: config.JWT_ISSUER
                    }
                );

                return {
                    accessToken,
                    id: payload.sub,
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
                session.user.email = token.email!;
                session.user.name = token.name;
                session.user.image = token.picture;
                session.user.roles = token.roles;
            }

            return session;
        }
    },
    pages: {
        signIn: '/account/login',
        error: '/500'
    }
});

import type { Metadata, Viewport } from 'next';
import { Open_Sans as FontSans } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

import './globals.css';

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata: Metadata = {
    title: {
        template: '%s // Halcyon',
        default: 'Halcyon',
    },
    description:
        'A Next.js web project template. Built with a sense of peace and tranquillity.',
    keywords: [
        'nextjs',
        'react',
        'typescript',
        'app-router',
        'shadcn-ui',
        'zod',
        'react-hook-form',
        'tailwindcss',
        'docker',
        'eslint',
        'prettier',
    ],
    applicationName: 'Halcyon',
    formatDetection: {
        telephone: false,
    },
};

export const viewport: Viewport = {
    themeColor: '#020617',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    'bg-background min-h-screen font-sans antialiased',
                    fontSans.variable
                )}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Header />
                    {children}
                    <Footer />
                    <Toaster invert />
                </ThemeProvider>
            </body>
        </html>
    );
}

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
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

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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

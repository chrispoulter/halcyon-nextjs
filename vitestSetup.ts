import { vi } from 'vitest';

vi.mock('next/router', () => require('next-router-mock'));

vi.mock('next-auth/react', () => ({
    useSession: vi.fn(() => ({})),
    signIn: vi.fn()
}));

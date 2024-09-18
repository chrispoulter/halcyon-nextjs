import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import HomePage from '@/pages/index';

describe('home page', () => {
    it('should render a heading', () => {
        render(<HomePage />);

        const heading = screen.getByRole('heading', {
            level: 1,
            name: /welcome!/i
        });

        expect(heading).toBeDefined();
    });

    it('should render a register link', () => {
        render(<HomePage />, { wrapper: MemoryRouterProvider });

        const registerLink = screen.getByRole('link', { name: /get started/i });
        fireEvent.click(registerLink);

        expect(registerLink).toBeDefined();
        expect(mockRouter.asPath).toBe('/account/register');
    });
});

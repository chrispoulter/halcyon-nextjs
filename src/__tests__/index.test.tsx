import { fireEvent, render, screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import HomePage from '@/pages/index';

jest.mock('next/router', () => require('next-router-mock'));

jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn()
}));

describe('<HomePage />', () => {
    it('should render a heading', () => {
        render(<HomePage />);

        const heading = screen.getByRole('heading', {
            name: /welcome!/i
        });

        expect(heading).toBeInTheDocument();
    });

    it('should render a register link', () => {
        render(<HomePage />, { wrapper: MemoryRouterProvider });

        const registerLink = screen.getByRole('link', { name: /get started/i });
        fireEvent.click(registerLink);

        expect(mockRouter.asPath).toBe('/register');
    });
});

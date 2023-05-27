import { fireEvent, render, screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import Home from '@/pages/index';

jest.mock('next/router', () => require('next-router-mock'));

jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn()
}));

describe('<Home />', () => {
    it('renders a heading', () => {
        render(<Home />);

        const heading = screen.getByRole('heading', {
            name: /welcome!/i
        });

        expect(heading).toBeInTheDocument();
    });

    it('renders a register link', () => {
        render(<Home />, { wrapper: MemoryRouterProvider });

        const registerLink = screen.getByRole('link', { name: /get started/i });
        fireEvent.click(registerLink);

        expect(mockRouter.asPath).toEqual('/register');
    });
});

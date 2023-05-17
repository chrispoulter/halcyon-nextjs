import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn(),
    getServerSession: jest.fn()
}));

describe('<Home />', () => {
    it('renders a heading', () => {
        render(<Home />);

        const heading = screen.getByRole('heading', {
            name: /welcome!/i
        });

        expect(heading).toBeInTheDocument();
    });
});

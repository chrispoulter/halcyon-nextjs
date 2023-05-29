import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import Register from '@/pages/register';
import { fetcher } from '@/utils/fetch';
import { queryWrapper } from '@/utils/test-utils';

jest.mock('next-auth/react', () => ({
    __esModule: true,
    signIn: jest.fn()
}));

jest.mock('@/utils/fetch', () => ({
    fetcher: jest.fn()
}));

describe('<Register />', () => {
    beforeEach(jest.clearAllMocks);

    it('renders a heading', () => {
        render(<Register />, { wrapper: queryWrapper });

        const heading = screen.getByRole('heading', {
            name: /register/i
        });

        expect(heading).toBeInTheDocument();
    });

    it('handles form submission', async () => {
        render(<Register />, { wrapper: queryWrapper });

        const emailInput = screen.getByLabelText(/email address/i);
        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

        const passwordInput = screen.getAllByLabelText(/password/i);
        fireEvent.change(passwordInput[0], {
            target: { value: 'Testing123!' }
        });
        fireEvent.change(passwordInput[1], {
            target: { value: 'Testing123!' }
        });

        const firstNameInput = screen.getByLabelText(/first name/i);
        fireEvent.change(firstNameInput, { target: { value: 'John' } });

        const lastNameInput = screen.getByLabelText(/last name/i);
        fireEvent.change(lastNameInput, { target: { value: 'Smith' } });

        const dateOfBirthInput = screen.getByLabelText(/date of birth/i);
        fireEvent.change(dateOfBirthInput, { target: { value: '1970-01-01' } });

        const registerButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(registerButton);

        await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
        expect(signIn).toHaveBeenCalledTimes(1);
    });
});

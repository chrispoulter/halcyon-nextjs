import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ky from 'ky-universal';
import { signIn } from 'next-auth/react';
import Register from '@/pages/register';

jest.mock('next-auth/react', () => ({
    __esModule: true,
    signIn: jest.fn()
}));

jest.mock('ky-universal', () => ({
    __esModule: true,
    default: {
        post: jest.fn(() => ({ json: jest.fn() }))
    }
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            }
        }
    });

    // eslint-disable-next-line react/display-name
    return ({ children }: any) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('<Register />', () => {
    beforeEach(cleanup);

    it('renders a heading', () => {
        render(<Register />, { wrapper: createWrapper() });

        const heading = screen.getByRole('heading', {
            name: /register/i
        });

        expect(heading).toBeInTheDocument();
    });

    it('handles form validation error', async () => {
        render(<Register />, { wrapper: createWrapper() });

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

        const registerButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(registerButton);

        const dateOfBirthInput = screen.getByLabelText(/date of birth/i);
        await waitFor(() => expect(dateOfBirthInput).toBeInvalid());

        await waitFor(() => expect(ky.post).toHaveBeenCalledTimes(0));
        await waitFor(() => expect(signIn).toHaveBeenCalledTimes(0));
    });

    it('handles form submission', async () => {
        render(<Register />, { wrapper: createWrapper() });

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

        await waitFor(() => expect(ky.post).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(signIn).toHaveBeenCalledTimes(1));
    });
});

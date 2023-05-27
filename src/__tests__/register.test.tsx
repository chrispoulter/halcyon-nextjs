import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Register from '@/pages/register';
import ky from 'ky-universal';
import { signIn } from 'next-auth/react';

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
    beforeAll(() => {
        const signIn = jest.fn();
        const json = jest.fn().mockResolvedValue({ data: {} });
        const post = jest.fn().mockImplementation(() => ({ json }));

        jest.mock('next-auth/react', () => ({
            signIn
        }));

        jest.mock('ky-universal', () => ({
            post,
            default: {
                post
            }
        }));
    });

    it('renders a heading', () => {
        render(<Register />, { wrapper: createWrapper() });

        const heading = screen.getByRole('heading', {
            name: /register/i
        });

        expect(heading).toBeInTheDocument();
    });

    it('renders a form', () => {
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

        const registerButton = screen.getByTestId('register-button');
        fireEvent.click(registerButton);

        expect(ky.post).toHaveBeenCalled();
        expect(signIn).toHaveBeenCalled();
    });
});

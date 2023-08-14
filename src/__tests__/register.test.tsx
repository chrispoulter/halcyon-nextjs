import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { signIn } from 'next-auth/react';
import { HandlerResponse, UpdatedResponse } from '@/models/base.types';
import RegisterPage from '@/pages/register';
import { RegisterFormValues } from '@/features/account/RegisterForm/RegisterForm';
import { storeWrapper } from '@/utils/test-utils';

jest.mock('next-auth/react', () => ({
    __esModule: true,
    signIn: jest.fn()
}));

const fillRegisterForm = (values: RegisterFormValues) => {
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: values.emailAddress } });

    const passwordInput = screen.getAllByLabelText(/password/i);
    fireEvent.change(passwordInput[0], {
        target: { value: values.password }
    });
    fireEvent.change(passwordInput[1], {
        target: { value: values.confirmPassword }
    });

    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: values.firstName } });

    const lastNameInput = screen.getByLabelText(/last name/i);
    fireEvent.change(lastNameInput, { target: { value: values.lastName } });

    const dobDateSelect = screen.getByLabelText(/date of birth date/i);
    fireEvent.change(dobDateSelect, {
        target: { value: values.dateOfBirth.getDate() }
    });

    const dobMonthSelect = screen.getByLabelText(/date of birth month/i);
    fireEvent.change(dobMonthSelect, {
        target: { value: values.dateOfBirth.getMonth() + 1 }
    });

    const dobYearSelect = screen.getByLabelText(/date of birth year/i);
    fireEvent.change(dobYearSelect, {
        target: { value: values.dateOfBirth.getFullYear() }
    });
};

describe('<RegisterPage />', () => {
    beforeEach(jest.clearAllMocks);
    beforeEach(fetchMock.resetMocks);

    it('renders a heading', () => {
        render(<RegisterPage />, { wrapper: storeWrapper });

        const heading = screen.getByRole('heading', {
            name: /register/i
        });

        expect(heading).toBeInTheDocument();
    });

    it('handles form submission', async () => {
        const response: HandlerResponse<UpdatedResponse> = { data: { id: 1 } };

        fetchMock.mockResponse(JSON.stringify(response), {
            headers: { 'content-type': 'application/json' }
        });

        render(<RegisterPage />, { wrapper: storeWrapper });

        fillRegisterForm({
            emailAddress: 'test@test.com',
            password: 'Testing123',
            confirmPassword: 'Testing123',
            firstName: 'John',
            lastName: 'Smith',
            dateOfBirth: new Date(1970, 1, 1)
        });

        const registerButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(registerButton);

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(signIn).toHaveBeenCalledTimes(1);
    });
});

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { signIn } from 'next-auth/react';
import { randomUUID } from 'crypto';
import RegisterPage from '@/pages/register';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { RegisterFormValues } from '@/features/account/components/register-form';
import { queryWrapper } from '@/lib/test-utils';

const fillRegisterForm = (
    values: Omit<RegisterFormValues, 'confirmPassword'>
) => {
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: values.emailAddress } });

    const passwordInput = screen.getByLabelText('Password', { exact: true });
    fireEvent.change(passwordInput, {
        target: { value: values.password }
    });

    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    fireEvent.change(confirmPasswordInput, {
        target: { value: values.password }
    });

    const firstNameInput = screen.getByLabelText('First Name');
    fireEvent.change(firstNameInput, { target: { value: values.firstName } });

    const lastNameInput = screen.getByLabelText('Last Name');
    fireEvent.change(lastNameInput, { target: { value: values.lastName } });

    const [year, month, date] = values.dateOfBirth.split('-');

    const dobDateSelect = screen.getByLabelText('Date Of Birth Date');
    fireEvent.change(dobDateSelect, {
        target: { value: date }
    });

    const dobMonthSelect = screen.getByLabelText('Date Of Birth Month');
    fireEvent.change(dobMonthSelect, {
        target: { value: month }
    });

    const dobYearSelect = screen.getByLabelText('Date Of Birth Year');
    fireEvent.change(dobYearSelect, {
        target: { value: year }
    });
};

describe('register page', () => {
    beforeEach(jest.clearAllMocks);
    beforeEach(fetchMock.resetMocks);

    it('should register user when form submitted', async () => {
        const response: UpdatedResponse = { id: 'user-1' };

        fetchMock.mockResponse(JSON.stringify(response), {
            headers: { 'content-type': 'application/json' }
        });

        render(<RegisterPage />, { wrapper: queryWrapper });

        fillRegisterForm({
            emailAddress: `${randomUUID()}@example.com`,
            password: randomUUID(),
            firstName: 'Test',
            lastName: 'User',
            dateOfBirth: '1970-01-01'
        });

        const registerButton = screen.getByRole('button', { name: 'Submit' });
        fireEvent.click(registerButton);

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(signIn).toHaveBeenCalledTimes(1);
    });
});

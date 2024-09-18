import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import { randomUUID } from 'crypto';
import { UpdatedResponse } from '@/features/common/common-types';
import { RegisterFormValues } from '@/features/account/components/register-form';
import { queryWrapper } from '@/lib/test-utils';
import RegisterPage from '@/pages/account/register';

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

const response: UpdatedResponse = { id: 'user-1' };

global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    headers: new Headers({
        'Content-Type': 'application/json'
    }),
    json: vi.fn().mockResolvedValue(response)
});

describe('register page', () => {
    it('should register user when form submitted', async () => {
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

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        expect(signIn).toHaveBeenCalledTimes(1);
    });
});

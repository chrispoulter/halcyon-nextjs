import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { signIn } from 'next-auth/react';
import Register from '@/pages/register';
import { queryWrapper } from '@/utils/test-utils';
import { HandlerResponse, UpdatedResponse } from '@/utils/handler';

jest.mock('next-auth/react', () => ({
    __esModule: true,
    signIn: jest.fn()
}));

describe('<Register />', () => {
    beforeEach(jest.clearAllMocks);
    beforeEach(fetchMock.resetMocks);

    it('renders a heading', () => {
        render(<Register />, { wrapper: queryWrapper });

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

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        expect(signIn).toHaveBeenCalledTimes(1);
    });
});

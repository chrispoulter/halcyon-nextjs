import { render, screen, waitFor } from '@testing-library/react';
import { GetProfileResponse } from '@/models/manage.types';
import MyAccount from '@/pages/my-account';
import { HandlerResponse } from '@/utils/handler';
import { queryWrapper } from '@/utils/test-utils';

const response: HandlerResponse<GetProfileResponse> = {
    data: {
        id: 1,
        emailAddress: 'test@test.com',
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: new Date(1970, 1, 1)
    }
};

const responseMock = jest.fn().mockResolvedValue(response);

jest.mock('ky-universal', () => ({
    __esModule: true,
    default: {
        get: jest.fn(() => ({ json: responseMock }))
    }
}));

describe('<MyAccount />', () => {
    beforeEach(jest.clearAllMocks);

    it('renders a heading', async () => {
        render(<MyAccount />, { wrapper: queryWrapper });

        const heading = screen.getByRole('heading', {
            name: /my account/i
        });

        expect(heading).toBeInTheDocument();
    });

    it('renders personal details', async () => {
        render(<MyAccount />, { wrapper: queryWrapper });

        await waitFor(() => expect(responseMock).toBeCalledTimes(1));

        const emailAddress = screen.getByText(response.data?.emailAddress!);
        expect(emailAddress).toBeInTheDocument();
    });
});

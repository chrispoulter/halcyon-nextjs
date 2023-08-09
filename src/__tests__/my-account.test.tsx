import {
    render,
    screen,
    waitForElementToBeRemoved
} from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { HandlerResponse } from '@/models/base.types';
import { GetProfileResponse } from '@/models/manage.types';
import MyAccountPage from '@/pages/my-account';
import { storeWrapper } from '@/utils/test-utils';

jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn()
}));

const response: HandlerResponse<GetProfileResponse> = {
    data: {
        id: 1,
        emailAddress: 'test@test.com',
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: new Date(1970, 1, 1),
        version: '1234'
    }
};

describe('<MyAccountPage />', () => {
    beforeEach(jest.clearAllMocks);
    beforeEach(fetchMock.resetMocks);

    beforeEach(() =>
        fetchMock.mockResponse(JSON.stringify(response), {
            headers: { 'content-type': 'application/json' }
        })
    );

    it('renders a heading', () => {
        render(<MyAccountPage />, { wrapper: storeWrapper });

        const heading = screen.getByRole('heading', {
            name: /my account/i
        });

        expect(heading).toBeInTheDocument();
    });

    it('renders personal details', async () => {
        render(<MyAccountPage />, { wrapper: storeWrapper });

        const loading = screen.getAllByText(/loading/i);
        await waitForElementToBeRemoved(loading);

        const emailAddress = screen.getByText(response.data!.emailAddress);
        expect(emailAddress).toBeInTheDocument();
    });
});

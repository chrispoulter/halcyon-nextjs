import {
    render,
    screen,
    waitForElementToBeRemoved
} from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { GetProfileResponse } from '@/features/manage/manageTypes';
import MyAccountPage from '@/pages/my-account';
import { storeWrapper } from '@/utils/test-utils';

jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn()
}));

const response: GetProfileResponse = {
    id: 1,
    emailAddress: 'test@example.com',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: new Date(1970, 1, 1),
    version: '1234'
};

describe('<MyAccountPage />', () => {
    beforeEach(jest.clearAllMocks);
    beforeEach(fetchMock.resetMocks);

    beforeEach(() =>
        fetchMock.mockResponse(JSON.stringify(response), {
            headers: { 'content-type': 'application/json' }
        })
    );

    it('renders a heading', async () => {
        render(<MyAccountPage />, { wrapper: storeWrapper });

        const loading = screen.getAllByText(/loading/i);
        await waitForElementToBeRemoved(loading);

        const heading = screen.getByRole('heading', {
            name: /my account/i
        });

        expect(heading).toBeInTheDocument();
    });

    it('renders personal details', async () => {
        render(<MyAccountPage />, { wrapper: storeWrapper });

        const loading = screen.getAllByText(/loading/i);
        await waitForElementToBeRemoved(loading);

        const emailAddress = screen.getByText(response.emailAddress);
        expect(emailAddress).toBeInTheDocument();
    });
});

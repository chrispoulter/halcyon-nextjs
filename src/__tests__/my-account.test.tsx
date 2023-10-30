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
    dateOfBirth: '1970-01-01',
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

    it('should render a heading', async () => {
        render(<MyAccountPage />, { wrapper: storeWrapper });

        const loading = screen.getAllByText(/loading/i);
        await waitForElementToBeRemoved(loading);

        const heading = screen.getByRole('heading', {
            name: /my account/i
        });

        expect(heading).toBeInTheDocument();
    });

    it('should render personal details', async () => {
        render(<MyAccountPage />, { wrapper: storeWrapper });

        const loading = screen.getAllByText(/loading/i);
        await waitForElementToBeRemoved(loading);

        const emailAddress = screen.getByText(response.emailAddress);
        expect(emailAddress).toBeInTheDocument();
    });
});

import {
    render,
    screen,
    waitForElementToBeRemoved
} from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { randomUUID } from 'crypto';
import { GetProfileResponse } from '@/features/manage/manageTypes';
import MyAccountPage from '@/pages/my-account';
import { storeWrapper } from '@/utils/test-utils';

const response: GetProfileResponse = {
    id: 1,
    emailAddress: `${randomUUID()}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    dateOfBirth: '1970-01-01',
    version: 1234
};

describe('my account page', () => {
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
            name: 'My Account'
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
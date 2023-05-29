import {
    render,
    screen,
    waitFor,
    waitForElementToBeRemoved
} from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
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

describe('<MyAccount />', () => {
    beforeEach(jest.clearAllMocks);
    beforeEach(fetchMock.resetMocks);

    it('renders a heading', async () => {
        fetchMock.mockResponse(JSON.stringify(response), {
            headers: { 'content-type': 'application/json' }
        });

        render(<MyAccount />, { wrapper: queryWrapper });

        const heading = screen.getByRole('heading', {
            name: /my account/i
        });

        expect(heading).toBeInTheDocument();
    });

    it('renders personal details', async () => {
        fetchMock.mockResponse(JSON.stringify(response), {
            headers: { 'content-type': 'application/json' }
        });

        render(<MyAccount />, { wrapper: queryWrapper });

        const loading = screen.getAllByText(/loading/i);
        await waitForElementToBeRemoved(loading);

        const emailAddress = screen.getByText(response.data?.emailAddress!);
        await waitFor(() => expect(emailAddress).toBeInTheDocument());
    });
});

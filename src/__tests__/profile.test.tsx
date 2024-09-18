import { describe, expect, it, vi } from 'vitest';
import {
    render,
    screen,
    waitForElementToBeRemoved
} from '@testing-library/react';
import { randomUUID } from 'crypto';
import { queryWrapper } from '@/__tests__/test-utils';
import { GetProfileResponse } from '@/features/profile/profile-types';
import ProfilePage from '@/pages/profile';

const response: GetProfileResponse = {
    id: 'user-1',
    emailAddress: `${randomUUID()}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    dateOfBirth: '1970-01-01',
    version: 1234
};

global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    headers: new Headers({
        'Content-Type': 'application/json'
    }),
    json: () => Promise.resolve(response)
});

describe('profile page', () => {
    it('should render personal details', async () => {
        render(<ProfilePage />, { wrapper: queryWrapper });

        const loading = screen.getAllByText(/loading/i);
        await waitForElementToBeRemoved(loading);

        const emailAddress = screen.getByText(response.emailAddress);
        expect(emailAddress).toBeDefined();
    });
});

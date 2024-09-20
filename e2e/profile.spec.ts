import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('profile page', () => {
    test('should render personal details', async ({ page }) => {
        await page.goto('/profile');

        await expect(
            page.getByRole('heading', { name: 'Personal Details' })
        ).toBeVisible();

        await expect(page.getByText('Test User')).toBeVisible();
    });
});

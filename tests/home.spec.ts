import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('home page', () => {
    test('should render a heading', async ({ page }) => {
        await page.goto('/');

        await expect(
            page.getByRole('heading', { name: 'Welcome!' })
        ).toBeVisible();
    });

    test('should render a register link', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: 'Get Started' }).click();

        await expect(
            page.getByRole('heading', { name: 'Register' })
        ).toBeVisible();
    });
});

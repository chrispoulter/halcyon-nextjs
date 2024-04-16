import { test, expect } from '@playwright/test';

test.describe('home page', () => {
    test('should have a title', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Halcyon/);
    });

    test('should render a register link', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: 'Get Started' }).click();

        await expect(
            page.getByRole('heading', { name: 'Register' })
        ).toBeVisible();
    });
});

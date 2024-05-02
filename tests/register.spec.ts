import { test, expect, Page } from '@playwright/test';
import { randomUUID } from 'crypto';

const fillRegisterForm = async (page: Page, values: any) => {
    await page.getByLabel('Email Address').fill(values.emailAddress);
    await page.getByLabel('Password', { exact: true }).fill(values.password);
    await page.getByLabel('Confirm Password').fill(values.confirmPassword);
    await page.getByLabel('First Name').fill(values.firstName);
    await page.getByLabel('Last Name').fill(values.lastName);

    const [year, month, date] = values.dateOfBirth.split('-');
    await page.getByLabel('Date Of Birth Date').selectOption(date);
    await page.getByLabel('Date Of Birth Month').selectOption(month);
    await page.getByLabel('Date Of Birth Year').selectOption(year);
};

test.describe('register page', () => {
    test('should have a title', async ({ page }) => {
        await page.goto('/register');
        await expect(page).toHaveTitle(/Register/);
    });

    test('should register user when form submitted', async ({ page }) => {
        await page.goto('/register');

        await fillRegisterForm(page, {
            emailAddress: `${randomUUID()}@example.com`,
            password: 'password',
            confirmPassword: 'password',
            firstName: 'Test',
            lastName: 'User',
            dateOfBirth: '1970-01-01'
        });

        await page.getByRole('button', { name: 'Submit' }).click();

        await expect(page.getByRole('button', { name: 'U' })).toBeVisible();
    });
});

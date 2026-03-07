import { test, expect } from '@playwright/test';

test.describe('Accounts page', () => {
	test('shows total balance and accounts', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { name: /total balance/i })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Your accounts' })).toBeVisible();
	});

	test('has navigation to Transfers', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: 'Transfers' }).click();
		await expect(page).toHaveURL('/transfers');
	});
});

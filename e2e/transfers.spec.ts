import { test, expect } from '@playwright/test';

test.describe('Transfers page', () => {
	test('shows transfer form', async ({ page }) => {
		await page.goto('/transfers');
		await expect(page.getByRole('heading', { name: /transfer between accounts/i })).toBeVisible();
		await expect(page.getByRole('combobox', { name: /transfer from/i })).toBeVisible();
		await expect(page.getByRole('combobox', { name: /transfer to/i })).toBeVisible();
	});

	test('can complete a transfer and see success', async ({ page }) => {
		await page.goto('/transfers');
		// Open "From" dropdown and select first option
		await page.getByRole('combobox', { name: /transfer from/i }).click();
		await page.getByRole('option').first().click();
		// Open "To" dropdown and select second option
		await page.getByRole('combobox', { name: /transfer to/i }).click();
		await page.getByRole('option').nth(1).click();
		await page.getByLabel(/transfer amount/i).fill('100');
		await page.getByRole('button', { name: /complete transfer/i }).click();
		await expect(page.getByRole('heading', { name: /transfer successful/i })).toBeVisible({
			timeout: 5000
		});
	});
});

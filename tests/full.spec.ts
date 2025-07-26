import { test, expect } from '@playwright/test';

test('first time registering and logging in', async ({ page }) => {
	await page.goto('localhost:5173');
	await page.getByRole('textbox', { name: 'Username' }).click();
	await page.getByRole('textbox', { name: 'Username' }).fill('user000@example.com');
	await page.getByRole('textbox', { name: 'Password' }).click();
	await page.getByRole('textbox', { name: 'Password' }).fill('Password#1');
	await page.getByRole('button', { name: 'Register' }).click();
	await expect(page.getByRole('button', { name: 'Log In' })).toBeEnabled();
	await page.getByRole('textbox', { name: 'Password' }).click();
	await page.getByRole('textbox', { name: 'Password' }).fill('Password#1');
	await page.getByRole('button', { name: 'Log In' }).click();
	await expect(page).toHaveURL('http://localhost:5173/news');
});

test('news querying', async ({ page }) => {
	await page.goto('localhost:5173');
	await page.getByRole('textbox', { name: 'Username' }).click();
	await page.getByRole('textbox', { name: 'Username' }).fill('user000@example.com');
	await page.getByRole('textbox', { name: 'Password' }).click();
	await page.getByRole('textbox', { name: 'Password' }).fill('Password#1');
	await page.getByRole('button', { name: 'Log In' }).click();

	await page.getByRole('link', { name: 'icon News' }).click();
	await page.getByRole('button', { name: 'New News Query' }).click();
	await page.getByRole('button', { name: 'Clear All Tickers' }).click();
	await page.getByRole('textbox', { name: 'Add Ticker/Symbol' }).click();
	await page.getByRole('textbox', { name: 'Add Ticker/Symbol' }).fill('MA');
	await page.locator('.add-ticker').click();
	await page.getByRole('textbox', { name: 'Add Ticker/Symbol' }).click();
	await page.getByRole('textbox', { name: 'Add Ticker/Symbol' }).fill('NVDA');
	await page.locator('.add-ticker').click();
	await page.locator('.col-span-2').first().click();
	await page.getByRole('textbox', { name: 'Add Ticker/Symbol' }).fill('VTI');
	await page.locator('.add-ticker').click();
	await page.locator('.flex.flex-row > button:nth-child(3)').click();
	await page.locator('.flex.flex-row > button:nth-child(3)').click();
	await expect(page.getByText('Articles queried: 21 /')).toBeVisible();
	await page.getByRole('button', { name: 'Submit Query' }).click();
	await expect(page.locator('.news-card').first()).toBeVisible();
});

test('add/remove tickers to/from watchlist', async ({ page }) => {
	await page.goto('localhost:5173');
	await page.getByRole('textbox', { name: 'Username' }).click();
	await page.getByRole('textbox', { name: 'Username' }).fill('user000@example.com');
	await page.getByRole('textbox', { name: 'Password' }).click();
	await page.getByRole('textbox', { name: 'Password' }).fill('Password#1');
	await page.getByRole('button', { name: 'Log In' }).click();

	await page.getByRole('link', { name: 'icon Holdings' }).click();
	await page.locator('.toggle-edit').click();
	await page.getByRole('button', { name: 'Add New' }).first().click();
	await page.getByRole('textbox', { name: 'Ticker' }).click();
	await page.getByRole('textbox', { name: 'Ticker' }).fill('NVDA');
	await page.getByRole('button', { name: 'Confirm' }).click();
	await expect(page.locator('.equity-ticker-name').first()).toContainText('NVDA');
	await page.locator('.remove-ticker').first().click();
	await page.locator('.toggle-edit').click();
});

test('add holdings to a ticker', async ({ page }) => {
	await page.goto('localhost:5173');
	await page.getByRole('textbox', { name: 'Username' }).click();
	await page.getByRole('textbox', { name: 'Username' }).fill('user000@example.com');
	await page.getByRole('textbox', { name: 'Username' }).press('Tab');
	await page.getByRole('textbox', { name: 'Password' }).fill('Password#1');
	await page.getByRole('button', { name: 'Log In' }).click();

	await page.getByRole('link', { name: 'icon Holdings' }).click();
	await page.locator('.toggle-edit').click();
	await page.getByRole('button', { name: 'Add New' }).first().click();
	await page.getByRole('textbox', { name: 'Ticker' }).click();
	await page.getByRole('textbox', { name: 'Ticker' }).fill('NVDA');
	await page.getByRole('button', { name: 'Confirm' }).click();
	await page.locator('.toggle-edit').click();
	await page.locator('#ticker-page-NVDA').click();
	await page.getByRole('button', { name: 'Add New' }).first().click();
	await page.getByRole('textbox').first().click();
	await page.getByRole('textbox').first().fill('5');
	await page.getByRole('textbox').nth(1).click();
	await page.getByRole('textbox').nth(1).fill('20');
	await page.getByRole('button', { name: 'Confirm' }).click();
	await page.locator('.toggle-edit').click();
	await page.locator('.delete-holding').first().click();
});

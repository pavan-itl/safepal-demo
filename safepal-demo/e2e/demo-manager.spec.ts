import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  page.on('dialog', (d) => d.accept());
});

test('navigate to demo manager', async ({ page }) => {
  await page.getByText('Settings', { exact: true }).click();
  await page.getByRole('button', { name: 'Open' }).click();
  await expect(page).toHaveURL(/\/manage$/);
  await expect(page.getByText('Demo Wallet Manager')).toBeVisible();
});

test('add and deduct simulated funds', async ({ page }) => {
  await page.goto('/manage');
  await page.getByLabel('Amount').fill('100');
  await page.getByRole('button', { name: 'Add Funds' }).click();
  await expect(page.getByText('Funds added (SIMULATED)')).toBeVisible();
  await page.getByLabel('Amount').fill('40');
  await page.getByRole('button', { name: 'Deduct Funds' }).click();
  await expect(page.getByText('Funds deducted (SIMULATED)')).toBeVisible();
});

test('set custom balance', async ({ page }) => {
  await page.goto('/manage');
  await page.getByLabel('Set Custom Balance').fill('500');
  await page.getByRole('button', { name: 'Set Balance' }).click();
  await expect(page.getByText('Balance set (SIMULATED)')).toBeVisible();
});

test('add edit delete asset', async ({ page }) => {
  await page.goto('/manage');
  await page.getByRole('button', { name: 'Assets' }).click();
  await page.getByLabel('Symbol').fill('TEST');
  await page.getByLabel('Name').fill('Test Token');
  await page.getByLabel('Balance').fill('10');
  await page.getByLabel('Price').fill('5');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('Asset added (SIMULATED)')).toBeVisible();
  await expect(page.getByText('TEST')).toBeVisible();

  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.getByLabel('Balance').fill('20');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Asset updated (SIMULATED)')).toBeVisible();

  await page.getByRole('button', { name: 'Delete' }).first().click();
  await expect(page.getByText('Asset deleted (SIMULATED)')).toBeVisible();
});

test('add edit delete transaction', async ({ page }) => {
  await page.goto('/manage');
  await page.getByRole('button', { name: 'Transactions' }).click();
  await page.getByLabel('Amount').fill('1.5');
  await page.getByLabel('Value').fill('100');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('Transaction added (SIMULATED)')).toBeVisible();

  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.getByLabel('Amount').fill('2.5');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Transaction updated (SIMULATED)')).toBeVisible();

  await page.getByRole('button', { name: 'Delete' }).first().click();
  await expect(page.getByText('Transaction deleted (SIMULATED)')).toBeVisible();
});

test('reset demo data', async ({ page }) => {
  await page.goto('/manage');
  await page.getByRole('button', { name: 'Reset Demo Data' }).click();
  await expect(page.getByText('Demo data reset')).toBeVisible();
});

test('persistence after reload', async ({ page }) => {
  await page.goto('/manage');
  await page.getByLabel('Set Custom Balance').fill('777');
  await page.getByRole('button', { name: 'Set Balance' }).click();
  await expect(page.getByText('Balance set (SIMULATED)')).toBeVisible();
  await page.reload();
  await expect(page.getByText('777')).toBeVisible();
});

test('responsive no horizontal overflow', async ({ page }) => {
  for (const viewport of [
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 414, height: 896 },
    { width: 768, height: 1024 },
    { width: 1366, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/manage');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBeFalsy();
    await page.screenshot({ path: `test-results/manage-${viewport.width}.png`, fullPage: true });
  }
});

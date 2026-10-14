import test, { expect } from "@playwright/test";

test.describe('Navegación Cruzada', () => {
    test('desde signin se puede navegar a signup', async ({ page }) => {
        await page.goto('/auth/signin');

        await page.getByRole('link', { name: 'Crea una aquí' }).click();

        await expect(page).toHaveURL(/\/auth\/signup$/);
    });

    test('desde signup se puede navegar a signin', async ({ page }) => {
        await page.goto('/auth/signup');

        await page.getByRole('link', { name: 'Inicia sesión aquí' }).click();

        await expect(page).toHaveURL(/\/auth\/signin$/);
    });
});
import test, { expect } from "@playwright/test";

test.describe('Protección de Rutas', () => {
    test('acceder a /home sin sesión redirige a signin', async ({ page }) => {
        await page.goto('/home');

        await expect(page).toHaveURL(/\/auth\/signin$/);
    });

    test('acceder a /perfil sin sesión redirige a signin', async ({ page }) => {
        await page.goto('/perfil');

        await expect(page).toHaveURL(/\/auth\/signin$/);
    });
});
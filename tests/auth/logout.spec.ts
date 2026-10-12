import test, { expect } from "@playwright/test";

test.describe('Logout', () => {
    test('el usuario puede cerrar sesión y pierde el acceso a rutas protegidas', async ({ page }) => {
        const email = `usuario.${Date.now()}@test.com`;
        const password = 'Pa$$word123';
        const name = 'Usuario de Prueba';

        await page.goto('/auth/signup');
        await page.getByTestId('name').fill(name);
        await page.getByTestId('email').fill(email);
        await page.getByTestId('password').fill(password);
        await page.getByTestId('confirmPassword').fill(password);
        await page.getByRole('button', { name: 'Crear cuenta' }).click();
        await expect(page).toHaveURL(/\/home$/);

        await page.getByText(email).click();
        await page.getByText('Log out').click();

        await expect(page).toHaveURL(/\/auth\/signin$/);

        await page.goto('/home');
        await expect(page).toHaveURL(/\/auth\/signin$/);
    });
});
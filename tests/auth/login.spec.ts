import test, { expect } from "@playwright/test";

test.describe('Login Credenciales Inválidas', () => {
    test('no permite iniciar sesión con un email que no existe', async ({ page }) => {
        await page.goto('/auth/signin');

        await page.getByTestId('email').fill(`inexistente.${Date.now()}@test.com`);
        await page.getByTestId('password').fill('Pa$$word123');
        await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

        await expect(page.getByText('El usuario no existe')).toBeVisible();
        await expect(page).toHaveURL(/\/auth\/signin$/);
    });

    test('no permite iniciar sesión con password incorrecta', async ({ page }) => {
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

        await page.goto('/auth/signin');
        await page.getByTestId('email').fill(email);
        await page.getByTestId('password').fill('OtraPassword456');
        await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

        await expect(page.getByText('Error al iniciar sesión')).toBeVisible();
        await expect(page).toHaveURL(/\/auth\/signin$/);
    });
});
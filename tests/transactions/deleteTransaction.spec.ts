import test, { expect } from "@playwright/test";

test.describe('delete Transaction Tests', ()=> {
    // datos de usuario de prueba  
    // email: 'prueba@test.com'
    // password: 'Pa$$word123'
    
    test('Debe de confirmar la eliminación de un item ', async({ page })=> {
        // 1. Iniciar sesión 
        const email = 'prueba@test.com';
        const password = 'Pa$$word123';

        await page.goto('/auth/signin');
        await page.getByTestId('email').fill(email);
        await page.getByTestId('password').fill(password);
        await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
        await expect(page).toHaveURL('/home');
    
        // 2. Abrimos y llenamos el formulario
        await page.getByRole('button', { name: 'Agregar Transacción' }).click();
        const dialog = page.getByRole('dialog');
        const today = new Date().toISOString().split('T')[0];
        const description = 'creando gasto test';

        await expect(dialog.getByText('Agregando una nueva transacción')).toBeVisible();
        await dialog.getByPlaceholder('$500').fill('192837');
        await dialog.locator('select').selectOption('mascotas');
        await dialog.getByPlaceholder('Compra de videojuego en MercadoLibre').fill(description);
        await dialog.locator('input[type="date"]').fill(today);

        await dialog.getByRole('button', { name: 'Agregar Gasto' }).click();
        await expect(page.getByText('Transacción agregada')).toBeVisible();
        await expect(page.getByText('Agregando una nueva transacción')).not.toBeVisible();

        // 3. Eliminar una transacción
        const card = page.getByRole('listitem').filter({ hasText: description });
        await expect(card).toBeVisible();
        await expect(card).toContainText('-$192,837');
        
        // 4. Confirmación de la eliminación 
    });
});
import { test, expect } from '@playwright/test';

test.describe('Transacciones', () => {
    // datos de usuario de prueba  
    // email: 'prueba@test.com'
    // password: 'Pa$$word123'

    test.describe('Crear transacción (gasto)', () => {
        test('un usuario puede crear un gasto y lo ve reflejado en la lista', async ({ page }) => {
            const email = 'prueba@test.com';
            const password = 'Pa$$word123';

            // 1. Inicio de sesión y arranque autenticado en /home
            await page.goto('/auth/signin');
            await page.getByTestId('email').fill(email);
            await page.getByTestId('password').fill(password);
            await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
            await expect(page).toHaveURL('/home');

            // 2. Abrir el modal de nueva transacción
            await page.getByRole('button', { name: 'Agregar Transacción' }).click();
            const dialog = page.getByRole('dialog');
            await expect(dialog.getByText('Agregando una nueva transacción')).toBeVisible();

            // 3. Por defecto el tab "Gasto" está seleccionado
            await expect(dialog.getByRole('tab', { name: 'Gasto' })).toHaveAttribute('aria-selected', 'true');

            // 4. Completar el formulario
            const descripcion = `Compra de prueba ${Date.now()}`;
            const today = new Date().toISOString().split('T')[0];

            await dialog.getByPlaceholder('$500').fill('6543.21');
            await dialog.locator('select').selectOption('restaurantes');
            await dialog.getByPlaceholder('Compra de videojuego en MercadoLibre').fill(descripcion);
            await dialog.locator('input[type="date"]').fill(today);

            await dialog.getByRole('button', { name: 'Agregar Gasto' }).click();

            // 5. Confirmar feedback de éxito y cierre del modal
            await expect(page.getByText('Transacción agregada')).toBeVisible();
            await expect(page.getByText('Agregando una nueva transacción')).not.toBeVisible();

            // 6. Confirmar que la transacción aparece en la grid
            const card = page.getByText(descripcion);
            await expect(card).toBeVisible();
        });
    });

    test.describe('Crear transacción (ingreso)', () => {
        test('un usuario debe de crear un gasto de tipo ingreso y verse reflejado en la lista', async({ page })=> {
            const email = 'prueba@test.com';
            const password = 'Pa$$word123';
            
            // 1. Inicio de sesión dy arranque de autenticación en home
            await page.goto('/auth/signin');
            await page.getByTestId('email').fill(email);
            await page.getByTestId('password').fill(password);
            await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

            // 2. Abrir el modal de nueva transacción
            await page.getByRole('button', { name: 'Agregar Transacción' }).click();
            const dialog = page.getByRole('dialog');
            await expect(dialog.getByText('Agregando una nueva transacción')).toBeVisible();

            // 3. Seleccionar el tab de Ingreso
            await dialog.getByRole('tab', { name: 'Ingreso' }).click();

            // 4. Llenamos el formulario 
            const descripcion = `Compra de prueba ${Date.now()}`;
            const today = new Date().toISOString().split('T')[0];

            await dialog.getByPlaceholder('$500').fill('12345.67');
            await dialog.locator('select').selectOption('restaurantes');
            await dialog.getByPlaceholder('Compra de videojuego en MercadoLibre').fill(descripcion);
            await dialog.locator('input[type="date"]').fill(today);
            await dialog.getByRole('button', { name: 'Agregar Ingreso' }).click();

            // 5. Confirmar feedback de éxito y cierre del modal
            await expect(page.getByText('Transacción agregada')).toBeVisible();
            await expect(page.getByText('Agregando una nueva transacción')).not.toBeVisible();

            // 6. Confirmar que la transacción aparece en la grid
            const card = page.getByText(descripcion);
            await expect(page.getByText('+$12,345.67')).toBeVisible();
        });
    });
});

import test, { expect } from "@playwright/test";

test.describe('delete Transaction Tests', ()=> {
    // datos de usuario de prueba  
    // email: 'prueba@test.com'
    // password: 'Pa$$word123'

    test('Debe de poder cancelar la eliminación y que siga la transacción', async({ page })=> {
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
        // Fecha futura para que el gasto quede primero en la lista (ordenada por fecha desc)
        // y no se pierda en otra página por la paginación
        const fecha = '2099-12-31';
        // Descripción única para no chocar con gastos de ejecuciones anteriores
        const description = `cancelando eliminación test ${Date.now()}`;

        await expect(dialog.getByText('Agregando una nueva transacción')).toBeVisible();
        await dialog.getByPlaceholder('$500').fill('4321');
        await dialog.locator('select').selectOption('mascotas');
        await dialog.getByPlaceholder('Compra de videojuego en MercadoLibre').fill(description);
        await dialog.locator('input[type="date"]').fill(fecha);

        await dialog.getByRole('button', { name: 'Agregar Gasto' }).click();
        await expect(page.getByText('Transacción agregada')).toBeVisible();
        await expect(page.getByText('Agregando una nueva transacción')).not.toBeVisible();

        // 3. Abrimos el modal de eliminación
        const card = page.getByRole('listitem').filter({ hasText: description });
        await expect(card).toBeVisible();
        await expect(card).toContainText('-$4,321.00');

        await card.getByRole('button').click();
        await page.getByRole('menuitem', { name: 'Eliminar' }).click();
        await expect(page.getByText('¿Seguro que deseas eliminar la transacción?')).toBeVisible();

        // 4. Cancelamos la eliminación
        await page.getByRole('button', { name: 'Cancelar' }).click();

        await expect(page.getByText('¿Seguro que deseas eliminar la transacción?')).not.toBeVisible();
        await expect(page.getByText('La transacción se ha eliminado')).not.toBeVisible();
        await expect(card).toBeVisible();
        await expect(card).toContainText('-$4,321.00');

        // 5. Recargamos para confirmar que la transacción sigue guardada
        await page.reload();
        await expect(card).toBeVisible();

        // 6. Limpieza: eliminamos el gasto para no dejar datos de prueba
        await card.getByRole('button').click();
        await page.getByRole('menuitem', { name: 'Eliminar' }).click();
        await page.getByRole('button', { name: 'Eliminar', exact: true }).click();
        await expect(card).not.toBeVisible();
    });
    
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
        // Fecha futura para que el gasto quede primero en la lista (ordenada por fecha desc)
        // y no se pierda en otra página por la paginación
        const fecha = '2099-12-31';
        // Descripción única para no chocar con gastos de ejecuciones anteriores
        const description = `creando gasto test ${Date.now()}`;

        await expect(dialog.getByText('Agregando una nueva transacción')).toBeVisible();
        await dialog.getByPlaceholder('$500').fill('192837');
        await dialog.locator('select').selectOption('mascotas');
        await dialog.getByPlaceholder('Compra de videojuego en MercadoLibre').fill(description);
        await dialog.locator('input[type="date"]').fill(fecha);

        await dialog.getByRole('button', { name: 'Agregar Gasto' }).click();
        await expect(page.getByText('Transacción agregada')).toBeVisible();
        await expect(page.getByText('Agregando una nueva transacción')).not.toBeVisible();

        // 3. Eliminar una transacción
        const card = page.getByRole('listitem').filter({ hasText: description });
        await expect(card).toBeVisible();
        await expect(card).toContainText('-$192,837.00');

        await card.getByRole('button').click();
        await page.getByRole('menuitem', { name: 'Eliminar' }).click();

        // 4. Confirmación de la eliminación
        await expect(page.getByText('¿Seguro que deseas eliminar la transacción?')).toBeVisible();
        await page.getByRole('button', { name: 'Eliminar', exact: true }).click();

        await expect(page.getByText('La transacción se ha eliminado')).toBeVisible();
        await expect(page.getByText('¿Seguro que deseas eliminar la transacción?')).not.toBeVisible();
        await expect(card).not.toBeVisible();
        await expect(page.getByText(description)).toHaveCount(0);
    });
});
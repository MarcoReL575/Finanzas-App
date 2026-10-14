import test, { expect } from "@playwright/test";

test.describe('Edit Transaction Test', ()=> {
    // datos de usuario de prueba
    // email: 'prueba@test.com'
    // password: 'Pa$$word123'

    test('Debe de editar correctamente un gasto y verificar que se actualice', async({ page })=> {
        // 1. Iniciamos sesión
        const email = 'prueba@test.com';
        const password = 'Pa$$word123';

        await page.goto('/auth/signin');
        await page.getByTestId('email').fill(email);
        await page.getByTestId('password').fill(password);
        await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

        await expect(page).toHaveURL('/home');

        // 2. Abrimos el modal
        await page.getByRole('button', { name: 'Agregar Transacción' }).click();
        const dialog = page.getByRole('dialog');
        await expect(dialog.getByText('Agregando una nueva transacción')).toBeVisible();
        await expect(dialog.getByRole('tab', { name: 'Gasto' })).toHaveAttribute('aria-selected', 'true');

        // 3. Creamos gasto
        const descripcion = `Compra de prueba ${Date.now()}`;
        // Fecha futura para que el gasto quede primero en la lista (ordenada por fecha desc)
        // y no se pierda en otra página por la paginación
        const fecha = '2099-12-31';

        await dialog.getByPlaceholder('$500').fill('9876.54');
        await dialog.locator('select').selectOption('restaurantes');
        await dialog.getByPlaceholder('Compra de videojuego en MercadoLibre').fill(descripcion);
        await dialog.locator('input[type="date"]').fill(fecha);

        await dialog.getByRole('button', { name: 'Agregar Gasto' }).click();

        await expect(page.getByText('Transacción agregada')).toBeVisible();
        await expect(page.getByText('Agregando una nueva transacción')).not.toBeVisible();

        // 4. Editamos gasto
        const card = page.getByRole('listitem').filter({ hasText: descripcion });
        await expect(card).toBeVisible();
        await expect(card).toContainText('-$9,876.54');

        await card.getByRole('button').click();
        await page.getByRole('menuitem', { name: 'Editar' }).click();

        // El formulario se precarga con los datos del gasto
        await expect(dialog.getByText('Agregando una nueva transacción')).toBeVisible();
        await expect(dialog.getByRole('tab', { name: 'Gasto' })).toHaveAttribute('aria-selected', 'true');
        await expect(dialog.getByPlaceholder('$500')).toHaveValue('9876.54');
        await expect(dialog.locator('select')).toHaveValue('restaurantes');
        await expect(dialog.getByPlaceholder('Compra de videojuego en MercadoLibre')).toHaveValue(descripcion);

        const nuevaDescripcion = `Compra editada ${Date.now()}`;

        await dialog.getByPlaceholder('$500').fill('1234.56');
        await dialog.locator('select').selectOption('transporte');
        await dialog.getByPlaceholder('Compra de videojuego en MercadoLibre').fill(nuevaDescripcion);

        await dialog.getByRole('button', { name: 'Editar Gasto' }).click();

        // 5. Se actualiza correctamente el gasto
        await expect(page.getByText('La transacción se ha actualizado')).toBeVisible();
        await expect(page.getByText('Agregando una nueva transacción')).not.toBeVisible();

        const cardEditada = page.getByRole('listitem').filter({ hasText: nuevaDescripcion });
        await expect(cardEditada).toBeVisible();
        await expect(cardEditada).toContainText('transporte');
        await expect(cardEditada).toContainText('-$1,234.56');
        await expect(page.getByText(descripcion)).not.toBeVisible();

        // 6. Limpieza: eliminamos el gasto para no dejar datos de prueba
        await cardEditada.getByRole('button').click();
        await page.getByRole('menuitem', { name: 'Eliminar' }).click();
        await expect(page.getByText('¿Seguro que deseas eliminar la transacción?')).toBeVisible();
        await page.getByRole('button', { name: 'Eliminar', exact: true }).click();

        await expect(page.getByText('La transacción se ha eliminado')).toBeVisible();
        await expect(cardEditada).not.toBeVisible();
    });
});

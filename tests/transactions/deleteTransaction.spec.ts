import test, { expect, Locator } from "@playwright/test";

test.describe('delete Transaction Tests', ()=> {
    // datos de usuario de prueba  
    // email: 'prueba@test.com'
    // password: 'Pa$$word123'
    
    let description: string;
    let card: Locator;
    // Indica si el beforeEach llegó a crear el gasto (para saber si el afterEach debe limpiarlo)
    let gastoCreado: boolean;

    test.beforeEach(async({ page })=> {
        // Se reinicia en cada test para que el afterEach no limpie el gasto del test anterior
        gastoCreado = false;
        const email = 'prueba@test.com';
        const password = 'Pa$$word123';

        // 1. Iniciar sesión
        await page.goto('/auth/signin');
        await page.getByTestId('email').fill(email);
        await page.getByTestId('password').fill(password);
        await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
        // Timeout mayor: la redirección después del login puede tardar más de 5s (por defecto)
        // cuando el servidor de desarrollo está compilando /home
        await expect(page).toHaveURL('/home', { timeout: 15_000 });

        // 2. Abrimos y llenamos el formulario
        await page.getByRole('button', { name: 'Agregar Transacción' }).click();
        const dialog = page.getByRole('dialog');
        // Fecha futura para que el gasto quede primero en la lista (ordenada por fecha desc)
        // y no se pierda en otra página por la paginación
        const fecha = '2099-12-31';
        // Descripción única para no chocar con gastos de ejecuciones anteriores
        description = `archivo de prueba ${Date.now()}`;
        await expect(dialog.getByText('Agregando una nueva transacción')).toBeVisible();
        await dialog.getByPlaceholder('$500').fill('4321');
        await dialog.locator('select').selectOption('mascotas');
        await dialog.getByPlaceholder('Compra de videojuego en MercadoLibre').fill(description);
        await dialog.locator('input[type="date"]').fill(fecha);
        await dialog.getByRole('button', { name: 'Agregar Gasto' }).click();
        await expect(page.getByText('Transacción agregada')).toBeVisible();
        gastoCreado = true;
        await expect(page.getByText('Agregando una nueva transacción')).not.toBeVisible();
        
        // 3. Abrimos el modal de eliminación
        card = page.getByRole('listitem').filter({ hasText: description });
        await expect(card).toBeVisible();
        await expect(card).toContainText('-$4,321.00');
    
        await card.getByRole('button').click();
        await page.getByRole('menuitem', { name: 'Eliminar' }).click();
        await expect(page.getByText('¿Seguro que deseas eliminar la transacción?')).toBeVisible();
    });

    // Limpieza: corre siempre, aunque el test falle, para no dejar gastos de prueba en la base
    test.afterEach(async({ page })=> {
        // Si el beforeEach falló antes de crear el gasto, no hay nada que limpiar
        if(!gastoCreado) return;

        // Recargamos para partir de un estado limpio (sin modales abiertos)
        await page.reload();
        await page.getByRole('button', { name: 'Agregar Transacción' }).waitFor();

        // Si el test ya lo eliminó, no hay nada que limpiar
        const cardPendiente = page.getByRole('listitem').filter({ hasText: description });
        if(await cardPendiente.count() === 0) return;

        await cardPendiente.getByRole('button').click();
        await page.getByRole('menuitem', { name: 'Eliminar' }).click();
        await page.getByRole('button', { name: 'Eliminar', exact: true }).click();
        await expect(cardPendiente).toHaveCount(0);
    });

    test('Debe de poder cancelar la eliminación y que siga la transacción', async({ page })=> {
        // 1. Cancelamos la eliminación
        await page.getByRole('button', { name: 'Cancelar' }).click();
        await expect(page.getByText('¿Seguro que deseas eliminar la transacción?')).not.toBeVisible();
        await expect(page.getByText('La transacción se ha eliminado')).not.toBeVisible();
        await expect(card).toBeVisible();
        await expect(card).toContainText('-$4,321.00');

        // 2. Recargamos para confirmar que la transacción sigue guardada
        await page.reload();
        await expect(card).toBeVisible();
        // La limpieza del gasto la hace el afterEach
    });
    
    test('Debe de confirmar la eliminación de un item ', async({ page })=> {
        // 1. Confirmamos la eliminación (el modal ya viene abierto desde el beforeEach)
        await page.getByRole('button', { name: 'Eliminar', exact: true }).click();

        await expect(page.getByText('La transacción se ha eliminado')).toBeVisible();
        await expect(page.getByText('¿Seguro que deseas eliminar la transacción?')).not.toBeVisible();
        await expect(card).not.toBeVisible();
        await expect(page.getByText(description)).toHaveCount(0);
    });
});
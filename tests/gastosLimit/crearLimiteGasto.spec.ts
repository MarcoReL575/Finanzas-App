import test, { expect, Page } from "@playwright/test";

// Convierte un texto de moneda como "$3,450.00" a centavos (345000)
const toCents = (text: string) => Math.round(parseFloat(text.replace(/[^0-9.]/g, '')) * 100);

// Mismo formato que formatCurrency de la app: centavos -> "$3,450.00"
const formatCurrency = (cents: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cents / 100);

// La sección "Límites del Mes" solo muestra el mes actual
const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentYear = now.getFullYear();
// Último día del mes actual: cuenta para el límite del mes y queda arriba en la lista de transacciones
const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();
const fechaMesActual = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${lastDayOfMonth}`;

const limitItem = (page: Page, category: string) => page.getByTestId(`expense-limit-${category}`);

// Lee lo que muestra el ítem de un límite: gastado, límite y porcentaje
async function leerLimite(page: Page, category: string) {
    const item = limitItem(page, category);
    const texto = await item.innerText();

    const gastado = toCents(texto.match(/Gastado:\s*(\$[\d,.]+)/)![1]);
    const restante = texto.match(/Restante:\s*(\$[\d,.]+)/);
    const excedido = texto.match(/Excedido por\s*(\$[\d,.]+)/);
    const limite = restante ? gastado + toCents(restante[1]) : gastado - toCents(excedido![1]);
    const porcentaje = Number(texto.match(/(\d+)% consumido/)![1]);

    return { gastado, limite, porcentaje };
}

// Asegura que la categoría tenga un límite en el mes actual.
// Los límites son únicos por categoría/mes/año y no se pueden eliminar, así que se reutiliza si ya existe
async function asegurarLimite(page: Page, category: string, monto: string) {
    // count() no espera: primero aseguramos que la sección (Server Component async) ya se renderizó,
    // si no, parece que no hay límite y se intenta crear uno duplicado
    await expect(page.getByRole('heading', { name: 'Límites del Mes' })).toBeVisible();
    if(await limitItem(page, category).count() > 0) return;

    await page.getByRole('button', { name: 'Agregar Límite de Gastos' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByTestId('label-category').selectOption(category);
    await dialog.getByTestId('label-limit').fill(monto);
    await dialog.getByRole('button', { name: 'Agregar Límite' }).click();
    await expect(page.getByText('Se ha creado nuevo limite de gasto')).toBeVisible();

    // La lista de límites no se actualiza sola al crear uno, hay que recargar
    await page.reload();
    await expect(limitItem(page, category)).toBeVisible();
}

async function crearGasto(page: Page, { monto, categoria, descripcion }: { monto: number, categoria: string, descripcion: string }) {
    await page.getByRole('button', { name: 'Agregar Transacción' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Agregando una nueva transacción')).toBeVisible();

    await dialog.getByPlaceholder('$500').fill((monto / 100).toFixed(2));
    await dialog.locator('select').selectOption(categoria);
    await dialog.getByPlaceholder('Compra de videojuego en MercadoLibre').fill(descripcion);
    await dialog.locator('input[type="date"]').fill(fechaMesActual);
    await dialog.getByRole('button', { name: 'Agregar Gasto' }).click();

    await expect(page.getByText('Transacción agregada')).toBeVisible();
    await expect(page.getByText('Agregando una nueva transacción')).not.toBeVisible();
}

test.describe('Crear Limite Gasto Test', ()=> {
    // datos de usuario de prueba
    // email: 'prueba@test.com'
    // password: 'Pa$$word123'

    // Descripción del gasto creado en el test (si la hay), para eliminarlo en el afterEach
    let gastoCreado: string | null;

    test.beforeEach( async({ page })=> {
        gastoCreado = null;

        // 1. Iniciar sesión
        await page.goto('/auth/signin');
        await page.getByTestId('email').fill('prueba@test.com');
        await page.getByTestId('password').fill('Pa$$word123');
        await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

        await expect(page.getByText('Bienvenido de nuevo Usuario de Prueba')).toBeVisible();
        await expect(page).toHaveURL('/home', { timeout: 15_000 });
    });

    // Limpieza: elimina el gasto creado para que el "Gastado" de la categoría vuelva a como estaba
    test.afterEach(async({ page })=> {
        if(!gastoCreado) return;

        await page.goto('/home?limit=20');
        const card = page.getByRole('listitem').filter({ hasText: gastoCreado });
        await expect(card).toBeVisible();

        await card.getByRole('button').click();
        await page.getByRole('menuitem', { name: 'Eliminar' }).click();
        await page.getByRole('button', { name: 'Eliminar', exact: true }).click();
        await expect(card).toHaveCount(0);
    });

    test('Debe de crear un límite de gasto', async({ page })=> {
        // Un límite es único por categoría/mes/año y no se puede eliminar, así que usamos
        // un año futuro aleatorio para que el test se pueda repetir sin chocar con uno existente
        const year = 3000 + Math.floor(Math.random() * 7000);

        // 1. Abrimos y llenamos el formulario
        await page.getByRole('button', { name: 'Agregar Límite de Gastos' }).click();
        const dialog = page.getByRole('dialog');
        await expect(dialog.getByText('Establecer Límite de Gasto')).toBeVisible();

        await dialog.getByTestId('label-category').selectOption('entretenimiento');
        await dialog.getByTestId('label-limit').fill('3450');
        await dialog.getByTestId('label-month').selectOption('10');
        await dialog.getByTestId('label-year').fill(String(year));

        // 2. Creamos el límite
        await dialog.getByRole('button', { name: 'Agregar Límite' }).click();
        await expect(page.getByText('Se ha creado nuevo limite de gasto')).toBeVisible();
        await expect(page.getByText('Establecer Límite de Gasto')).not.toBeVisible();
    });

    test('Debe de aumentar el porcentaje de una categoría cuando se crea un gasto dentro de esa categoría', async({ page })=> {
        const categoria = 'entretenimiento';

        // 1. Leemos el estado actual del límite
        await asegurarLimite(page, categoria, '3450');
        const antes = await leerLimite(page, categoria);
        const restante = antes.limite - antes.gastado;
        expect(restante, 'Precondición: el límite de entretenimiento no debe estar excedido').toBeGreaterThan(100);

        // 2. Creamos un gasto de la mitad de lo restante en esa categoría
        const monto = Math.floor(restante / 2);
        gastoCreado = `gasto limite porcentaje ${Date.now()}`;
        await crearGasto(page, { monto, categoria, descripcion: gastoCreado });

        // 3. Verificamos que el límite refleje el gasto
        // (al crear el gasto la app hace redirect('/home') y la sección se vuelve a renderizar con los datos nuevos)
        const item = limitItem(page, categoria);
        const gastado = antes.gastado + monto;
        const porcentajeEsperado = Math.round((gastado / antes.limite) * 100);

        await expect(item).toContainText(`Gastado: ${formatCurrency(gastado)}`);
        await expect(item).toContainText(`${porcentajeEsperado}% consumido`);
        await expect(item).toContainText(`Restante: ${formatCurrency(antes.limite - gastado)}`);
        expect(porcentajeEsperado).toBeGreaterThan(antes.porcentaje);
        await expect(item.getByTestId('progresBar')).toHaveAttribute('style', new RegExp(`width:\\s*${porcentajeEsperado}%`));
    });

    test('Debe de marcar la barra del gasto al 100% si se supera el gasto y marcar el porcentaje excedente', async({ page })=> {
        const categoria = 'regalos';

        // 1. Leemos el estado actual del límite
        await asegurarLimite(page, categoria, '777.77');
        const antes = await leerLimite(page, categoria);

        // 2. Creamos un gasto que supere el límite por $500
        const monto = Math.max(antes.limite - antes.gastado, 0) + 50_000;
        gastoCreado = `gasto limite excedido ${Date.now()}`;
        await crearGasto(page, { monto, categoria, descripcion: gastoCreado });

        // 3. Verificamos que el límite se marque como excedido
        const item = limitItem(page, categoria);
        const gastado = antes.gastado + monto;

        await expect(item).toContainText(`Gastado: ${formatCurrency(gastado)}`);
        await expect(item.getByTestId('progresBar')).toHaveAttribute('style', /width:\s*100%/);
        await expect(item.getByTestId('progresBar')).toHaveClass(/bg-red-500/);
        // El porcentaje se limita a 100 en calculateExpenseLimitItems; el excedente se muestra en dinero
        await expect(item).toContainText('100% consumido');
        await expect(item).toContainText(`Excedido por ${formatCurrency(gastado - antes.limite)}`);
    });
});


import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ItemExpenseLimit from './ItemExpenseLimit';
import type { BudgetDisplayItem } from '../types/types';
import { formatCurrency } from '@/src/shared/helper/formatCurrency';
import '@testing-library/jest-dom/vitest'

// -----------------------------------------------------
// Mocks
// -----------------------------------------------------

vi.mock('@/src/shared/helper/formatCurrency', () => ({
    formatCurrency: vi.fn((amount: number) => `$${amount.toFixed(2)}`),
}));

// -----------------------------------------------------
// Helpers
// -----------------------------------------------------

const createBudgetItem = (
    overrides: Partial<BudgetDisplayItem> = {},
): BudgetDisplayItem => ({
    id: 'budget-1',
    category: 'restaurantes',
    categoryLabel: 'Alimentación',
    categoryIcon: '🍎',
    limitAmount: 3000,
    spentAmount: 1500,
    remainingAmount: 1500,
    percentage: 50,
    isExceeded: false,
    ...overrides,
});

async function renderComponent(
    item: BudgetDisplayItem = createBudgetItem(),
) {
    const component = await ItemExpenseLimit({ item });
    return render(component);
}

// -----------------------------------------------------
// Tests
// -----------------------------------------------------

describe('ItemExpenseLimit', () => {
    it('debe renderizar la categoría y su icono', async () => {
        await renderComponent();

        expect(screen.getByText(/Alimentación/)).toBeInTheDocument();
        expect(screen.getByText(/🍎/)).toBeInTheDocument();
    });

    it('debe mostrar el monto gastado', async () => {
        await renderComponent(createBudgetItem({ 
            spentAmount: 1500,
            remainingAmount: 1200
        }));

        expect(screen.getByText('Gastado:')).toBeInTheDocument();
        expect(formatCurrency).toHaveBeenCalledWith(1500);
        expect(screen.getByText('$1500.00')).toBeInTheDocument();
    });

    it('debe mostrar el porcentaje consumido', async () => {
        await renderComponent(createBudgetItem({ percentage: 50 }));

        expect(screen.getByText('50% consumido')).toBeInTheDocument();
    });

    it('debe mostrar el monto restante cuando el límite no se ha excedido', async () => {
        await renderComponent(
            createBudgetItem({
                remainingAmount: 1200,
                isExceeded: false,
            }),
        );

        expect(
            screen.getByText('Restante:'),
        ).toBeInTheDocument();

        expect(formatCurrency).toHaveBeenCalledWith(1200);

        expect(
            screen.getByText('$1200.00'),
        ).toBeInTheDocument();
    });

    it('debe mostrar cuánto se excedió cuando el gasto supera el límite', async () => {
        await renderComponent(
            createBudgetItem({
                spentAmount: 3500,
                remainingAmount: -500,
                percentage: 100,
                isExceeded: true,
            }),
        );

        expect(screen.getByText(/Excedido por/)).toBeInTheDocument();
        expect(formatCurrency).toHaveBeenCalledWith(500);
        expect(screen.getByText('$500.00')).toBeInTheDocument();
        expect(screen.queryByText('Restante:')).not.toBeInTheDocument();
    });

    it('debe aplicar el estilo verde cuando el consumo es menor al 80%', async () => {
        await renderComponent(
            createBudgetItem({
                percentage: 50,
                isExceeded: false,
            }),
        );
        const percentage = screen.getByText('50% consumido');
        const progressBar = screen.getByTestId('progresBar');

        expect(percentage).toHaveClass('text-emerald-400');
        expect(progressBar).toHaveClass('bg-emerald-500');
    });

    it('debe aplicar el estilo ámbar cuando el consumo es de al menos 80% y no se ha excedido', async () => {
        await renderComponent(
            createBudgetItem({
                percentage: 80,
                isExceeded: false,
            }),
        );

        const percentage = screen.getByText('80% consumido');
        const progressBar = screen.getByTestId('progresBar');

        expect(percentage).toHaveClass('text-amber-500');
        expect(progressBar).toHaveClass('bg-amber-500');
    });

    it('debe aplicar el estilo rojo cuando el límite está excedido', async () => {
        await renderComponent(
            createBudgetItem({
                percentage: 100,
                isExceeded: true,
            }),
        );

        const percentage = screen.getByText('100% consumido');
        const progressBar = screen.getByTestId('progresBar');

        expect(percentage).toHaveClass('text-red-500');
        expect(progressBar).toHaveClass('bg-red-500');
    });

    it('debe limitar el ancho de la barra visual al 100%', async () => {
        const { container } = await renderComponent(
            createBudgetItem({
                percentage: 125,
                isExceeded: true,
            }),
        );

        const progressBar = screen.getByTestId('progresBar');

        expect(progressBar).toHaveStyle({ width: '100%' });
    });

    it('debe mostrar 0% cuando el porcentaje es cero', async () => {
        const { container } = await renderComponent(
            createBudgetItem({
                percentage: 0,
                spentAmount: 0,
                remainingAmount: 3000,
            }),
        );
        const progressBar = screen.getByTestId('progresBar');

        expect(screen.getByText('0% consumido')).toBeInTheDocument();
        expect(progressBar).toHaveStyle({ width: '0%' });
    });
});
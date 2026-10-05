import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import ExpenseLimitList from './ExpenseLimitList';
import { BudgetDisplayItem } from "../types/types";
import '@testing-library/jest-dom/vitest';

vi.mock('./ItemExpenseLimit', () => ({ 
    default: ({ item, }: { item: BudgetDisplayItem; }) => ( 
        <div data-testid={`expense-limit-item-${item.id}`}> 
            <span>{item.categoryLabel}</span> 
            <span>{item.limitAmount}</span> 
        </div> 
    ), 
}));

const createBudgetItem = ( 
    overrides: Partial<BudgetDisplayItem> = {} 
    ): BudgetDisplayItem => ({ 
        id: 'budget-1', 
        category: 'alimentacion', 
        categoryLabel: 'Alimentación', 
        categoryIcon: null, 
        limitAmount: 3000, 
        spentAmount: 1500, 
        remainingAmount: 1500, 
        percentage: 50, 
        isExceeded: false, 
        ...overrides, 
    }
);

describe('ExpenseLimitList Test', ()=> {
    test('Debe mostrar un aviso cuando no hay limite de gasto', ()=> {
        render(<ExpenseLimitList budgetItems={[]} />);

        expect(screen.getByText('No has configurado ningún límite de gasto para este mes.')).toBeInTheDocument();
    });

    test('Debe renderizar los items de forma correcta', ()=> {
        const budgetItems = [ 
            createBudgetItem({ 
                id: 'budget-1', 
                categoryLabel: 'Restaurantes', 
            }), 
            createBudgetItem({ 
                id: 'budget-2', 
                category: 'transporte', 
                categoryLabel: 'Transporte', 
            }), 
            createBudgetItem({ 
                id: 'budget-3', 
                category: 'entretenimiento', 
                categoryLabel: 'Entretenimiento', 
            }), 
        ];

        render(<ExpenseLimitList budgetItems={budgetItems} />);
        expect( screen.getByTestId('expense-limit-item-budget-1') ).toBeInTheDocument(); 
        expect( screen.getByTestId('expense-limit-item-budget-2') ).toBeInTheDocument(); 
        expect( screen.getByTestId('expense-limit-item-budget-3') ).toBeInTheDocument();
    });
});
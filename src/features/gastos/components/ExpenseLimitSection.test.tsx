import { beforeEach, describe, expect, test, vi } from "vitest";
import '@testing-library/jest-dom/vitest';
import { gastoService } from '../services/gastoService'; 
import { transactionService } from '../../transaction/services/serviceTransaction'; 
import { calculateExpenseLimitItems } from '../helper/expenseLimitCalculator';
import { render, screen } from "@testing-library/react";
import ExpenseLimitSection from "./ExpenseLimitSection";

vi.mock('../services/gastoService', () => ({ 
    gastoService: { 
        getUsersExpenseLimits: vi.fn(), 
    }, 
}));

vi.mock( '../../transaction/services/serviceTransaction', () => ({ 
    transactionService: { 
        getTransactionsUser: vi.fn(), 
    }, 
}));

vi.mock('./ExpenseLimitHeader', () => ({ 
    default: () => ( 
        <div data-testid="expense-limit-header"> 
            Expense Limit Header 
        </div> 
    ), 
}));

vi.mock('../helper/expenseLimitCalculator', () => ({ 
    calculateExpenseLimitItems: vi.fn(), 
}));

vi.mock('./ExpenseLimitList', () => ({ 
    default: ({ budgetItems, }: { budgetItems: unknown[]; }) => ( 
        <div data-testid="expense-limit-list"> 
            {budgetItems.map((item: any) => ( 
                <div key={item.id} data-testid={`expense-limit-item-${item.id}`} > 
                    {item.categoryLabel} 
                </div> 
            ))} 
        </div> 
    ), 
}));

const mockBudgets = [ 
    { 
        id: 'budget-1', 
        category: 'alimentacion', 
        monto: 3000, 
        month: 10, 
        year: 2026, 
    }, 
];

const mockTransactions = [ 
    { 
        id: 'transaction-1', 
        categoria: 'alimentacion', 
        monto: 1000, 
        tipo: 'gasto', 
        createdAt: '2026-10-10T12:00:00.000Z', 
    }, 
];

const mockExpenseLimitItems = [ 
    { 
        id: 'budget-1', 
        category: 'alimentacion', 
        categoryLabel: 'Alimentación', 
        categoryIcon: null, 
        limitAmount: 3000, 
        spentAmount: 1000, 
        remainingAmount: 2000, 
        percentage: 33, 
        isExceeded: false, 
    }, 
];

describe('ExpenseLimitSection Test', ()=> {
    beforeEach(() => { 
        vi.clearAllMocks(); 
        vi.mocked(gastoService.getUsersExpenseLimits).mockResolvedValue({ budgets: mockBudgets, } as any); 
        vi.mocked( transactionService.getTransactionsUser ).mockResolvedValue({ transactions: mockTransactions, } as any); 
        vi.mocked( calculateExpenseLimitItems ).mockReturnValue(mockExpenseLimitItems);
    });

    test('debe renderizar la sección correctamente', async()=> {
        const component = await ExpenseLimitSection({ userId: 'user-123', }); 
        render(component);
        expect( screen.getByTestId('expense-limit-header') ).toBeInTheDocument(); 
        expect( screen.getByTestId('expense-limit-list') ).toBeInTheDocument();
    });

    test('debe obtener los límites de gastos del usuario', async () => { 
        const userId = 'user-123'; 
        const component = await ExpenseLimitSection({ userId, }); 
        render(component); 
        
        expect( gastoService.getUsersExpenseLimits ).toHaveBeenCalledTimes(1); 
        expect( gastoService.getUsersExpenseLimits ).toHaveBeenCalledWith(userId); 
    });

    test('debe obtener las transacciones del usuario', async () => { 
        const userId = 'user-123'; 
        const component = await ExpenseLimitSection({ userId, }); 
        render(component); 
        
        expect( transactionService.getTransactionsUser ).toHaveBeenCalledTimes(1); 
        expect( transactionService.getTransactionsUser ).toHaveBeenCalledWith(userId); 
    });

    test('debe pasar los resultados del calculator a ExpenseLimitList', async () => { 
        const component = await ExpenseLimitSection({ userId: 'user-123', }); 
        render(component); 
        
        expect( screen.getByTestId('expense-limit-item-budget-1') ).toBeInTheDocument(); 
        expect( screen.getByText('Alimentación') ).toBeInTheDocument(); 
    });

    test('debe renderizar todos los elementos devueltos por el calculator', async () => { 
        const multipleItems = [ 
            mockExpenseLimitItems[0], { 
                id: 'budget-2', 
                category: 'transporte', 
                categoryLabel: 'Transporte', 
                categoryIcon: null, 
                limitAmount: 1500, 
                spentAmount: 500, 
                remainingAmount: 1000, 
                percentage: 33, 
                isExceeded: false, 
            }, 
            { 
                id: 'budget-3', 
                category: 'entretenimiento', 
                categoryLabel: 'Entretenimiento', 
                categoryIcon: null, 
                limitAmount: 2000, 
                spentAmount: 2500, 
                remainingAmount: -500,
                percentage: 100, 
                isExceeded: true, 
            }, 
        ]; 
        vi.mocked( calculateExpenseLimitItems ).mockReturnValue(multipleItems); 
        const component = await ExpenseLimitSection({ userId: 'user-123', }); 
        render(component); 
        expect( screen.getByTestId( 'expense-limit-item-budget-1' ) ).toBeInTheDocument(); 
        expect( screen.getByTestId( 'expense-limit-item-budget-2' ) ).toBeInTheDocument(); 
        expect( screen.getByTestId( 'expense-limit-item-budget-3' ) ).toBeInTheDocument(); 
    });
});
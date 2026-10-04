import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { SelectTransaction } from "../../transaction/types/types";
import { fireEvent, render, screen } from "@testing-library/react";
import ChartBar from "./ChartBar";
import '@testing-library/jest-dom/vitest';
import userEvent from "@testing-library/user-event";

vi.mock('recharts', () => ({ 
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => ( 
        <div data-testid="responsive-container">
            {children}
        </div>
    ), 
    BarChart: ({ children }: { children: React.ReactNode }) => ( 
        <div data-testid="bar-chart">
            {children}
        </div> 
    ), 
    Bar: () => <div data-testid="bar" />, 
    XAxis: () => <div data-testid="x-axis" />, 
    YAxis: () => <div data-testid="y-axis" />, 
    CartesianGrid: () => <div data-testid="cartesian-grid" />, 
    Tooltip: () => <div data-testid="tooltip" /> 
}));

const createTransaction = ( 
    overrides: Partial<{ 
        id: string; 
        categoria: string; 
        monto: number; 
        tipo: string; 
        createdAt: string; 
    }> = {} ) => ({ 
        id: '1', 
        categoria: 'comida', 
        monto: 100, 
        tipo: 'gasto', 
        createdAt: '2026-10-15T12:00:00.000Z', 
        ...overrides, 
    }
);

describe('ChartBar Test', ()=> {

    beforeEach(() => { 
        vi.useFakeTimers(); 
        // Fijamos la fecha para que el test no dependa 
        // del mes/año real en el que se ejecute. 
        vi.setSystemTime(new Date('2026-10-20T12:00:00.000Z')); 
    });

    afterEach(() => { 
        vi.useRealTimers(); 
    });

    test('debe renderizar correctamente el título y los controles', () => { 
        render(<ChartBar transactionsLista={[]} />); 
        
        expect( screen.getByRole('heading', { name: /gastos por categoría/i, }) ).toBeInTheDocument(); 
        expect( screen.getByRole('combobox') ).toBeInTheDocument(); 
        expect( screen.getByRole('spinbutton') ).toBeInTheDocument(); 
    });

    test('debe mostrar el mensaje cuando no existen gastos', () => { 
        render(<ChartBar transactionsLista={[]} />); 
        
        expect( screen.getByText( /no hay gastos registrados en octubre de 2026/i ) ).toBeInTheDocument(); 
        expect( screen.getByText( /selecciona otro mes o registra una transacción/i ) ).toBeInTheDocument(); 
    });

    test('debe mostrar el total gastado del mes seleccionado', () => {
        const transactions = [ 
            createTransaction({ 
                id: '1', 
                categoria: 'restaurantes', 
                monto: 10000, 
            }), 
            createTransaction({ 
                id: '2', 
                categoria: 'ahorro', 
                monto: 20000, 
            }), 
            createTransaction({ 
                id: '3', 
                categoria: 'transporte', 
                monto: 15000, 
            }), 
        ];

        render( <ChartBar transactionsLista={transactions as any} /> ); 
            
        expect( screen.getByText(/total gastado en octubre/i) ).toBeInTheDocument(); // 100 + 200 + 150 = 450 
        expect( screen.getByText((context)=> context.includes('450.00')) ).toBeInTheDocument(); 
    });

    test('debe incluir únicamente los gastos del mes seleccionado', () => { 
        const transactions = [ 
            // Octubre 2026 → debe incluirse 
            createTransaction({ 
                id: '1', 
                categoria: 'restaurantes', 
                monto: 10000, //$100
                createdAt: '2026-10-10T12:00:00.000Z', 
            }), 
            // Septiembre 2026 → no debe incluirse 
            createTransaction({ 
                id: '2', 
                categoria: 'restaurantes', 
                monto: 50000, //$500
                createdAt: '2026-09-10T12:00:00.000Z' 
            }), 
        ]; 
        render( <ChartBar transactionsLista={transactions as any} /> ); 
        
        expect( screen.getByText('$100.00') ).toBeInTheDocument(); 
        expect( screen.queryByText('$600.00') ).not.toBeInTheDocument(); 
    });

    test('debe incluir únicamente transacciones de tipo gasto', () => { 
        const transactions = [ 
            // Debe incluirse 
            createTransaction({ 
                id: '1', 
                categoria: 'restaurantes', 
                monto: 10000, 
                tipo: 'gasto', 
            }), 
            // No debe incluirse 
            createTransaction({ 
                id: '2', 
                categoria: 'restaurantes', 
                monto: 50000, 
                tipo: 'ingreso', 
            }), 
        ]; 
        render( <ChartBar transactionsLista={transactions as any} /> ); 
        expect( screen.getByText('$100.00') ).toBeInTheDocument(); 
        expect( screen.queryByText('$600.00') ).not.toBeInTheDocument(); 
    });

    test('debe cambiar el mes seleccionado', async () => { 
        const transactions = [ 
            // Octubre 
            createTransaction({ 
                id: '1', 
                categoria: 'restaurantes', 
                monto: 10000, 
                createdAt: '2026-10-10T12:00:00.000Z', 
            }), 
            // Septiembre
            createTransaction({ 
                id: '2', 
                categoria: 'restaurantes', 
                monto: 50000, 
                createdAt: '2026-09-10T12:00:00.000Z', 
            }), 
        ]; 
        render( <ChartBar transactionsLista={transactions as any} /> ); 
        const monthSelect = screen.getByRole('combobox'); 
        // Septiembre = 9 
        fireEvent.change(monthSelect, { target: { value: '9' } });
        expect( screen.getByText(/total gastado en septiembre/i) ).toBeInTheDocument(); 
        expect( screen.getByText('$500.00') ).toBeInTheDocument(); 
        expect( screen.queryByText('$100.00') ).not.toBeInTheDocument(); 
    });

    test('debe cambiar el año seleccionado', async () => { 
        const transactions = [ 
            // Octubre 2026 
            createTransaction({ 
                id: '1', 
                categoria: 'restaurantes', 
                monto: 10000, 
                createdAt: '2026-10-10T12:00:00.000Z', 
            }), 
            // Octubre 2025 
            createTransaction({ 
                id: '2', 
                categoria: 'restaurantes', 
                monto: 70000, 
                createdAt: '2025-10-10T12:00:00.000Z', 
            }), 
        ]; 
        render( <ChartBar transactionsLista={transactions as any} /> ); 
        const yearInput = screen.getByRole('spinbutton'); 
        fireEvent.change(yearInput, { target: { value: '2025' } }); 
        expect( screen.getByText('$700.00') ).toBeInTheDocument(); 
        expect( screen.queryByText('$100.00') ).not.toBeInTheDocument(); 
    });

    test('debe renderizar el gráfico cuando existen gastos', () => { 
        const transactions = [ 
            createTransaction({ 
                id: '1', 
                categoria: 'restaurantes', 
                monto: 30000, 
            }), 
        ]; 
        render( <ChartBar transactionsLista={transactions as any} /> ); 
        expect( screen.getByTestId('responsive-container') ).toBeInTheDocument(); 
        expect( screen.getByTestId('bar-chart') ).toBeInTheDocument(); 
        expect( screen.getByTestId('bar') ).toBeInTheDocument(); 
    });
});




import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import ExpenseLimitHeader from "./ExpenseLimitHeader";
import '@testing-library/jest-dom/vitest';

vi.mock('./ButtonExpenseLimit', ()=> ({
    default: ()=> (
        <button 
            data-testid="button-expense-limit"
        >
            Agregar Límite de Gastos
        </button>
    )
}));

describe('ExpenseLimitHeader Test', ()=> {
    test('Debe renderizar el título ', ()=> {
        render(<ExpenseLimitHeader />);

        const header = screen.getByRole('heading', { level: 3, name: /límites del mes/i } );

        expect(header).toBeInTheDocument()
    });

    test('Debe renderizar el botón de límites de gastos ', ()=> {
        render(<ExpenseLimitHeader />);

        const button = screen.getByRole('button', { name: /agregar límite de gastos/i } );

        expect(button).toBeInTheDocument()
    });
});
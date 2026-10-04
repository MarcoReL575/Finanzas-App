import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import ButtonExpenseLimit from "./ButtonExpenseLimit";
import '@testing-library/jest-dom/vitest';
import userEvent from "@testing-library/user-event";

const openModalMock = vi.fn();

vi.mock('@/src/shared/stores/modalStore', ()=> ({
    useModalStore: vi.fn((selector)=> selector({
        openModal: openModalMock,
    }))
}));

describe('Button Expense Limit Test', ()=> {
    test('Debe de renderizar el botón correctamente', ()=> {
        render(<ButtonExpenseLimit />);

        const button = screen.getByRole('button', { name: 'Agregar Límite de Gastos' });
        expect(button).toBeInTheDocument();
    });

    test('Debe de abrir el modal al hace click en él', async()=> {
        const user = userEvent.setup();
        render(<ButtonExpenseLimit />);

        const button = screen.getByRole('button', { name: 'Agregar Límite de Gastos' });
        await user.click(button);

        expect(openModalMock).toHaveBeenCalledTimes(1);
        expect(openModalMock).toHaveBeenCalledWith('expenseLimit');
    });
});
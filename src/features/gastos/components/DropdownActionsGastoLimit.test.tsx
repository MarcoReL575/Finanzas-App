import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/vitest';
import DropdownActionsGastoLimit from "./DropdownActionsGastoLimit";
import { selectExpenseLimitAction } from "../actions/gastosActions";
import { useExpenseLimit } from "@/src/shared/stores/useExpenseLimit";
import { SelectLimiteGasto } from "../types/types";

const openModalMock = vi.fn();

vi.mock('@/src/shared/stores/modalStore', ()=> ({
    useModalStore: vi.fn((selector)=> selector({
        openModal: openModalMock,
    }))
}));

vi.mock('../actions/gastosActions', ()=> ({
    selectExpenseLimitAction: vi.fn(),
}));

const gastoLimitId = 'limit-123';

const mockExpenseLimit: SelectLimiteGasto = {
    id: gastoLimitId,
    userId: 'user-1',
    category: 'restaurantes',
    monto: 345000,
    month: 10,
    year: 2026,
    createdAt: new Date('2026-10-01'),
};

// Abre el menú y regresa el user para seguir interactuando
const abrirMenu = async()=> {
    const user = userEvent.setup();
    render(<DropdownActionsGastoLimit gastoLimitId={gastoLimitId} />);
    await user.click(screen.getByRole('button', { name: 'Ver ocpiones' }));
    return user;
};

describe('DropdownActionsGastoLimit Test', ()=> {

    beforeEach(()=> {
        vi.clearAllMocks();
        useExpenseLimit.setState({ expenseLimitId: '', expenseLimitToEdit: undefined });
    });

    describe('Renderizado', ()=> {
        test('Debe de mostrar el botón para ver las opciones con el menú cerrado', ()=> {
            render(<DropdownActionsGastoLimit gastoLimitId={gastoLimitId} />);

            expect(screen.getByRole('button', { name: 'Ver ocpiones' })).toBeInTheDocument();
            expect(screen.queryByRole('menuitem', { name: 'Editar' })).not.toBeInTheDocument();
            expect(screen.queryByRole('menuitem', { name: 'Eliminar' })).not.toBeInTheDocument();
        });

        test('Debe de mostrar las opciones Editar y Eliminar al abrir el menú', async()=> {
            await abrirMenu();

            expect(await screen.findByRole('menuitem', { name: 'Editar' })).toBeInTheDocument();
            expect(screen.getByRole('menuitem', { name: 'Eliminar' })).toBeInTheDocument();
        });
    });

    describe('Eliminar', ()=> {
        test('Debe de guardar el id del límite y abrir el modal de eliminación', async()=> {
            const user = await abrirMenu();

            await user.click(await screen.findByRole('menuitem', { name: 'Eliminar' }));

            expect(useExpenseLimit.getState().expenseLimitId).toBe(gastoLimitId);
            expect(openModalMock).toHaveBeenCalledTimes(1);
            expect(openModalMock).toHaveBeenCalledWith('deleteExpenseLimit');
            expect(selectExpenseLimitAction).not.toHaveBeenCalled();
        });
    });

    describe('Editar', ()=> {
        test('Debe de obtener el límite, guardarlo en el store y abrir el modal del formulario', async()=> {
            vi.mocked(selectExpenseLimitAction).mockResolvedValue({
                success: true,
                message: '',
                expenseLimit: mockExpenseLimit,
            });
            const user = await abrirMenu();

            await user.click(await screen.findByRole('menuitem', { name: 'Editar' }));

            await waitFor(()=> {
                expect(openModalMock).toHaveBeenCalledWith('expenseLimit');
            });
            expect(selectExpenseLimitAction).toHaveBeenCalledTimes(1);
            expect(selectExpenseLimitAction).toHaveBeenCalledWith(gastoLimitId);
            expect(useExpenseLimit.getState().expenseLimitToEdit).toEqual(mockExpenseLimit);
            expect(openModalMock).toHaveBeenCalledTimes(1);
        });

        test('No debe de abrir el modal ni guardar el límite si no se pudo obtener', async()=> {
            vi.mocked(selectExpenseLimitAction).mockResolvedValue({
                success: false,
                message: 'El usuario no cuenta con una sesión',
                expenseLimit: {} as SelectLimiteGasto,
            });
            const user = await abrirMenu();

            await user.click(await screen.findByRole('menuitem', { name: 'Editar' }));

            await waitFor(()=> {
                expect(selectExpenseLimitAction).toHaveBeenCalledWith(gastoLimitId);
            });
            expect(openModalMock).not.toHaveBeenCalled();
            expect(useExpenseLimit.getState().expenseLimitToEdit).toBeUndefined();
        });
    });
});

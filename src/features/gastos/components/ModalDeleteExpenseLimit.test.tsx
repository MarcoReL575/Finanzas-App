import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/vitest';
import toast from "react-hot-toast";
import ModalDeleteExpenseLimit from "./ModalDeleteExpenseLimit";
import { useModalStore } from "@/src/shared/stores/modalStore";
import { useExpenseLimit } from "@/src/shared/stores/useExpenseLimit";
import { deleteGastoLimitAction } from "../actions/gastosActions";

const refreshMock = vi.fn();

vi.mock('@/src/shared/stores/modalStore', ()=> ({
    useModalStore: vi.fn()
}));

vi.mock('next/navigation', ()=> ({
    useRouter: ()=> ({ refresh: refreshMock }),
}));

vi.mock('../actions/gastosActions', ()=> ({
    deleteGastoLimitAction: vi.fn(),
}));

vi.mock('react-hot-toast', ()=> ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const expenseLimitId = 'limit-123';

describe('ModalDeleteExpenseLimit Test', ()=> {

    const closeModalMock = vi.fn();

    const mockStore = (isOpen: boolean)=> {
        vi.mocked(useModalStore).mockImplementation(
            (selector: any)=> selector({
                isOpen,
                closeModal: closeModalMock,
            })
        )
    };

    beforeEach(()=> {
        vi.clearAllMocks();
        useExpenseLimit.setState({ expenseLimitId });
    });

    describe('Renderizado', ()=> {
        test('Debe de mostrar el modal con el mensaje de confirmación cuando está abierto', async()=> {
            mockStore(true);
            render(<ModalDeleteExpenseLimit />);

            expect(await screen.findByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText('¿Deseas Eliminar el Límite de gasto?')).toBeInTheDocument();
            expect(screen.getByText('Esta acción eliminará permanentemente el gasto y no se podrá reestablecer esta acción')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Si, Eliminar' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
        });

        test('No debe de mostrar el modal cuando está cerrado', ()=> {
            mockStore(false);
            render(<ModalDeleteExpenseLimit />);

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(screen.queryByText('¿Deseas Eliminar el Límite de gasto?')).not.toBeInTheDocument();
        });
    });

    describe('Cancelar', ()=> {
        test('Debe de cerrar el modal sin eliminar el límite', async()=> {
            const user = userEvent.setup();
            mockStore(true);
            render(<ModalDeleteExpenseLimit />);

            await user.click(await screen.findByRole('button', { name: 'Cancelar' }));

            expect(closeModalMock).toHaveBeenCalledTimes(1);
            expect(deleteGastoLimitAction).not.toHaveBeenCalled();
        });
    });

    describe('Eliminar', ()=> {
        test('Debe de eliminar el límite seleccionado, refrescar la página y cerrar el modal', async()=> {
            const user = userEvent.setup();
            mockStore(true);
            vi.mocked(deleteGastoLimitAction).mockResolvedValue({
                success: true,
                message: 'El límite de gasto se ha eliminado correctamente',
            });
            render(<ModalDeleteExpenseLimit />);

            await user.click(await screen.findByRole('button', { name: 'Si, Eliminar' }));

            await waitFor(()=> {
                expect(closeModalMock).toHaveBeenCalledTimes(1);
            });
            // Se elimina el límite que se guardó en el store al dar click en "Eliminar" del dropdown
            expect(deleteGastoLimitAction).toHaveBeenCalledTimes(1);
            expect(deleteGastoLimitAction).toHaveBeenCalledWith(expenseLimitId);
            expect(refreshMock).toHaveBeenCalledTimes(1);
            expect(toast.success).toHaveBeenCalledWith('El límite de gasto se ha eliminado correctamente');
            expect(toast.error).not.toHaveBeenCalled();
        });

        test('Debe de mostrar un error y mantener el modal abierto si no se pudo eliminar', async()=> {
            const user = userEvent.setup();
            mockStore(true);
            vi.mocked(deleteGastoLimitAction).mockResolvedValue({
                success: false,
                message: 'Error al eliminar el Limite de Gasto',
            });
            render(<ModalDeleteExpenseLimit />);

            await user.click(await screen.findByRole('button', { name: 'Si, Eliminar' }));

            await waitFor(()=> {
                expect(toast.error).toHaveBeenCalledWith('Error al eliminar el Limite de Gasto');
            });
            expect(toast.success).not.toHaveBeenCalled();
            expect(refreshMock).not.toHaveBeenCalled();
            expect(closeModalMock).not.toHaveBeenCalled();
        });
    });
});

import { useModalStore } from "@/src/shared/stores/modalStore";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import ModalExpenseLimits from "./ModalExpenseLimits";
import '@testing-library/jest-dom/vitest'

vi.mock('@/src/shared/stores/modalStore', ()=> ({
    useModalStore: vi.fn()
}));

describe('ModalExpenseLimits Test', ()=> {

    const closeModalMock = vi.fn();
    
    const mockStore = (isOpen: boolean) => { 
        vi.mocked(useModalStore).mockImplementation( 
            (selector: any) => selector({ 
                isOpen, 
                closeModal: closeModalMock
            })
        ) 
    };

    beforeEach(() => { vi.clearAllMocks() });

    test('Debe de abir el modal al dar click en openModal', async()=> {
        mockStore(true)
        render(<ModalExpenseLimits />);

        expect( await screen.findByRole('dialog') ).toBeInTheDocument();
        expect(screen.getByText('Establecer Límite de Gasto')).toBeInTheDocument();
        expect(screen.getByText('Define el presupuesto máximo para una categoría en el periodo seleccionado.')).toBeInTheDocument();
    });

    test('Debe de mostrar el formulario cuando el modal esta abierto', ()=> {
        mockStore(true)
        render(<ModalExpenseLimits />);

        expect(screen.getByTestId('label-category')).toBeInTheDocument();
        expect(screen.getByTestId('label-month')).toBeInTheDocument();
        expect(screen.getByTestId('label-year')).toBeInTheDocument();
    });

    test('Debe de llamar closeModal al pulsar el botón de cerrar', async()=> {
        const user = userEvent.setup();
        mockStore(true);
        render(<ModalExpenseLimits />);
        const btnCloseModal = screen.getByTestId('closeModalExpense');
        await user.click(btnCloseModal);

        expect(closeModalMock).toHaveBeenCalledTimes(1);
    });
});
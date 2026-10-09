import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import FormAddExpenseLimit from "./FormAddExpenseLimit";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { newExpenseLimitAction } from "../actions/gastosActions";
import toast from "react-hot-toast";

vi.mock('../actions/gastosActions', ()=> ({
    newExpenseLimitAction: vi.fn()
}));

vi.mock('react-hot-toast', () => ({ 
    default: { 
        success: vi.fn(), 
        error: vi.fn(), 
    }, 
}));

describe('FormAddExpenseLimit Test', ()=> {

    beforeEach(()=> {
        vi.clearAllMocks()
    });

    describe('Renderizado', ()=> {
        test('debe mostrar los campos del fomulario', ()=> {
            render(<FormAddExpenseLimit />);
            expect(screen.getByTestId('label-category')).toBeInTheDocument();
            expect(screen.getByTestId('label-limit')).toBeInTheDocument();
            expect(screen.getByTestId('label-month')).toBeInTheDocument();
            expect(screen.getByTestId('label-year')).toBeInTheDocument();
        });

        test('debe mostrar botón para enviar el formulario', ()=> {
            render(<FormAddExpenseLimit />);
            expect(screen.getByRole('button', { name: /agregar límite/i }));
        });
    });

    describe('Errores de validación', ()=> {
        test('Debe mostrar error de validación del campo category', async()=> {
            const user = userEvent.setup();
            render(<FormAddExpenseLimit />);
            const buttonSubmit = screen.getByRole('button', { name: /agregar límite/i });

            await user.click(buttonSubmit);
            expect(screen.findByText('La categoría es requerida.'));
        });

        test('Debe mostrar error de validación del campo category', async()=> {
            const user = userEvent.setup();
            render(<FormAddExpenseLimit />);
            const buttonSubmit = screen.getByRole('button', { name: /agregar límite/i });

            await user.click(buttonSubmit);
            expect(screen.findByText('El monto debe ser mayor a 0'));
        });
    });

    
    describe('Envío del formulario', ()=> {
        test('No debe de llamar al action si los datos no son válidos', async()=> {
            const user = userEvent.setup(); 
            render(<FormAddExpenseLimit />); 

            const buttonSubmit = screen.getByRole('button', { name: /agregar límite/i })
            await user.click( buttonSubmit ); 

            await waitFor(()=> {
                expect(newExpenseLimitAction).not.toHaveBeenCalled();
            });
        });

        test('debe llamar a newExpenseLimitAction al enviar el formulario', async()=> {
            const user = userEvent.setup();
            render(<FormAddExpenseLimit />);
            vi.mocked(newExpenseLimitAction).mockResolvedValue({
                success: true,
                message: 'El gasto se ha creado correctamente'
            });
            const inputCategory = screen.getByTestId('label-category');
            const inputLimit = screen.getByTestId('label-limit');
            const buttonSubmit = screen.getByRole('button', { name: /agregar límite/i });
    
            await user.selectOptions(inputCategory, 'restaurantes');
            await user.type(inputLimit, '250');
            await user.click(buttonSubmit);
    
            await waitFor(() => { expect( newExpenseLimitAction ).toHaveBeenCalledTimes(1) });
            expect( newExpenseLimitAction ).toHaveBeenCalledWith({ 
                category: 'restaurantes', 
                monto: 25000, 
                month: 10, 
                year: 2026, 
            });
        });

    });
    
    describe('Creación del límite del gasto', ()=> {
        test('Debe de mostrar un error si hubo un problema al crear el gasto', async()=> {
            const user = userEvent.setup();
            render(<FormAddExpenseLimit />);
            vi.mocked(newExpenseLimitAction).mockResolvedValue({
                success: false,
                message: 'No se pudo crear el límite'
            });
            const inputCategory = screen.getByTestId('label-category');
            const inputLimit = screen.getByTestId('label-limit');
            const buttonSubmit = screen.getByRole('button', { name: /agregar límite/i });
    
            await user.selectOptions(inputCategory, 'restaurantes');
            await user.type(inputLimit, '250000');
            await user.click(buttonSubmit);
    
            await waitFor(()=> {
                expect(toast.error).toHaveBeenCalledWith('No se pudo crear el límite');
            });
        });
    
        test('Debe crear el límite de gasto si los datos son válidos', async()=> {
            const user = userEvent.setup();
            render(<FormAddExpenseLimit />);
            vi.mocked(newExpenseLimitAction).mockResolvedValue({
                success: true,
                message: 'El gasto se ha creado correctamente'
            });
            const inputCategory = screen.getByTestId('label-category');
            const inputLimit = screen.getByTestId('label-limit');
            const buttonSubmit = screen.getByRole('button', { name: /agregar límite/i });
    
            await user.selectOptions(inputCategory, 'restaurantes');
            await user.type(inputLimit, '250000');
            await user.click(buttonSubmit);
    
            await waitFor(()=> {
                expect(toast.success).toHaveBeenCalledWith('El gasto se ha creado correctamente');
            });
        });

    });
});
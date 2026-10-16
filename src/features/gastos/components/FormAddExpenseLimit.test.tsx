import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import FormAddExpenseLimit from "./FormAddExpenseLimit";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { editGastoLimitAction, newExpenseLimitAction } from "../actions/gastosActions";
import toast from "react-hot-toast";
import { useExpenseLimit } from "@/src/shared/stores/useExpenseLimit";
import { SelectLimiteGasto } from "../types/types";

vi.mock('../actions/gastosActions', ()=> ({
    newExpenseLimitAction: vi.fn(),
    editGastoLimitAction: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Límite guardado en la base (monto en centavos)
const expenseLimit: SelectLimiteGasto = {
    id: 'limit-123',
    userId: 'user-1',
    category: 'restaurantes',
    monto: 345000,
    month: 3,
    year: 2027,
    createdAt: new Date('2027-03-01'),
};

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

describe('FormAddExpenseLimit Test', ()=> {

    beforeEach(()=> {
        vi.clearAllMocks();
        // Por defecto el formulario está en modo crear
        useExpenseLimit.setState({ expenseLimitToEdit: undefined });
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
            expect(screen.getByRole('button', { name: /agregar límite/i })).toBeInTheDocument();
        });

        test('debe iniciar vacío y con el mes y año actuales en modo crear', ()=> {
            render(<FormAddExpenseLimit />);
            expect(screen.getByTestId('label-category')).toHaveValue('');
            expect(screen.getByTestId('label-limit')).toHaveValue(null);
            expect(screen.getByTestId('label-month')).toHaveValue(String(currentMonth));
            expect(screen.getByTestId('label-year')).toHaveValue(currentYear);
        });
    });

    describe('Errores de validación', ()=> {
        test('Debe mostrar error de validación del campo category', async()=> {
            const user = userEvent.setup();
            render(<FormAddExpenseLimit />);
            const buttonSubmit = screen.getByRole('button', { name: /agregar límite/i });

            await user.click(buttonSubmit);
            expect(await screen.findByText('La categoría es requerida.')).toBeInTheDocument();
        });

        test('Debe mostrar error de validación si el campo monto está vacío', async()=> {
            const user = userEvent.setup();
            render(<FormAddExpenseLimit />);
            const buttonSubmit = screen.getByRole('button', { name: /agregar límite/i });

            await user.click(buttonSubmit);
            expect(await screen.findByText('Ingresa un monto válido')).toBeInTheDocument();
        });

        test('Debe mostrar error de validación si el monto es 0', async()=> {
            const user = userEvent.setup();
            render(<FormAddExpenseLimit />);
            const buttonSubmit = screen.getByRole('button', { name: /agregar límite/i });

            await user.type(screen.getByTestId('label-limit'), '0');
            await user.click(buttonSubmit);
            expect(await screen.findByText('El monto debe ser mayor a 0')).toBeInTheDocument();
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
                month: currentMonth,
                year: currentYear,
            });
            expect(editGastoLimitAction).not.toHaveBeenCalled();
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

    describe('Edición del límite del gasto', ()=> {
        beforeEach(()=> {
            useExpenseLimit.setState({ expenseLimitToEdit: expenseLimit });
        });

        test('Debe mostrar el formulario lleno con la información del límite seleccionado', ()=> {
            render(<FormAddExpenseLimit />);

            expect(screen.getByTestId('label-category')).toHaveValue('restaurantes');
            // El monto se guarda en centavos y se muestra en pesos
            expect(screen.getByTestId('label-limit')).toHaveValue(3450);
            expect(screen.getByTestId('label-month')).toHaveValue('3');
            expect(screen.getByTestId('label-year')).toHaveValue(2027);
            expect(screen.getByRole('button', { name: /editar límite/i })).toBeInTheDocument();
        });

        test('Debe actualizar el formulario si cambia el límite seleccionado', async()=> {
            render(<FormAddExpenseLimit />);
            expect(screen.getByTestId('label-category')).toHaveValue('restaurantes');

            useExpenseLimit.setState({ expenseLimitToEdit: { ...expenseLimit, category: 'transporte', monto: 99950 } });

            await waitFor(()=> {
                expect(screen.getByTestId('label-category')).toHaveValue('transporte');
            });
            expect(screen.getByTestId('label-limit')).toHaveValue(999.5);
        });

        test('Debe llamar a editGastoLimitAction con el id del límite y el monto en centavos', async()=> {
            const user = userEvent.setup();
            render(<FormAddExpenseLimit />);
            vi.mocked(editGastoLimitAction).mockResolvedValue({
                success: true,
                message: 'El límite de gasto se ha actualizado '
            });

            const inputLimit = screen.getByTestId('label-limit');
            await user.clear(inputLimit);
            await user.type(inputLimit, '5000');
            await user.click(screen.getByRole('button', { name: /editar límite/i }));

            await waitFor(()=> { expect(editGastoLimitAction).toHaveBeenCalledTimes(1) });
            expect(editGastoLimitAction).toHaveBeenCalledWith('limit-123', {
                category: 'restaurantes',
                monto: 500000,
                month: 3,
                year: 2027,
            });
            expect(newExpenseLimitAction).not.toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('El límite de gasto se ha actualizado ');
            // Al terminar vuelve a modo crear
            expect(useExpenseLimit.getState().expenseLimitToEdit).toBeUndefined();
        });

        test('Debe de mostrar un error si no se pudo editar el límite', async()=> {
            const user = userEvent.setup();
            render(<FormAddExpenseLimit />);
            vi.mocked(editGastoLimitAction).mockResolvedValue({
                success: false,
                message: 'El límite de gasto no se pudo actualizar '
            });

            await user.click(screen.getByRole('button', { name: /editar límite/i }));

            await waitFor(()=> {
                expect(toast.error).toHaveBeenCalledWith('El límite de gasto no se pudo actualizar ');
            });
            // Si falla, se mantiene el límite en edición para poder corregir y reintentar
            expect(useExpenseLimit.getState().expenseLimitToEdit).toEqual(expenseLimit);
        });
    });
});

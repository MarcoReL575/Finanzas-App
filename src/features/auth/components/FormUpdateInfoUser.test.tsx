import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import FormUpdateInfoUser from "./FormUpdateInfoUser";
import '@testing-library/jest-dom/vitest';
import { useRouter } from "next/navigation";
import { updatePasswordUserAction } from "../actions/signActions";
import toast from "react-hot-toast";

vi.mock('next/navigation', ()=> ({
    useRouter: vi.fn()
}));

vi.mock('../actions/signActions', ()=> ({
    updatePasswordUserAction: vi.fn()
}));

vi.mock('react-hot-toast', ()=> ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

describe('FormUpdateInfoUser Test', ()=> {  
    
    beforeEach(()=> {
        vi.clearAllMocks();
    });

    describe('Renderizar Formulario', ()=> {
        test('Se deben de renderizar los campos del formulario', async()=> {
            render(<FormUpdateInfoUser />);

            expect(screen.getByPlaceholderText('oldPassword')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('NewPassword')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('ConfirmPassword')).toBeInTheDocument();
        });

        test('Debe renderizar el botón de actualizar mi Perfil', ()=> {
            render(<FormUpdateInfoUser />);

            const submitButton = screen.getByRole('button', { name: /actualizar perfil/i });
            expect(submitButton).toBeInTheDocument();
        });
    });
    
    describe('Validaciones', ()=> {
        test('Debe de mostrar error de validación en el campo de old password', async()=> {
            const user = userEvent.setup();
            render(<FormUpdateInfoUser />);

            const inputOldPssw = screen.getByPlaceholderText('oldPassword');
            await user.type(inputOldPssw, 'oldPa');
            await user.tab();

            expect(await screen.findByText('El password no puede tener menos de 6 caracteres')).toBeInTheDocument();
        }); 

        test('Debe de mostrar error de validación en el campo de new password', async()=> {
            const user = userEvent.setup();
            render(<FormUpdateInfoUser />);

            const inputNewPssw = screen.getByPlaceholderText('NewPassword');
            await user.type(inputNewPssw, 'newPa');
            await user.tab();

            expect(await screen.findByText('El password no puede tener menos de 6 caracteres')).toBeInTheDocument();
        }); 

        test('Debe de mostrar error de validación en el campo de match password', async()=> {
            const user = userEvent.setup();
            render(<FormUpdateInfoUser />);

            const inputNewPssw = screen.getByPlaceholderText('NewPassword');
            const inputMatchPssw = screen.getByPlaceholderText('ConfirmPassword');
            await user.type(inputNewPssw, 'newPassword');
            await user.type(inputMatchPssw, 'newPasswor');
            await user.tab();

            expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument();
        }); 

        test('No debe llamar al action si no esta completo el formulario', async()=> {
            const user = userEvent.setup();
            render(<FormUpdateInfoUser />);

            const submitButton = screen.getByRole('button', { name: /actualizar perfil/i });
            await user.click(submitButton);

            await waitFor(()=> expect(updatePasswordUserAction).not.toHaveBeenCalled())
        });

        test('No debe llamar al action si las contraseñas no coinciden', async()=> {
            const user = userEvent.setup();
            render(<FormUpdateInfoUser />);

            const inputNewPssw = screen.getByPlaceholderText('NewPassword');
            const inputMatchPssw = screen.getByPlaceholderText('ConfirmPassword');
            const submitButton = screen.getByRole('button', { name: /actualizar perfil/i });
            await user.type(inputNewPssw, 'newPassword');
            await user.type(inputMatchPssw, 'newPasswor');
            await user.click(submitButton);

            await waitFor(()=> expect(updatePasswordUserAction).not.toHaveBeenCalled());
        });

    });

    describe('Envío de Formulario', ()=> {

        test('Debe de llamar a updatePasswordUserAction con los datos correctos', async()=> {
            const user = userEvent.setup();
            render(<FormUpdateInfoUser />);

            vi.mocked(updatePasswordUserAction).mockResolvedValue({
                success: true,
                message: 'La password se ha actualizado correctamente'
            });

            const inputCurrentPss = screen.getByPlaceholderText('oldPassword');
            const inputNewPssw = screen.getByPlaceholderText('NewPassword');
            const inputMatchPssw = screen.getByPlaceholderText('ConfirmPassword');
            const submitButton = screen.getByRole('button', { name: /actualizar perfil/i });
            await user.type(inputCurrentPss, 'oldPassword');
            await user.type(inputNewPssw, 'newPassword');
            await user.type(inputMatchPssw, 'newPassword');
            await user.click(submitButton);

            await waitFor(()=> {
                expect(updatePasswordUserAction).toHaveBeenCalledWith({
                    currentPassword: 'oldPassword',
                    newPassword: 'newPassword',
                    confirmPassword: 'newPassword'
                })
            });
        });

        test('Debe de mostrar un error si los datos no son válidos', async()=> {
            const user = userEvent.setup();
            render(<FormUpdateInfoUser />);

            vi.mocked(updatePasswordUserAction).mockResolvedValue({
                success: false,
                message: 'La contraseña actual es incorrecta'
            });

            const inputCurrentPss = screen.getByPlaceholderText('oldPassword');
            const inputNewPssw = screen.getByPlaceholderText('NewPassword');
            const inputMatchPssw = screen.getByPlaceholderText('ConfirmPassword');
            const submitButton = screen.getByRole('button', { name: /actualizar perfil/i });
            await user.type(inputCurrentPss, 'oldPassword');
            await user.type(inputNewPssw, 'newPassword');
            await user.type(inputMatchPssw, 'newPassword');
            await user.click(submitButton);

            await waitFor(()=> {
                expect(toast.error).toHaveBeenCalledWith('La contraseña actual es incorrecta');
            });
        });

        test('Debe mostrar mensaje de confirmación si los datos son válidos', async()=> {
            const user = userEvent.setup();
            render(<FormUpdateInfoUser />);

            vi.mocked(updatePasswordUserAction).mockResolvedValue({
                success: true,
                message: 'La password se ha actualizado correctamente'
            });

            const inputCurrentPss = screen.getByPlaceholderText('oldPassword');
            const inputNewPssw = screen.getByPlaceholderText('NewPassword');
            const inputMatchPssw = screen.getByPlaceholderText('ConfirmPassword');
            const submitButton = screen.getByRole('button', { name: /actualizar perfil/i });
            await user.type(inputCurrentPss, 'oldPassword');
            await user.type(inputNewPssw, 'newPassword');
            await user.type(inputMatchPssw, 'newPassword');
            await user.click(submitButton);

            await waitFor(()=> expect(toast.success).toHaveBeenCalledWith('La password se ha actualizado correctamente'));
        });
    });

    describe('Limpieza formulario', ()=> {
        test('Debe de limpiar el formulario si la contraseña se actualiza correctamente', async()=> {
            const user = userEvent.setup();
            render(<FormUpdateInfoUser />);

            vi.mocked(updatePasswordUserAction).mockResolvedValue({
                success: true,
                message: 'La password se ha actualizado correctamente'
            });

            const inputCurrentPss = screen.getByPlaceholderText('oldPassword');
            const inputNewPssw = screen.getByPlaceholderText('NewPassword');
            const inputMatchPssw = screen.getByPlaceholderText('ConfirmPassword');
            const submitButton = screen.getByRole('button', { name: /actualizar perfil/i });
            await user.type(inputCurrentPss, 'oldPassword');
            await user.type(inputNewPssw, 'newPassword');
            await user.type(inputMatchPssw, 'newPassword');
            await user.click(submitButton);

            await waitFor(()=> {
                expect(toast.success).toHaveBeenCalledWith('La password se ha actualizado correctamente');
                expect(inputCurrentPss).toHaveValue('');
                expect(inputNewPssw).toHaveValue('');
                expect(inputMatchPssw).toHaveValue('');
            });
        });
    });
});
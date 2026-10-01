import { beforeEach, describe, expect, test, vi } from "vitest";
import FormSignup from "./FormSignup";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/vitest';
import userEvent from "@testing-library/user-event";
import { signUpAction } from "../actions/signActions";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

vi.mock('../actions/signActions', ()=> ({
    signUpAction: vi.fn()
}));

vi.mock('react-hot-toast', ()=> ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('Form Signup Test', ()=> {

    beforeEach(()=> {
        vi.clearAllMocks();
    });

    describe('Render Form', ()=> {
        test('Debe de renderizar el formulario', ()=> {
            render(<FormSignup />);
    
            expect(screen.getByPlaceholderText('Usuario5756')).toBeInTheDocument();
            expect(screen.getByTestId('name')).toBeInTheDocument();
            expect(screen.getByTestId('confirmPassword')).toBeInTheDocument();
        });

        test('Debe de renderizar el link de iniciar sesión', ()=> {
            render(<FormSignup />);

            const link = screen.getByRole('link', { name: /inicia sesión aquí/i });

            expect(link).toBeInTheDocument();
        });
    });

    describe('Validación', ()=> {
        test('Debe mosrtar un error si el correo no es válido', async()=> {
            const user = userEvent.setup();
            render(<FormSignup />);

            const inputUsername = screen.getByTestId('email');
            await user.type(inputUsername, 'correotest');
            await user.tab();

            expect( await screen.findByText('Ingresa un email válido')).toBeInTheDocument();
        });

        test('Debe de mostrar error si el password es menor de 6 caracteres', async()=> {
            const user = userEvent.setup();
            render(<FormSignup />);

            const inputpassword = screen.getByTestId('password');
            await user.type(inputpassword, 'test1');
            await user.tab();

            expect(await screen.findByText('El password no puede tener menos de 6 caracteres')).toBeInTheDocument();
        });

        test('Debe de mosrtar error si las contraseñas no coinciden', async()=> {
            const user = userEvent.setup();
            render(<FormSignup />);

            const inputMatchPassw = screen.getByTestId('confirmPassword');
            await user.type(inputMatchPassw, 'passwTest');
            await user.tab();

            expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument();
        });

        test('No debe enviar el formulario vacío', async()=> {
            const user = userEvent.setup();
            render(<FormSignup />);

            const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
            await user.click(submitButton);
            
            expect(signUpAction).not.toHaveBeenCalled();

        });
    });

    describe('Envío del formulario', ()=> {    
        const mockData = {
            name: 'Marco',
            email: 'test@correo.com',
            password: 'testPass12',
            confirmPassword: 'testPass12'
        }

        test('Debe llamar signUpAction con los datos correctos', async()=> {
            const user = userEvent.setup();
            render(<FormSignup />);

            const inputUsername = screen.getByTestId('name');
            const inputEmail = screen.getByTestId('email');
            const inputpassword = screen.getByTestId('password');
            const inputMatchPassw = screen.getByTestId('confirmPassword');
            const sunmitButton = screen.getByRole('button', { name: /crear cuenta/i });
            await user.type(inputUsername, mockData.name);
            await user.type(inputEmail, mockData.email);
            await user.type(inputpassword, mockData.password);
            await user.type(inputMatchPassw, mockData.confirmPassword);
            await user.click(sunmitButton);

            await waitFor(()=> expect(signUpAction).toHaveBeenCalledTimes(1));
            expect(signUpAction).toHaveBeenCalledWith(mockData);
        });

        test('No debe llamar signUpActions si los datos son inválidos', async()=> {
            const user = userEvent.setup();
            render(<FormSignup />);

            const inputEmail = screen.getByTestId('email');
            const inputpassword = screen.getByTestId('password');
            await user.type(inputEmail, mockData.email);
            await user.type(inputpassword, mockData.password);

            await waitFor(()=> expect(inputEmail).toBeInTheDocument());
            expect(signUpAction).not.toHaveBeenCalled();
        });
    });

    describe('Crear cuenta', ()=> {
        const mockData = {
            name: 'Marco',
            email: 'test@correo.com',
            password: 'testPass12',
            confirmPassword: 'testPass12'
        }
        test('Debe de mostrar un error si el registro falla', async()=> {
            const user = userEvent.setup();
            render(<FormSignup />);

            vi.mocked(signUpAction).mockResolvedValue({
                success: false,
                message: 'Error al crear usuario'
            });

            const inputUsername = screen.getByTestId('name');
            const inputEmail = screen.getByTestId('email');
            const inputpassword = screen.getByTestId('password');
            const inputMatchPassw = screen.getByTestId('confirmPassword');
            const sunmitButton = screen.getByRole('button', { name: /crear cuenta/i });
            await user.type(inputUsername, mockData.name);
            await user.type(inputEmail, mockData.email);
            await user.type(inputpassword, mockData.password);
            await user.type(inputMatchPassw, mockData.confirmPassword);
            await user.click(sunmitButton);

            await waitFor(()=> {
                expect(toast.error).toHaveBeenCalledWith('Error al crear usuario');
            });
            expect(redirect).not.toHaveBeenCalled();
        });

        test('Debe mostrar un mensaje de bienvenida y redirigir al home si los datos son válidos', async()=> {
            const user = userEvent.setup();
            render(<FormSignup />);

            vi.mocked(signUpAction).mockResolvedValue({
                success: true,
                message: 'Bienvenido de nuevo Marco'
            });

            const inputUsername = screen.getByTestId('name');
            const inputEmail = screen.getByTestId('email');
            const inputpassword = screen.getByTestId('password');
            const inputMatchPassw = screen.getByTestId('confirmPassword');
            const sunmitButton = screen.getByRole('button', { name: /crear cuenta/i });
            await user.type(inputUsername, mockData.name);
            await user.type(inputEmail, mockData.email);
            await user.type(inputpassword, mockData.password);
            await user.type(inputMatchPassw, mockData.confirmPassword);
            await user.click(sunmitButton);

            await waitFor(()=> expect(redirect).toHaveBeenCalledWith('/home'));
            expect(toast.success).toHaveBeenCalledWith('Bienvenido de nuevo Marco');
        });
    });
});
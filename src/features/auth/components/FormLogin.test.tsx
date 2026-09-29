import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import { signInAction } from "../actions/signActions";
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/vitest';
import toast from 'react-hot-toast';
import { redirect } from "next/navigation";
import FormLogin from './FormLogin';

vi.mock('../actions/signActions', ()=> ({
    signInAction: vi.fn()
}));

vi.mock('react-hot-toast', ()=> ({
    default: {
        error: vi.fn(),
        success: vi.fn()
    },
}));

vi.mock('next/navigation', ()=> ({
    redirect: vi.fn()
}));

describe('FormLogin Test', ()=> {

    const mockedSignInAction = vi.mocked(signInAction);
    const mockedRedirect = vi.mocked(redirect);

    beforeEach(()=> {
        vi.clearAllMocks();
    });

    describe('Render Form', ()=> {
        test('debe de rederizar el formulario', ()=> {
            render(<FormLogin />);

            expect(screen.getByTestId('email')).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument();
        });

        test('Debe renderizar el link de signup', ()=> {
            render(<FormLogin />);

            const link = screen.getByRole('link', { name: 'Crea una aquí' });

            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', "/auth/signup");
        });
    });

    describe('Validation', ()=> {
        test('Debe mostrar error de validación si no se ingresa un email correcto', async()=> {
            const user = userEvent.setup();
            render(<FormLogin />);

            const emailInput = screen.getByTestId("email"); 
            await user.type( emailInput, "testcorreo"); 
            await user.tab(); 
            const errorMessage = await screen.findByText('Ingresa un email válido');

            expect(errorMessage).toBeInTheDocument(); 
            expect( mockedSignInAction ).not.toHaveBeenCalled();
        });

        test('Debe de mostrar un error de validación si no se ingresa un password mayor a 6 caracteres', async()=> {
            const user = userEvent.setup();
            render(<FormLogin />);

            screen.debug();
            const inputPassword = screen.getByTestId('password');
            await user.type(inputPassword, 'test1');
            await user.tab();
            const errorValidacion = screen.getByText('El password no puede tener menos de 6 caracteres');

            expect(errorValidacion).toBeInTheDocument();
            expect(mockedSignInAction).not.toHaveBeenCalled();
        });
    });

    describe('Submit Form', ()=>{
        test('Debe llamar a signInAction con las credenciales válidas', async()=> {
            const user = userEvent.setup();
            mockedSignInAction.mockResolvedValue({
                success: true,
                message: "Bienvenido de nuevo Marco"
            });
            render(<FormLogin />);

            const mockData = {
                email: 'Test@correo.com',
                password: 'Password123'
            };

            const emailInput = screen.getByTestId('email');
            const passwordInput = screen.getByTestId('password');
            const submit = screen.getByRole('button', { name: /iniciar sesión/i });
            await user.type(emailInput, 'Test@correo.com');
            await user.type(passwordInput, 'Password123');
            await user.click(submit);

            await waitFor(()=> {
                expect(mockedSignInAction).toHaveBeenCalledWith(mockData);
            });
        });

        test('No debe de llamar signInAction si las credenciales son inválidas', async()=> {
            const user = userEvent.setup();
            render(<FormLogin />);

            const emailInput = screen.getByTestId('email');
            const submit = screen.getByRole('button', { name: /iniciar sesión/i });
            await user.type(emailInput, 'Test@correo.com');
            await user.click(submit);

            await waitFor(()=> {
                expect(mockedSignInAction).not.toHaveBeenCalled();
            })
        });
    });

    describe('Login', ()=> {
        test('Debe mostrar mensaje de error si el inicio no fue exitoso', async()=> {
            const user = userEvent.setup();
            render(<FormLogin />);

            mockedSignInAction.mockResolvedValue({
                success: false,
                message: 'Error al iniciar sesión'
            });

            const emailInput = screen.getByTestId('email');
            const passwordInput = screen.getByTestId('password');
            const submit = screen.getByRole('button', { name: 'Iniciar Sesión' });
            await user.type(emailInput, 'test@correo.com');
            await user.type(passwordInput, 'PassInvalid');
            await user.click(submit);

            await waitFor(()=> {
                expect(toast.error).toHaveBeenCalledWith(('Error al iniciar sesión'));
                expect(mockedRedirect).not.toHaveBeenCalled();
            })
        });
        
        test('Debe mostrar mensaje de bienvenida si el inicio fue exitoso', async()=> {
            const user = userEvent.setup();
            render(<FormLogin />);

            mockedSignInAction.mockResolvedValue({
                success: true,
                message: 'Bienvenido Marco'
            });

            const emailInput = screen.getByTestId('email');
            const passwordInput = screen.getByTestId('password');
            const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
            await user.type(emailInput, 'Test@correo.com');
            await user.type(passwordInput, 'Password123');
            await user.click(submitButton);

            await waitFor(()=> {
                expect(toast.success).toHaveBeenCalledWith('Bienvenido Marco');
                expect(mockedRedirect).toHaveBeenCalledWith('/home');
            });
        });
    });
});
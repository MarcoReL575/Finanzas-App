import { beforeEach, expect, test, vi } from 'vitest'
import { describe } from 'vitest'
import { signService } from '../services/signService'
import { UserSession } from '@/src/lib/authServer'
import { signInAction, signUpAction, updatePasswordUserAction } from './signActions'

vi.mock('../services/signService', ()=> ({
    signService: {
        createUser: vi.fn(),
        signIn: vi.fn(),
        updatePasswordUser: vi.fn()
    }
}));

vi.mock('@/src/lib/authServer', ()=> ({
    UserSession: vi.fn()
}));

const mockedSignService = vi.mocked(signService);
const mockedUserSession = vi.mocked(UserSession);

describe('SignActions', ()=> {
    beforeEach(()=> {
        vi.clearAllMocks();
    });

    describe('signUpActions', ()=> {
        test('debería traer informacipon del usuario al llamar a signService.createUser', async()=> {
            const userInfo = {
                name: 'Marco',
                email: 'marco@test.com',
                password: 'Password123',
                confirmPassword: 'Password123'            
            };

            mockedSignService.createUser.mockResolvedValue({
                success: true,
                message: 'Usuario creado'
            });

            const result = await signUpAction(userInfo);

            expect(mockedSignService.createUser).toHaveBeenCalledWith(userInfo);
            expect(result).toEqual({
                success: true,
                message: 'Usuario creado'
            })
        });

        test('debería propagarse el mensaje de error del service', async()=> {
            const userInfo = {
                name: 'Marco',
                email: 'marco@test.com',
                password: 'Password123',
                confirmPassword: 'Password123'            
            };

            mockedSignService.createUser.mockResolvedValue({
                success: false,
                message: 'El correo ya existe'
            });

            const result = await signUpAction(userInfo);
            
            expect(mockedSignService.createUser).toHaveBeenCalledWith(userInfo);
            expect(result).toEqual({
                success: false,
                message: 'El correo ya existe'
            })
        })
    });

    describe('signInAction', ()=> {
       test('Debería iniciar la sesión del usuario', async()=> {
            const userInfo = {
                email: 'marco@test.com',
                password: 'Password123',
            };

            mockedSignService.signIn.mockResolvedValue({
                success: true,
                message: 'Sesión iniciada'
            });

            const result = await signInAction(userInfo);
            
            expect(mockedSignService.signIn).toHaveBeenCalledWith(userInfo);
            expect(result).toEqual({
                success: true,
                message: 'Sesión iniciada'
            })
       });
        
    });

    describe('updatePasswordUserAction', ()=> {
        test('Debería dar error si el usuario no esta autenticado', async()=> {
            mockedUserSession.mockResolvedValue(null);

            const data = {
                currentPassword: 'OldPassword123',
                newPassword: 'NewPassword123',
                confirmPassword: 'NewPassword123',
            };

            const result = await updatePasswordUserAction(data);

            expect(result).toEqual({
                success: false, 
                message: 'Ha ocurrido un problema'
            });

            expect(mockedSignService.updatePasswordUser).not.toHaveBeenCalled();
        });

        test('Debería dar error si la contraseña ingresada no es correta', async()=> {
            mockedUserSession.mockResolvedValue({
                user: {
                    id: 'user-1'
                }
            } as any);

            const data = {
                currentPassword: 'OldPassword123',
                newPassword: 'NewPassword123',
                confirmPassword: 'NewPassword123',
            };
            
            mockedSignService.updatePasswordUser.mockResolvedValue({
                success: false, 
                message: 'Ha ocurrido un problema'
            });

            const result = await updatePasswordUserAction(data);

            expect(mockedSignService.updatePasswordUser).toHaveBeenCalledWith(data);
            expect(result).toEqual({
                success: false, 
                message: 'Ha ocurrido un problema'
            });

        });

        test('Debería de actualizar correctamente la conraseña del usuario', async()=> {
            mockedUserSession.mockResolvedValue(
                {
                    user: {
                        id: 'user-1'
                    }
                } as any
            );

            const data = {
                currentPassword: 'OldPassword123',
                newPassword: 'NewPassword123',
                confirmPassword: 'NewPassword123',
            };

            mockedSignService.updatePasswordUser.mockResolvedValue({
                success: true,
                message: 'La contraseña se ha actualizado'
            })

            const result = await updatePasswordUserAction(data);

            expect(mockedSignService.updatePasswordUser).toHaveBeenCalledWith(data);
            expect(result).toEqual({
                success: true,
                message: 'La contraseña se ha actualizado'
            });
        });
    });
});
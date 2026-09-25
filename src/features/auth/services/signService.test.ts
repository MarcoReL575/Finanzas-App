import { describe, test, vi, beforeEach, expect } from "vitest";
import { SignService } from "./signService";
import { auth } from "@/src/lib/auth";
import { SignIn, UserAccount } from "../types/types";
import { ISignRepository, signRepository } from "./signRepository";
import { SignUpSchema } from "../schema/schema";
import { authClient } from "@/src/lib/auth-client";

vi.mock('@/src/lib/auth', ()=> ({
    auth: {
        api: {
            signUpEmail: vi.fn(),
            signInEmail: vi.fn(),
        },
    },
}));

vi.mock("@/src/lib/auth-client", () => ({
    authClient: {
        changePassword: vi.fn(),
    },
}));

vi.mock('../schema/schema', () => ({
    SignUpSchema: {
        safeParse: vi.fn(),
    },
}));

vi.mock('./signRepository', () => ({
  signRepository: {},
}));

describe('signService Testing', ()=> {
    let signRepositoryMock: ISignRepository;
    let signService: SignService;

    beforeEach(()=> {
        vi.clearAllMocks();
        signRepositoryMock = {
            selectUser: vi.fn()
        } as unknown as ISignRepository
        signService = new SignService(signRepositoryMock);
    });

    describe('Sign Up Testing', ()=> {
        const userInfo: UserAccount  = {
            name: 'Marco',
            email: 'marco@test.com',
            password: 'Password123',
            confirmPassword:'Password123'
        }
        
        test('Debería crear a un usuario exitosamente', async()=> {

            vi.mocked(auth.api.signUpEmail).mockResolvedValue({} as any);

            const result = await signService.signUp(userInfo);

            expect(auth.api.signUpEmail).toHaveBeenCalledWith({
                body: {
                    name: userInfo.name,
                    email: userInfo.email,
                    password: userInfo.password,
                }
            });

            expect(result).toEqual({
                success: true,
                message: `Usuario creado, !Bienvenido: ${userInfo.name}!`,
            });
            
        });

        test('Debería dar un error si falla la creación del usuario', async()=> {
            vi.mocked(auth.api.signUpEmail).mockRejectedValue(new Error('fallo'));

            const result = await signService.signUp(userInfo);

            expect(result).toEqual({
                success: false, 
                message: 'Error al crear usuario'
            })
        });

    });

    describe('SignIn Testing', ()=> {
        const userInfo: SignIn  = {
            email: 'marco@test.com',
            password: 'Password123',
        }

        test('Debería dar un error si el usuario no existe', async()=> {
            (signRepositoryMock.selectUser as any).mockResolvedValue(null);

            const result = await signService.signIn(userInfo);

            expect(signRepositoryMock.selectUser).toHaveBeenCalledWith(userInfo);
            expect(auth.api.signInEmail).not.toHaveBeenCalled();
            expect(result).toEqual({
                success: false, 
                message: 'El usuario no existe'
            });
        });

        test('Debería iniciar sesión si el usuario existe', async()=> {
            (signRepositoryMock.selectUser as any).mockResolvedValue({
                name: "Marco Reyes",
                email: userInfo.email,
            });
            vi.mocked(auth.api.signInEmail).mockResolvedValue({} as any);

            const result = await signService.signIn(userInfo);

            expect(signRepositoryMock.selectUser).toHaveBeenCalledWith(userInfo);
            expect(auth.api.signInEmail).toHaveBeenCalledWith({
                body: {
                    email: userInfo.email,
                    password: userInfo.password,
                },
                asResponse: true
            })
            
            expect(result).toEqual({
                success: true, 
                message: 'Bienvenido de nuevo Marco Reyes'
            });
        });

    });
    
    describe('Create User Test', ()=> {
        const userInfo = {
            name: 'Marco',
            email: 'marco@test.com',
            password: 'Password123',
            confirmPassword: 'Password123',
        }

        test('Debe dar un error si los datos no son válidos', async()=> {
            vi.mocked(SignUpSchema.safeParse as any).mockReturnValue({
                success: false, 
                error: 'datos inválidos'
            })
            
            const result = await signService.createUser(userInfo);
            
            expect(result).toEqual({
                success: false,
                message: 'Error en la validación de los datos, intente de nuevo'
            });
        }); 

        test('Debería de crear al usuario si la información es correcta', async()=> {
            vi.mocked(SignUpSchema.safeParse as any).mockReturnValue({
                success: true, 
                data: userInfo
            });

            const signUpSpy = vi
                .spyOn(signService, "signUp")
                .mockResolvedValue({ success: true, message: "ok" });

            const result = await signService.createUser(userInfo);

            expect(signUpSpy).toHaveBeenCalledWith(userInfo);
            expect(result).toEqual({
                success: true, 
                message: "ok"
            })
        });

        test('Debería capturar errores inesperados durante la creación', async()=> {

            vi.mocked(SignUpSchema.safeParse).mockReturnValue({
                success: true, 
                data: userInfo
            });

            const signUpSpy = vi
                .spyOn(signService, "signUp")
                .mockRejectedValue(new Error('fallo'));

            const result = await signService.createUser(userInfo);

            expect(result).toEqual({
                success: false, 
                message: 'Error al crear usuario'
            })
        });
    });

    describe('Update Password User Test', ()=> {
        const infoUser = {
            currentPassword: 'OldPassword123',
            newPassword: 'NewPassword123',
            confirmPassword: 'NewPassword123'
        }

        test('Debe de actualizar la contraseña', async()=> {
            vi.mocked(authClient.changePassword).mockResolvedValue(undefined);
            const result = await signService.updatePasswordUser(infoUser);

            expect(authClient.changePassword).toHaveBeenCalledWith({
                currentPassword: infoUser.currentPassword,
                newPassword: infoUser.newPassword,
                revokeOtherSessions: true,
            });
            expect(result).toEqual({
                success: true, 
                message: 'La contraseña se ha actualizado'
            });
        });

        test('Debería de capturar los errores inesperados', async()=> {
            vi.mocked(authClient.changePassword).mockRejectedValue(new Error('fallo'));

            const result = await signService.updatePasswordUser(infoUser);

            expect(result).toEqual({
                success: false, 
                message: 'Ha ocurrido un problema'
            });
        });
    });
});
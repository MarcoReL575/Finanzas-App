import { SignIn, UpdatePasswordUser, UserAccount } from "../types/types";
import { ISignRepository, signRepository } from "./signRepository";
import { SignUpSchema } from "../schema/schema";
import { auth } from "@/src/lib/auth";
import { authClient } from "@/src/lib/auth-client";

class SignService {
    constructor (
        private signRepository: ISignRepository
    ) {}

    async signUp(userInfo: UserAccount) {
        try {
            await auth.api.signUpEmail({
                body: {
                    name: userInfo.name,
                    email: userInfo.email,
                    password: userInfo.password,
                },
            })
           return { success: true, message: `Usuario creado, !Bienvenido: ${userInfo.name}!`}
        } catch (error) {
            console.log(error)
            return { success: false, message: 'Error al crear usuario'}
        }
    }

    async signIn(userInfo: SignIn) {
        const { password, email } = userInfo;
        const userExists = await this.signRepository.selectUser(userInfo);
        if(!userExists) return { success: false, message: 'El usuario no existe' }

        try {
            await auth.api.signInEmail({
                body: {
                    email,
                    password
                },
                asResponse: true
            })
            return { success: true, message: `Bienvenido de nuevo ${(await userExists).name}`}
        } catch (error) {
            return { success: false, message: 'Error al iniciar sesión' }
        }
    }

    async createUser(userInfo: UserAccount) {
        
        const response = SignUpSchema.safeParse(userInfo);
        if(!response.success) return { success: false, message: 'Error en la validación de los datos, intente de nuevo'}
        try {
            return await this.signUp(response.data);
        } catch (error) {   
            console.error(error)
            return { success: false, message: 'Error al crear usuario'}
        }
    }

    async updatePasswordUser(data: UpdatePasswordUser) {
        const { currentPassword, newPassword, confirmPassword } = data
        try {
            await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            })
            return { success: true, message: 'La contraseña se ha actualizado' }  
        } catch (error) {
            return { success: false, message: 'Ha ocurrido un problema' }  
            
        }
    }
}

export const signService = new SignService(signRepository);
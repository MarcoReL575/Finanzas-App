import { UserAccount, UserInsert } from "../types/types";
import { ISignRepository, signRepository } from "./signRepository";
import { insertUserSchema, SignUpSchema } from "../schema/schema";
import { auth } from "@/src/lib/auth";

class SignService {
    constructor (
        private signRepository: ISignRepository
    ) {}

    async signUp(userInfo: UserAccount) {
        console.log(userInfo)
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
}

export const signService = new SignService(signRepository);
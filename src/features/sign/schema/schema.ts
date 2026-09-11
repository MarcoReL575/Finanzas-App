import z, { minLength } from "zod";

export const SignUpSchema = z.object({
    user: z.string().min(1, {message: 'El usuario no puede ir vacío'}),
    correo: z.string().min(1, {message: 'El correo no puede ir vacío'}),
    password: z.string().min(6, {message: 'El password no puede tener menos de 6 caracteres'}),
    confirmPassword: z.string()
}).refine((data)=> data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ["confirmPassword"]
})

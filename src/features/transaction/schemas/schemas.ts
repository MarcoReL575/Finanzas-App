import z from "zod";

export const NewTransactionSchema = z.object({
    monto: z.string().min(0, { message: 'El monto no puede ser menor de 0' }),
    categoria: z.string().min(2, { message: 'Selecciona una categoría '}),
    descripcion: z.string().optional(),
    fecha: z.date()
})


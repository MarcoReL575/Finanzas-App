import z from "zod";

export const NewTransactionSchema = z.object({
    tipo: z.enum(['gasto', 'ingreso'], { message:  'Debes de seleccionar un tipo de transacción' }),
    monto: z.string().min(0, { message: 'El monto no puede ser menor de 0' }),
    categoria: z.string().min(2, { message: 'Selecciona una categoría '}),
    descripcion: z.string().min(6, { message: 'Debes de agregar una descripción' }),
    fecha: z.string().min(1, { message: 'Debes de seleccionar la fecha' })
});

export type NewTransaction = z.infer<typeof NewTransactionSchema>


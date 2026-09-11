'use client'

import FormComponent from '@/src/components/form/Form'
import { FormInput } from '@/src/components/form/FormInput'
import { FormLabel } from '@/src/components/form/FormLabel'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { NewTransactionSchema } from '../schemas/schemas'

export default function FormTransaction() {

    const { register, formState: { errors } } = useForm({
        resolver: zodResolver(NewTransactionSchema),
        mode: 'onBlur'
    })

  return (
   <FormComponent className='flex flex-col border border-gray-400 p-4 rounded-lg max-w-xl'>
        <FormLabel>Monto</FormLabel>
        <FormInput type='number' min={0} placeholder='$500'  />

        <FormLabel>Categoría</FormLabel>
        <select name="" id="" className='border border-black rounded-lg p-2'>
            <option value="">--Selecciona una categoría--</option>
        </select>

        <FormLabel>Descripción</FormLabel>
        <textarea className='border border-black rounded-lg p-2' rows={3} placeholder='Compra de videojuego en MercadoLibre' />

        <FormLabel>Fecha</FormLabel>
        <FormInput type='date' />
    </FormComponent>
  )
}

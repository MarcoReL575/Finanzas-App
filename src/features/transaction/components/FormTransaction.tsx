'use client'

import { redirect } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TabGroup, TabList, Tab } from '@headlessui/react'
import clsx from 'clsx'
import { insertTransactionSchema } from '../schemas/schemas'
import { listaGastos } from '@/src/category'
import { InsertTransaction } from '../types/types'
import { createTransactionAction } from '../actions/transactionActions'
import { FormError, FormComponent, FormInput, FormLabel, FormSubmit } from '@/src/components/form'

export default function FormTransaction() {
    const [selectedTab, setSelectedTab] = useState(0);
    
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<InsertTransaction>({
        resolver: zodResolver(insertTransactionSchema),
        mode: 'onBlur',
        defaultValues: {
            tipo: 'gasto',
            monto: '',
            createdAt: new Date(),
            categoria: '',
            descripcion: '',
        }
    });

    const currentType = watch('tipo');

    const handleTabChange = (index: number)=> {
        setSelectedTab(index);
        const tipo = index === 0 ? 'gasto' : 'ingreso';
        setValue('tipo', tipo )
        setValue('categoria', '')
    };

    const handleCreateTransaction = async(transaction: InsertTransaction)=> {
        console.log(transaction)
        const { success, message } = await createTransactionAction(transaction);
        if(!success) {
            toast.error(message);
        }
        if(success) {
            toast.success(message);
            redirect('/home');
        }
    }

    return (
        <TabGroup selectedIndex={selectedTab} onChange={handleTabChange}>
            <TabList className='flex w-full justify-around bg-gray-200 rounded-lg '>
                <Tab className='w-1/2 data-selected:bg-red-500 data-selected:text-white px-4 py-2 rounded-lg'>Gasto</Tab>
                <Tab className='w-1/2 data-selected:bg-green-500 data-selected:text-white px-4 py-2 rounded-lg'>Ingreso</Tab>
            </TabList>

            <FormComponent 
                className='flex flex-col border border-gray-400 p-4 rounded-lg w-md'
                onSubmit={handleSubmit(handleCreateTransaction)}
            >
                <FormLabel>Monto</FormLabel>
                <FormInput {...register('monto')} type='number' min={0} placeholder='$500' />
                {errors.monto && <FormError>{errors.monto.message}</FormError>}

                <FormLabel>Categoría</FormLabel>
                <select {...register('categoria')} className='border border-black rounded-lg p-2'>
                    <option value="">--Selecciona una categoría--</option>
                    {
                        listaGastos.map((category)=> (
                            <option key={category.id} value={category.value}>
                                {category.nombre}
                            </option>
                        ))
                    }
                </select>
                {errors.categoria && <FormError>{errors.categoria.message}</FormError>}

                <FormLabel>Descripción</FormLabel>
                <textarea {...register('descripcion')} className='border border-black rounded-lg p-2' rows={3} placeholder='Compra de videojuego en MercadoLibre' />
                {errors.descripcion && <FormError>{errors.descripcion.message}</FormError>}

                <FormLabel>Fecha</FormLabel>
                <FormInput {...register('createdAt')} type='date' />
                {errors.createdAt && <FormError>{errors.createdAt.message}</FormError>}

                <FormSubmit className={clsx('', 
                    currentType === 'gasto' && 'bg-red-500 hover:bg-red-400',
                    currentType === 'ingreso' && 'bg-green-500 hover:bg-green-400'
                )}>
                    { currentType === 'gasto' 
                        ? 'Agregar Gato'
                        : 'Añadir Ingreso'
                    }
                </FormSubmit>
            </FormComponent>            
        </TabGroup>
    )
}

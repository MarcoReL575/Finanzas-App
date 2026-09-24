'use client'

import { FormComponent, FormError, FormInput, FormLabel, FormSubmit } from "@/src/shared/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { listaGastos } from "@/src/category";
import { MONTHS } from "@/src/months";
import { IconCheck } from "@tabler/icons-react";
import { budgetSchema } from "../schemas/schema";
import { BudgetFormValues } from "../types/types";
import { newExpenseLimitAction } from "../actions/gastosActions";
import toast from "react-hot-toast";
import { useModalStore } from "@/src/shared/stores/modalStore";

export default function FormAddExpenseLimit() {

    const closeModal = useModalStore((state)=> state.closeModal);

    const { register, formState: { errors }, handleSubmit } = useForm({
        resolver: zodResolver(budgetSchema),
        mode: 'onBlur',
        defaultValues: {
            monto: undefined,
            category: '',
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
        }
    });

    const handleCreateLimitExpense = async(data: BudgetFormValues)=> {
        const montoEnCentavos = Math.round(data.monto * 100);
        const newData = {
            ...data,
            monto: montoEnCentavos
        }
        const { success, message } = await newExpenseLimitAction(newData);
        if(!success) {
            toast.error(message);
        }
        if(success) {
            toast.success(message);
            closeModal();
        }
    }

  return (
    <FormComponent className="flex flex-col" onSubmit={handleSubmit(handleCreateLimitExpense, (errors)=>console.log(errors))}>

        <FormLabel>Agrega una categoría</FormLabel>
        <select 
            {...register('category')}
            className="w-full border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
        >
            <option value="">Selecciona una categoría</option>
            {
                listaGastos.map((category)=> (
                    <option key={category.id} value={category.value}>
                        {category.label}
                    </option>
                ))
            }
        </select>
        {errors.category && <FormError>{errors.category.message}</FormError>}

        <FormLabel>Agrega la cantidad límite</FormLabel>
        <FormInput {...register('monto')} type="number" step='0.01' placeholder="0.00" />
        {errors.monto && <FormError>{errors.monto.message}</FormError>}

        <FormLabel>Selecciona el mes</FormLabel>
        <select
            {...register('month', { valueAsNumber: true })}
            className="w-full border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
          >
            {MONTHS.map((monthName, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {monthName}
              </option>
            ))}
        </select>
        {errors.month && <FormError>{errors.month.message}</FormError>}

        <FormLabel>Selecciona un año</FormLabel>
        <FormInput
            {...register('year', { valueAsNumber: true })}
            type="number"
            placeholder="Ej: 2026"
        />
        {errors.year && <FormError>{errors.year.message}</FormError>}

        <FormSubmit>
            <IconCheck />
            Agregar Límite
        </FormSubmit>
    </FormComponent>
  )
}

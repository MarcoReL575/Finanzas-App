'use client'

import { FormComponent, FormError, FormInput, FormLabel, FormSubmit } from "@/src/shared/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { listaGastos } from "@/src/category";
import { MONTHS } from "@/src/months";
import { IconCheck } from "@tabler/icons-react";
import { budgetSchema } from "../schemas/schema";
import { BudgetFormValues } from "../types/types";
import { editGastoLimitAction, newExpenseLimitAction } from "../actions/gastosActions";
import toast from "react-hot-toast";
import { useModalStore } from "@/src/shared/stores/modalStore";
import { useExpenseLimit } from "@/src/shared/stores/useExpenseLimit";
import { useRouter } from "next/navigation";

export default function FormAddExpenseLimit() {

    const closeModal = useModalStore((state)=> state.closeModal);
    const expenseLimitToEdit = useExpenseLimit((state)=> state.expenseLimitToEdit);
    const setExpenseLimitToEdit = useExpenseLimit((state)=> state.setExpenseLimitToEdit);
    const isEditing = Boolean(expenseLimitToEdit?.id);
    const router = useRouter();

    // Valores del formulario: los del límite a editar o valores vacíos para crear uno nuevo.
    // Se usa `values` (y no solo defaultValues) para que el formulario se actualice si cambia el límite seleccionado
    const formValues = useMemo(()=> ({
        // El monto se guarda en centavos, en el formulario se muestra en pesos
        monto: expenseLimitToEdit ? expenseLimitToEdit.monto / 100 : undefined,
        category: expenseLimitToEdit?.category ?? '',
        month: expenseLimitToEdit?.month ?? new Date().getMonth() + 1,
        year: expenseLimitToEdit?.year ?? new Date().getFullYear(),
    }), [expenseLimitToEdit]);

    const { register, formState: { errors }, handleSubmit } = useForm({
        resolver: zodResolver(budgetSchema),
        mode: 'onBlur',
        values: formValues,
    });

    const handleCreateLimitExpense = async(data: BudgetFormValues)=> {
        const montoEnCentavos = Math.round(data.monto * 100);
        const newData = {
            ...data,
            monto: montoEnCentavos
        }

        const { success, message } = isEditing
            ? await editGastoLimitAction(expenseLimitToEdit!.id, newData)
            : await newExpenseLimitAction(newData);

        if(!success) {
            toast.error(message);
            return;
        }

        router.refresh();
        toast.success(message);
        setExpenseLimitToEdit(undefined);
        closeModal();
    }

  return (
    <FormComponent className="flex flex-col" onSubmit={handleSubmit(handleCreateLimitExpense, (errors)=>console.log(errors))}>

        <FormLabel>Agrega una categoría</FormLabel>
        <select 
            {...register('category')}
            data-testid='label-category'
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
        <FormInput {...register('monto')} type="number" step='0.01' placeholder="0.00" data-testid='label-limit' />
        {errors.monto && <FormError>{errors.monto.message}</FormError>}

        <FormLabel>Selecciona el mes</FormLabel>
        <select
            {...register('month', { valueAsNumber: true })}
            data-testid='label-month'
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
             data-testid='label-year'
            placeholder="Ej: 2026"
        />
        {errors.year && <FormError>{errors.year.message}</FormError>}

        <FormSubmit>
            <IconCheck />
            {isEditing ? 'Editar Límite' : 'Agregar Límite'}
        </FormSubmit>
    </FormComponent>
  )
}

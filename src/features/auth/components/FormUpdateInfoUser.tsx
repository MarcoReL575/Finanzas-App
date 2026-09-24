'use client'

import { authClient } from '@/src/lib/auth-client'
import { FormComponent, FormError, FormInput, FormLabel, FormSubmit } from '@/src/shared/components/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { UpdatePasswordUserSchema } from '../schema/schema'
import { UpdatePasswordUser } from '../types/types'
import { updatePasswordUserAction } from '../actions/signActions'
import { redirect, useRouter } from 'next/navigation'

export default function FormUpdateInfoUser() {

    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, setValues } = useForm<UpdatePasswordUser>({
        resolver: zodResolver(UpdatePasswordUserSchema),
        mode: 'onBlur',
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        }
    });

    const handleUpdateUserInfo = async(data: UpdatePasswordUser) => {
       const { success, message } = await updatePasswordUserAction(data);

       if(!success) {
            toast.error(message);
        }

       if(success) {
            setValues({
                newPassword: '',
                currentPassword: '',
                confirmPassword: ''
            });
            toast.success(message);
            router.push('/perfil');
        }
    }

  return (
    <FormComponent 
        className='flex flex-col max-w-xl border p-4 rounded-lg'
        onSubmit={handleSubmit(handleUpdateUserInfo)}
    >
        <FormLabel>Contraseña actual</FormLabel>
        <FormInput {...register('currentPassword')} type='password' placeholder='Usuario' />
        {errors.currentPassword && <FormError>{errors.currentPassword.message}</FormError>}

        <FormLabel>Nueva Contraseña</FormLabel>
        <FormInput {...register('newPassword')} type='password' placeholder='Usuario' />
        {errors.newPassword && <FormError>{errors.newPassword.message}</FormError>}

        <FormLabel>Confirma tu contraseña</FormLabel>
        <FormInput {...register('confirmPassword')} type='password' placeholder='Usuario' />
        {errors.confirmPassword && <FormError>{errors.confirmPassword.message}</FormError>}

        <FormSubmit>
            Actualizar Perfil
        </FormSubmit>
    </FormComponent>
  )
}

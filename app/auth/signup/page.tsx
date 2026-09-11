'use client'

import FormComponent from '@/src/components/form/Form'
import { FormError } from '@/src/components/form/FormError'
import { FormInput } from '@/src/components/form/FormInput'
import { FormLabel } from '@/src/components/form/FormLabel'
import { FormSubmit } from '@/src/components/form/FormSubmit'
import { SignUpSchema } from '@/src/features/sign/schema/schema'
import { UserAccount } from '@/src/features/sign/types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCircleCheck } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'

export default function SignUpPage() {

    const { register, formState: { errors }, handleSubmit, watch } = useForm<UserAccount>({
        resolver: zodResolver(SignUpSchema),
        mode: 'onBlur'
    });

    const handleSignUp = async(userInfo: UserAccount)=> {
        console.log(userInfo);
    }

  return (
    <FormComponent className='flex flex-col max-w-lg border rounded-lg p-8' onSubmit={handleSubmit(handleSignUp)}>
        <FormLabel>Nombre de usuario</FormLabel>
        <FormInput { ...register('user') } type='text' placeholder='Usuario5756' />
        {errors.user && <FormError>{errors.user.message}</FormError>}

        <FormLabel>Correo</FormLabel>
        <FormInput { ...register('correo') } type='text' placeholder='correo@correo.com' />
        {errors.correo && <FormError>{errors.correo.message}</FormError>}

        <FormLabel>Password</FormLabel>
        <FormInput { ...register('password') } type='text' placeholder='Pa$$owd&' />
        {errors.password && <FormError>{errors.password.message}</FormError>}

        <FormLabel>Confirma tu password</FormLabel>
        <FormInput { ...register('confirmPassword') } type='text' placeholder='Pa$$owd&' />
        {errors.confirmPassword && <FormError>{errors.confirmPassword.message}</FormError>}

        <FormSubmit>
            <IconCircleCheck />
            Crear cuenta
        </FormSubmit>
    </FormComponent>
  )
}

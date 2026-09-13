'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCircleCheck } from '@tabler/icons-react'
import FormComponent from '@/src/shared/components/form/Form'
import { FormError } from '@/src/shared/components/form/FormError'
import { FormInput } from '@/src/shared/components/form/FormInput'
import { FormLabel } from '@/src/shared/components/form/FormLabel'
import { FormSubmit } from '@/src/shared/components/form/FormSubmit'
import { SignUpSchema } from '@/src/features/auth/schema/schema'
import { UserAccount } from '@/src/features/auth/types/types'
import { signUpAction } from '../actions/signActions'
import toast from 'react-hot-toast'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function FormSignup() {

  const { register, formState: { errors }, handleSubmit, watch } = useForm<UserAccount>({
    resolver: zodResolver(SignUpSchema),
    mode: 'onBlur'
  });

  const handleSignUp = async(userInfo: UserAccount)=> {
    const { success, message } = await signUpAction(userInfo);
    if(!success) {
      toast.error(message)
    }

    if(success) {
      toast.success(message);
      redirect('/home');
    }
  }

  return (
    <FormComponent className='flex flex-col max-w-md border rounded-lg p-8' onSubmit={handleSubmit(handleSignUp)}>
      <FormLabel>Nombre de usuario</FormLabel>
      <FormInput { ...register('name') } type='text' placeholder='Usuario5756' />
      {errors.name && <FormError>{errors.name.message}</FormError>}

      <FormLabel>Correo</FormLabel>
      <FormInput { ...register('email') } type='text' placeholder='correo@correo.com' />
      {errors.email && <FormError>{errors.email.message}</FormError>}

      <FormLabel>Password</FormLabel>
      <FormInput { ...register('password') } type='password' placeholder='Pa$$owd&' />
      {errors.password && <FormError>{errors.password.message}</FormError>}

      <FormLabel>Confirma tu password</FormLabel>
      <FormInput { ...register('confirmPassword') } type='password' placeholder='Pa$$owd&' />
      {errors.confirmPassword && <FormError>{errors.confirmPassword.message}</FormError>}

      <FormSubmit>
        <IconCircleCheck />
        Crear cuenta
      </FormSubmit>
      <section className='w-full text-sm flex items-center justify-center gap-x-4'>
        <p>Ya tienes una cuenta</p>
        <Link
          className = 'underline font-semibold'
          href={'/auth/signin'}
        >
          Inicia sesión aquí
        </Link>
      </section>
    </FormComponent>
  )
}

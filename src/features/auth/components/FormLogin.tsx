'use client'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { IconLogin } from '@tabler/icons-react'
import { SignIn } from '../types/types'
import { signInAction } from '../actions/signActions'
import { FormComponent, FormError, FormInput, FormLabel, FormSubmit } from '@/src/shared/components/form'
import { SignInSchema } from '../schema/schema'

export default function FormLogin() {

    const { handleSubmit, register, formState: { errors } } = useForm<SignIn>({
        resolver: zodResolver(SignInSchema),
        mode: 'onBlur'
    })

    const handleSignin = async(infoUser: SignIn)=> {
        const { success, message } = await signInAction(infoUser);
        if(!success) {
            toast.error(message);
        }
        if(success) {
            toast.success(message);
            redirect('/home');
        }
    }

  return (
    <FormComponent className='flex flex-col max-w-md border rounded-lg p-8' onSubmit={handleSubmit(handleSignin)}>
      <FormLabel>Ingresa tu email</FormLabel>
      <FormInput { ...register('email') } id='email' data-testid='email' type='text' placeholder='Usuario5756' />
      {errors.email && <FormError>{errors.email.message}</FormError>}

      <FormLabel>Ingresa tu password</FormLabel>
      <FormInput { ...register('password') } id='password' data-testid='password' type='password' placeholder='Pa$$owd&' />
      {errors.password && <FormError>{errors.password.message}</FormError>}

      <FormSubmit>
        <IconLogin />
        Iniciar Sesión
      </FormSubmit>
      <section className='w-full text-sm flex items-center justify-center gap-x-4'>
        <p>Aún no tienes una cuenta</p>
        <Link
          className = 'underline text'
          href={'/auth/signup'}
        >
          Crea una aquí
        </Link>
      </section>
    </FormComponent>
  )
}

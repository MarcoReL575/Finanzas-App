'use client'

import FormComponent from '@/src/components/form/Form'
import { FormError } from '@/src/components/form/FormError'
import { FormInput } from '@/src/components/form/FormInput'
import { FormLabel } from '@/src/components/form/FormLabel'
import { FormSubmit } from '@/src/components/form/FormSubmit'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconLogin } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { SignInSchema } from '../schema/schema'
import { SignIn } from '../types/types'
import { signInAction } from '../actions/signActions'
import toast from 'react-hot-toast'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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
      <FormInput { ...register('email') } type='text' placeholder='Usuario5756' />
      {errors.email && <FormError>{errors.email.message}</FormError>}

      <FormLabel>Ingresa tu password</FormLabel>
      <FormInput { ...register('password') } type='password' placeholder='Pa$$owd&' />
      {errors.password && <FormError>{errors.password.message}</FormError>}

      <FormSubmit>
        <IconLogin />
        Iniciar Sesion
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

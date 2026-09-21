import ButtonExpenseLimit from '@/src/features/gastos/components/ButtonExpenseLimit'
import ButtonAddTransaction from '@/src/shared/components/ButtonAddTransaction'
import { Button } from '@/src/shared/ui/button'
import React from 'react'

export default function GastosPage() {
  return (
    <section className='space-y-10'>
      <ButtonExpenseLimit />
      <h1 className='text-4xl font-semibold text-center'>Agrega y da seguimiento a tus gastos</h1>
    </section>
  )
}

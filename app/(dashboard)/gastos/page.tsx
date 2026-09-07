import ButtonAddTransaction from '@/src/components/ButtonAddTransaction'
import React from 'react'

export default function GastosPage() {
  return (
    <section className='flex items-center justify-between'>
        <h1>Agrega y da seguimiento a tus gastos</h1>
        <ButtonAddTransaction />
    </section>
  )
}

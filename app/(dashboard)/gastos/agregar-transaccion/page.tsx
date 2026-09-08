import FormTransaction from '@/src/features/transaction/components/FormTransaction'

export default function AddTransactionPage() {
  return (
    <>
        <h1 className='text-3xl text-center font-semibold'>Agrega gastos y lleva un control de tus Finanzas</h1>
        <FormTransaction />
    </>
  )
}

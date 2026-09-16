import ButtonAddTransaction from '@/src/features/transaction/components/ButtonAddTransaction'
import GridTransactions from '@/src/features/transaction/components/GridTransactions'
import { transactionService } from '@/src/features/transaction/services/serviceTransaction'
import { UserSession } from '@/src/lib/authServer'
import { redirect } from 'next/navigation'
import { FilterMyDatePicker } from '../../../src/features/transaction/components/FilterMyDatePicker'
import FilerSelectTransaction from '@/src/features/transaction/components/FilerSelectTransaction'
import FilterCategories from '@/src/features/transaction/components/FilterCategories'
import FilterReset from '@/src/features/transaction/components/FilterReset'

export default async function HomePage() {

  const session = await UserSession();
  if(!session?.user.id) redirect('/auth/signin');

  const { transactions } = await transactionService.getTransactionsByUser(session.user.id);


  return (
    <section className='flex flex-col w-full space-y-4 max-w-6xl mx-auto'>
      <ButtonAddTransaction />
      <h2 className='text-xl font-semibold'>Lista de Transacciones</h2>
      <div className='flex items-center justify-around max-w-2xl mx-auto gap-x-4'>
        <FilterMyDatePicker />
        <FilerSelectTransaction />
        <FilterCategories />
        <FilterReset />
      </div>
      <GridTransactions transactions={transactions} />
    </section>
  )
}

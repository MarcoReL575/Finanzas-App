import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { UserSession } from '@/src/lib/authServer'
import ButtonAddTransaction from '@/src/features/transaction/components/ButtonAddTransaction'
import GridTransactions from '@/src/features/transaction/components/GridTransactions'
import { transactionService } from '@/src/features/transaction/services/serviceTransaction'
import { FilterMyDatePicker } from '../../../src/features/transaction/components/FilterMyDatePicker'
import FilerSelectTransaction from '@/src/features/transaction/components/FilerSelectTransaction'
import FilterCategories from '@/src/features/transaction/components/FilterCategories'
import FilterReset from '@/src/features/transaction/components/FilterReset'

export default async function HomePage() {
  const queryClient = new QueryClient();

  const session = await UserSession();
  if(!session?.user.id) redirect('/auth/signin');


  await queryClient.query({
    queryKey: ['transactions', { userId: session.user.id }],
    queryFn: () => transactionService.getTransactionsByUser(session.user.id),
  })

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
      <HydrationBoundary state={dehydrate(queryClient)}>
        <GridTransactions userId={session.user.id} />
      </HydrationBoundary>
    </section>
  )
}

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

interface Props {
  searchParams: Promise<{ page?: string; limit?: string }>
}

const DEFAULT_LIMIT = 3;
const ALLOWED_LIMITS = [3, 5, 10, 15, 20];

export default async function HomePage({ searchParams }: Props) {
  const queryClient = new QueryClient();

  const session = await UserSession();
  if(!session?.user.id) redirect('/auth/signin');

  //Leemos la página actual desde la URL
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const requestedLimit = Number(params.limit);
  const limit = ALLOWED_LIMITS.includes(requestedLimit) ? requestedLimit : DEFAULT_LIMIT;

  await queryClient.query({
    queryKey: ['transactions', { userId: session.user.id, page, limit }],
    queryFn: () => transactionService.getTransactionsByUser(session.user.id, {page, limit}),
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
        <GridTransactions 
          userId={session.user.id} 
          page={page} 
          limit={limit}
        />
      </HydrationBoundary>
    </section>
  )
}

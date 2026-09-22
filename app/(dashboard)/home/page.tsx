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
import CardStats from '@/src/shared/components/CardStats'
import { IconCoin, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'
import ExpenseLimitSection from '@/src/features/gastos/components/ExpenseLimitSection'
import FilterSearch from '@/src/features/transaction/components/FilterSearch'

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

  const { success, message, data } = await transactionService.getBalanceSummary(session.user.id); 

  return (
    <section className='flex flex-col w-full space-y-10 max-w-6xl mx-auto'>
      <h1 className='font-bold text-4xl text-center'>Lleva un control de tus Gastos con AppTracker</h1>
      <ButtonAddTransaction />

      <section className='grid grid-cols-3 gap-x-5'>
        <CardStats titleCard='Total Gastos' total={data.totalGastos} type='gasto' icon={<IconTrendingDown />} />
        <CardStats titleCard='Total Ingresos' total={data.totalIngresos} type='ingreso' icon={<IconTrendingUp />} />
        <CardStats titleCard='Balance Total' total={data.totalGastos} type='balance' icon={<IconCoin />} />
      </section>

      <ExpenseLimitSection userId={session.user.id} />
      
      <section className=' space-y-4 bg-white p-4 rounded-lg pb-10'>
        <h2 className='text-xl font-semibold'>Lista de Transacciones</h2>
        <div className='space-y-4'>
          <div className='grid grid-cols-4 gap-4'>
            <FilterMyDatePicker />
            <FilerSelectTransaction />
            <FilterCategories />
            <FilterReset />
          </div>
          <div className='flex items-center justify-between gap-x-4'>
            <FilterSearch limit={limit} />
          </div>
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <GridTransactions 
            userId={session.user.id} 
            page={page} 
            limit={limit}
          />
        </HydrationBoundary>
      </section>
    </section>
  )
}
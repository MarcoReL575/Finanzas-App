'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getTransactionByUserAction } from '../actions/transactionActions';
import { useFilterStore } from '@/src/shared/stores/filterStore'
import CardTransaction from './CardTransaction'
import PaginationComponent from '@/src/shared/components/PaginationComponent';

interface Props {
    userId: string;
    page: number;
    limit: number;
}

export default function GridTransactions({ userId, limit, page }: Props) {
    
    const { valueType, valueCategory, dateRange, valueFilter } = useFilterStore();

    const { data, isFetching, isPlaceholderData } = useQuery({
        queryKey: ['transactions', { userId, page, limit }],
        queryFn: () => getTransactionByUserAction(userId, { page, limit: limit }),
        placeholderData: keepPreviousData, 
        staleTime: 60 * 1000, // 1 minuto
    });

    const filteredTransactions = data?.items.filter((transaction)=> {
        const matchType = valueType === 'all' || transaction.tipo === valueType
        const matchCategory = valueCategory === 'all' || transaction.categoria === valueCategory
        const matchDate = !dateRange || (transaction.createdAt >= dateRange.from && transaction.createdAt <= dateRange.to)
        const matchFilter = valueFilter === null || transaction.descripcion.toLowerCase().includes(valueFilter)

        return matchType && matchCategory && matchDate && matchFilter
    })

   if(!filteredTransactions?.length) {
       return (
           <div className='w-full text-center font-semibold text-xl text-shadow-gray-500 py-5'>
               Aún no hay gastos que mostrar
           </div>
       )
   }

  return (
    <section className='space-y-5 w-full mx-auto bg-white p-4 rounded-lg'>
        <ul className='flex flex-col gap-y-4'>
            { filteredTransactions && filteredTransactions.map((transaction)=> (
                    <CardTransaction key={transaction.id} transaction={transaction} />
                ))
            }        
        </ul>
        <div className='w-fullmx-auto'>
            <PaginationComponent  
                data={data}
                limit={limit}
                page={page}
                isPlaceholderData={isPlaceholderData}
                userId={userId}
                isFetching={isFetching}
            />
        </div>
    </section>
  )
}
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
    const { valueType, valueCategory, dateRange } = useFilterStore();

    const { data, isFetching, isPlaceholderData } = useQuery({
        queryKey: ['transactions', { userId, page, limit }],
        queryFn: () => getTransactionByUserAction(userId, { page, limit }),
        placeholderData: keepPreviousData, 
        staleTime: 60 * 1000, // 1 minuto
    });

    const filteredTransactions = data?.items.filter((transaction)=> {
        const matchType = valueType === 'all' || transaction.tipo === valueType
        const matchCategory = valueCategory === 'all' || transaction.categoria === valueCategory
        const matchDate = !dateRange || (transaction.createdAt >= dateRange.from && transaction.createdAt <= dateRange.to)

        return matchType && matchCategory && matchDate
    })
   
  return (
    <section className='py-10 space-y-5'>
        <ul className='flex flex-col gap-y-4'>
            { filteredTransactions && filteredTransactions.map((transaction)=> (
                <CardTransaction key={transaction.id} transaction={transaction} />
            )) }        
        </ul>
        <PaginationComponent  
            data={data}
            limit={limit}
            page={page}
            isPlaceholderData={isPlaceholderData}
            userId={userId}
            isFetching={isFetching}
        />
    </section>
  )
}
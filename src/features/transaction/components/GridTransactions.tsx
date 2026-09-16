'use client'

import { useFilterStore } from '@/src/shared/stores/filterStore'
import { SelectTransaction } from '../types/types'
import CardTransaction from './CardTransaction'
import { useQuery } from '@tanstack/react-query';
import { getTransactionByUserAction } from '../actions/transactionActions';

interface Props {
    userId: string;
}

export default function GridTransactions({ userId }: Props) {

    const { valueType, valueCategory, dateRange } = useFilterStore();

    const { data: transactions = [], isLoading, isError } = useQuery({
        queryKey: ['transactions', { userId }],
        queryFn: () => getTransactionByUserAction(userId),
    })


    const listTransactions = transactions.filter((transaction)=> {
        const matchType = valueType === 'all' || transaction.tipo === valueType
        const matchCategory = valueCategory === 'all' || transaction.categoria === valueCategory
        const matchDate = !dateRange || (transaction.createdAt >= dateRange.from && transaction.createdAt <= dateRange.to)

        return matchType && matchCategory && matchDate
    })
   
  return (
    <section className='py-10'>
        <ul className='flex flex-col gap-y-4'>
            { listTransactions.map((transaction)=> (
                <CardTransaction key={transaction.id} transaction={transaction} />
            )) }        
        </ul>
    </section>
  )
}

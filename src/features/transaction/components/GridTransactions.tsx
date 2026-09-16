'use client'

import { useFilterStore } from '@/src/shared/stores/filterStore'
import { SelectTransaction } from '../types/types'
import CardTransaction from './CardTransaction'

interface Props {
    transactions: SelectTransaction[]
}

export default function GridTransactions({ transactions }: Props) {

    const { valueType, valueCategory, dateRange } = useFilterStore();

    const listTransactions = transactions.filter((transaction)=> {
        const matchType = valueType === 'all' || transaction.tipo === valueType
        const matchCategory = valueCategory === 'all' || transaction.categoria === valueCategory
        const matchDate = !dateRange || (transaction.createdAt >= dateRange.from && transaction.createdAt <= dateRange.to)

        return matchType && matchCategory && matchDate
    })
   
  return (
    <section>
        <ul className='flex flex-col gap-y-4 mt-10'>
            { listTransactions.map((transaction)=> (
                <CardTransaction key={transaction.id} transaction={transaction} />
            )) }        
        </ul>
    </section>
  )
}

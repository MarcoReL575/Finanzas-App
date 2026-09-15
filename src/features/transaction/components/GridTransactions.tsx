import React from 'react'
import { SelectTransaction } from '../types/types'
import CardTransaction from './CardTransaction'

interface Props {
    transactions: SelectTransaction[]
}

export default function GridTransactions({ transactions }: Props) {
   
  return (
    <section>
        <ul className='flex flex-col gap-y-4 mt-10'>
            { transactions.map((transaction)=> (
                <CardTransaction key={transaction.id} transaction={transaction} />
            )) }        
        </ul>
    </section>
  )
}

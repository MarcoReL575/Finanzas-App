import ButtonAddTransaction from '@/src/features/transaction/components/ButtonAddTransaction'
import GridTransactions from '@/src/features/transaction/components/GridTransactions'
import { transactionService } from '@/src/features/transaction/services/serviceTransaction'
import { UserSession } from '@/src/lib/authServer'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function HomePage() {

  const session = await UserSession();
  if(!session?.user.id) redirect('/auth/signin');

  const { transactions } = await transactionService.getTransactionsByUser(session.user.id);


  return (
    <section className=' flex flex-col w-full space-y-4'>
      <ButtonAddTransaction />
      <GridTransactions transactions={transactions} />
    </section>
  )
}

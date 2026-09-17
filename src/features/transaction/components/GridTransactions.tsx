'use client'

import { useFilterStore } from '@/src/shared/stores/filterStore'
import { SelectTransaction } from '../types/types'
import CardTransaction from './CardTransaction'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTransactionByUserAction } from '../actions/transactionActions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { Route } from 'next';
import PaginationComponent from '@/src/shared/components/PaginationComponent';

interface Props {
    userId: string;
    page: number;
    limit: number;
}

export default function GridTransactions({ userId, limit, page }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const { valueType, valueCategory, dateRange } = useFilterStore();

    const { data, isFetching, isPlaceholderData } = useQuery({
        queryKey: ['transactions', { userId, page, limit }],
        queryFn: () => getTransactionByUserAction(userId, { page, limit }),
        placeholderData: keepPreviousData, 
        staleTime: 60 * 1000, // 1 minuto
    });
    console.log(data);

    // Prefetch de la página siguiente
    useEffect(() => {
        if (data?.hasMore && !isPlaceholderData) {
        queryClient.query({
            queryKey: ['transactions', { userId, page: page + 1, limit }],
            queryFn: () => getTransactionByUserAction(userId, { page: page + 1, limit }),
            staleTime: 60 * 1000,
        })
        }
    }, [data, isPlaceholderData, page, limit, userId, queryClient])

    const handlePageChange = useCallback((newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', String(newPage))
        router.push(`${pathname}?${params.toString()}` as Route)
    }, [router, pathname, searchParams])


    const filteredTransactions = data?.items.filter((transaction)=> {
        const matchType = valueType === 'all' || transaction.tipo === valueType
        const matchCategory = valueCategory === 'all' || transaction.categoria === valueCategory
        const matchDate = !dateRange || (transaction.createdAt >= dateRange.from && transaction.createdAt <= dateRange.to)

        return matchType && matchCategory && matchDate
    })
   
  return (
    <section className='py-10'>
        <ul className='flex flex-col gap-y-4'>
            { filteredTransactions && filteredTransactions.map((transaction)=> (
                <CardTransaction key={transaction.id} transaction={transaction} />
            )) }        
        </ul>
        <div className="flex items-center justify-center gap-4 mt-6">
            <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || isPlaceholderData}
                className="px-4 py-2 border rounded disabled:opacity-50"
            >
                Anterior
            </button>
            
            <span className="text-sm text-gray-600">
                Página {page}
            </span>

            <button
                onClick={() => handlePageChange(page + 1)}
                disabled={!data?.hasMore || isPlaceholderData}
                className="px-4 py-2 border rounded disabled:opacity-50"
            >
                Siguiente
            </button>
        </div>
        <PaginationComponent />
    </section>
  )
}
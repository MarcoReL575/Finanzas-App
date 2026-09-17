'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getTransactionByUserAction } from '../actions/transactionActions';
import { useFilterStore } from '@/src/shared/stores/filterStore'
import CardTransaction from './CardTransaction'
import PaginationComponent from '@/src/shared/components/PaginationComponent';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/select';
import { useCallback, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Route } from 'next';

interface Props {
    userId: string;
    page: number;
    limit: number;
}

const PAGE_SIZE_OPTIONS = [3, 5, 10, 15, 20] as const

export default function GridTransactions({ userId, limit, page }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { valueType, valueCategory, dateRange } = useFilterStore();

    const { data, isFetching, isPlaceholderData } = useQuery({
        queryKey: ['transactions', { userId, page, limit }],
        queryFn: () => getTransactionByUserAction(userId, { page, limit: limit }),
        placeholderData: keepPreviousData, 
        staleTime: 60 * 1000, // 1 minuto
    });

    const handleLimitChange = useCallback((newLimit: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('limit', newLimit)
        params.set('page', '1') // ← importante: resetear a la primera página
        router.push(`${pathname}?${params.toString()}` as Route)
    },[router, pathname, searchParams])

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
        <div className='grid grid-cols-2 gap-4 max-w-xl  mx-auto'>
            
            <div className='flex items-center justify-center text-xs font-semibold gap-x-2'>
                <Select value={String(limit)} onValueChange={handleLimitChange} >
                    <SelectTrigger className="w-fit">
                        <SelectValue placeholder="3 " />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                        {
                            PAGE_SIZE_OPTIONS.map((size)=>(
                            <SelectItem key={size} value={String(size)}>
                                {size}
                            </SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
                <span>Elementos por página</span>
            </div>
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
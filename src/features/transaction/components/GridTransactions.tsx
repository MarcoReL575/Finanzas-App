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
import SearchFilters from './SearchFilters';

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
    const { valueType, valueCategory, dateRange, valueFilter } = useFilterStore();

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
    <section className='space-y-5 w-full mx-auto'>
        <div className='flex w-full gap-x-4'>
            <div className='w-2/3'>
                <SearchFilters />
            </div>
            <div className='flex w-1/3 items-center justify-start text-xs font-semibold gap-x-2'>
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
        </div>
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
import React, { useCallback, useEffect } from 'react'
import { Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { PaginationContent, Pagination, PaginationItem, PaginationEllipsis, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination'
import { PaginatedResult, SelectTransaction } from '@/src/features/transaction/types/types';
import { getTransactionByUserAction } from '@/src/features/transaction/actions/transactionActions';

interface Props {
    data: PaginatedResult<SelectTransaction> | undefined;
    page: number;
    limit: number;
    isPlaceholderData: boolean;
    userId: string;
    isFetching: boolean
}

export default function PaginationComponent({ limit, page, data, isPlaceholderData, userId, isFetching }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    
    const totalPages = data ? Math.ceil(data.total / limit): 0

    const handlePageChange = useCallback((newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return

        const params = new URLSearchParams(searchParams.toString())
        params.set('page', String(newPage))
        router.push(`${pathname}?${params.toString()}` as Route)
    }, [router, pathname, searchParams]);

    // Prefetch de la página siguiente
    useEffect(() => {
        if (data?.hasMore && !isPlaceholderData && !isFetching) {
        queryClient.query({
            queryKey: ['transactions', { userId, page: page + 1, limit }],
            queryFn: () => getTransactionByUserAction(userId, { page: page + 1, limit }),
            staleTime: 60 * 1000,
        })
        }
    }, [data?.hasMore, isPlaceholderData, isFetching, page, limit, userId, queryClient]);

    // Genera los números de página con elipsis
    const getPageNumbers = (): (number | 'ellipsis')[] => {
        if (totalPages <= 1) return [1]

        const pages: (number | 'ellipsis')[] = []
        const siblingCount = 1 // cuántas páginas a cada lado de la actual

        const range = (start: number, end: number) =>
        Array.from({ length: end - start + 1 }, (_, i) => start + i)

        const leftSibling = Math.max(page - siblingCount, 1)
        const rightSibling = Math.min(page + siblingCount, totalPages)

        const showLeftEllipsis = leftSibling > 2
        const showRightEllipsis = rightSibling < totalPages - 1

        if (!showLeftEllipsis && showRightEllipsis) {
            pages.push(...range(1, 5), 'ellipsis', totalPages)
            // Ej: 1 2 3 4 5 ... 20
        } else if (showLeftEllipsis && !showRightEllipsis) {
            // Ej: 1 ... 16 17 18 19 20
            pages.push(1, 'ellipsis', ...range(totalPages - 4, totalPages))
        } else if (showLeftEllipsis && showRightEllipsis) {
            // Ej: 1 ... 9 10 11 ... 20
            pages.push(1, 'ellipsis', ...range(leftSibling, rightSibling), 'ellipsis', totalPages)
        } else {
            // Pocas páginas: 1 2 3 4
            pages.push(...range(1, totalPages))
        }

        return pages
    }

    const isPrevDisabled = page <= 1 || isPlaceholderData
    const isNextDisabled = !data?.hasMore || isPlaceholderData
    const pageNumbers = getPageNumbers()



  return (
    <Pagination className='flex justify-center'>
        <PaginationContent>
            <PaginationItem>
                <PaginationPrevious 
                    href="#"  
                    onClick={(e) => { 
                        e.preventDefault()
                        if(!isPrevDisabled) handlePageChange(page - 1)
                    }}
                    className={isPrevDisabled ? 'pointer-events-none opacity-50' : ''}
                />
            </PaginationItem>

            {
                pageNumbers.map((item, idx)=> (
                    item === 'ellipsis'
                    ?   <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    :   <PaginationItem key={item}>
                            <PaginationLink
                                href="#"
                                isActive={item === page}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handlePageChange(item)
                                }}
                            >
                                {item}
                            </PaginationLink>
                        </PaginationItem>
                    ))
            }
            
            <PaginationItem>
                <PaginationNext 
                    href="#" 
                    aria-disabled={isNextDisabled}
                    className={isNextDisabled ? 'pointer-events-none opacity-50' : ''}
                    onClick={(e) => {
                        e.preventDefault()
                        if (!isNextDisabled) handlePageChange(page + 1)
                    }}
                />
            </PaginationItem>
        </PaginationContent>
    </Pagination>
  )
}

'use client'

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/select';
import { IconSearch } from '@tabler/icons-react';
import { useFilterStore } from '@/src/shared/stores/filterStore'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Route } from 'next';

const PAGE_SIZE_OPTIONS = [3, 5, 10, 15, 20] as const

interface Props {
    limit: number;
}

export default function FilterSearch({ limit }: Props) {

    const setValueFilter = useFilterStore((state)=> state.setValueFilter );
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleLimitChange = useCallback((newLimit: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('limit', newLimit)
        params.set('page', '1') // ← importante: resetear a la primera página
        router.push(`${pathname}?${params.toString()}` as Route)
    },[router, pathname, searchParams])

  return (
    <>
        <div className='w-2/3'>
            <div className="flex gap-x-2 border border-gray-400 p-2 rounded-lg w-full">
                <IconSearch />
                <input 
                    type="text" 
                    placeholder="Buscar transacciones..."
                    className="focus:outline-none"
                    onChange={e=> setValueFilter(e.target.value)}
                />
            </div>
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
    </>
  )
}

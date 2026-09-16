'use client'

import { useFilterStore } from '@/src/shared/stores/filterStore'
import { Button } from '@/src/shared/ui/button'
import { IconFilter, IconFilterOff } from '@tabler/icons-react'

export default function FilterReset() {

    const { valueType, valueCategory, dateRange } = useFilterStore();

    const handleResetFilters = ()=> {
        useFilterStore.setState({
            valueType: 'all',
            valueCategory: 'all',
            dateRange: undefined
        })
    }

  return (
    <>
        {
            valueCategory === 'all' && valueType ==='all' && dateRange === undefined
            ?
                <Button variant='outline' className='w-30'>
                    <IconFilter />
                    Filtros
                </Button>
            :
                <Button variant='outline' onClick={handleResetFilters} className='w-30 bg-gray-900 text-white'>
                    <IconFilterOff />
                    Borrar Filtros
                </Button>
        }
    </>
  )
}

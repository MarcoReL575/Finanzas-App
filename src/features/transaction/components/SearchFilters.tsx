import { useFilterStore } from '@/src/shared/stores/filterStore'
import { IconSearch } from '@tabler/icons-react'
import React, { useState } from 'react'

export default function SearchFilters() {

    const setValueFilter = useFilterStore((state)=> state.setValueFilter );

  return (
    <div className="flex gap-x-2 border border-gray-400 p-2 rounded-lg w-full">
      <IconSearch />
      <input 
        type="text" 
        placeholder="Buscar transacciones..."
        className="focus:outline-none"
        onChange={e=> setValueFilter(e.target.value)}
      />
    </div>
  )
}

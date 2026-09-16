import { DateRange } from '@daypicker/react';
import { create } from 'zustand'

interface FilterStore {
    valueType: string;
    valueCategory: string;
    dateRange: DateRange | undefined;
    setDateRange: (date: DateRange)=> void
    setValueType: (filter: string) => void;
    setvalueCategory: (valueCategory: string) => void;
}

export const useFilterStore = create<FilterStore>()((set) => ({
    valueType: 'all',
    setValueType: (filter) => set(() => ({ valueType: filter })),
    
    valueCategory: 'all',
    setvalueCategory: (valueCategory) => set(()=> ({ valueCategory })),
    
    dateRange: undefined,
    setDateRange: (dateRange)=> set(()=> ({ dateRange }))
}))
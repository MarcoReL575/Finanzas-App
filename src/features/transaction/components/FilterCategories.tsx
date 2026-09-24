'use client'

import { listaGastos } from "@/src/category"
import { useFilterStore } from "@/src/shared/stores/filterStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/ui/select"

export default function FilterCategories() {
    const setvalueCategory = useFilterStore((state)=> state.setvalueCategory);
    const valueCategory = useFilterStore((state)=> state.valueCategory);

    const items  = listaGastos.map(({ value, label }) => ({ value, label }));

  return (
    <Select items={items} value={valueCategory} onValueChange={(e)=> setvalueCategory(e)}>
        <SelectTrigger className="w-45">
            <SelectValue placeholder="Todos">
                {(value: string) => {
                    const gasto = listaGastos.find(g => g.value === value);
                    return gasto ? (
                        <span className="flex items-center gap-x-2">
                            {gasto.icon}
                            {gasto.label}
                        </span>
                    ) : null;
                }}
            </SelectValue>
        </SelectTrigger>
        <SelectContent className='bg-white w-fit p-1'>
            {listaGastos.map((gasto) => (
                <SelectItem key={gasto.id} value={gasto.value} className='flex items-center'>
                    <div className="flex items-center gap-x-4 text-lg">
                        <span className="scale-150">{gasto.icon}</span>
                        <span>{gasto.label}</span>
                    </div>
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
  )
}

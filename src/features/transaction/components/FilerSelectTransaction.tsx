'use client'

import { useFilterStore } from "@/src/shared/stores/filterStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/ui/select"

const items = [
    { label: "Todas", value: "all", color: "blue" },
    { label: "Ingreso", value: "ingreso", color: "green" },
    { label: "Gasto", value: "gasto", color: "red" },
]

export default function FilerSelectTransaction() {

    const setValueType = useFilterStore((state)=> state.setValueType);
    const valueType = useFilterStore((state)=> state.valueType);

    const handleChangeValueFilter = (filter: string)=> {
        setValueType(filter);
        console.log(valueType);
    }

  return (
    <Select items={items} value={valueType} onValueChange={(e )=> handleChangeValueFilter(e)}>
        <SelectTrigger className="w-45">
            <SelectValue placeholder="Todos">
                {(value: string) => {
                    const category = items.find(g => g.value === value);
                    return category ? (
                        <div className="flex items-center gap-x-2">
                           <div className="flex items-center justify-center">
                                <span className={`size-2 rounded-full bg-${category.color}-500`} />
                            </div>
                            {category.label}
                        </div>
                    ) : null;
                }}
            </SelectValue>
        </SelectTrigger>
        <SelectContent className='bg-white'>
            {items.map((item) => (
                <SelectItem key={item.value} value={item.value} className='flex items-center'>
                    <div className="flex items-center justify-center">
                        <span className={`size-2 rounded-full bg-${item.color}-500`} />
                    </div>
                    <span>{item.label}</span>
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
  )
}






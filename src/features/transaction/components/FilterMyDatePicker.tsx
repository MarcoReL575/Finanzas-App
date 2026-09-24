'use client'

import { useState } from "react";

import { DateRange, DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import { IconCalendar } from "@tabler/icons-react";
import { Button } from "@/src/shared/ui/button";
import { useFilterStore } from "@/src/shared/stores/filterStore";

export function FilterMyDatePicker() {
  const dateRange = useFilterStore((state)=> state.dateRange);
  const setDateRange = useFilterStore((state)=> state.setDateRange);

  const [open, setOpen] = useState<boolean>(false);
  console.log({dateRange})

  const toggleModal = ()=> {
    setOpen(prev => !prev)
  }

  return (
    <>
      <div className="relative">
        <Button variant='outline'onClick={toggleModal}>
          <IconCalendar />
          Seleccionar Fechas
        </Button>

        {
          open === true && (
            <div className="absolute z-50 mt-2 left-0">
              <DayPicker
                animate
                mode="range"
                required
                selected={dateRange}
                onSelect={setDateRange}
                navLayout="around"
                className="w-fit text-xs text-gray-600 p-4 bg-white border-2 border-r-blue-600 rounded-lg"
                styles={{
                  day: { width: '28px', height: '28px' },
                  day_button: { width: '26px', height: '26px' },
                }}
                resetOnSelect={true}
              />
            </div>
          )
        }
      </div>
    </>
  );
}
'use client'

import { useState } from "react";

import { DateRange, DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import { IconCalendar } from "@tabler/icons-react";

export function MyDatePicker() {

  const [range, setRange] = useState<DateRange | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  console.log({range, setRange})

  const toggleModal = ()=> {
    setOpen(prev => !prev)
  }

  return (
    <>
      <button 
        className="flex items-center gap-x-2 px-2 rounded-lg bg-gray-900 text-white py-1 cursor-pointer hover:bg-gray-700"
        onClick={toggleModal}
      >
        <IconCalendar />
        Seleccionar Fechas
      </button>

      {
        open === true && (
          <div className="absolute z-50 mt-2 left-0">
            <DayPicker
              animate
              mode="range"
              selected={range}
              onSelect={setRange}
              className="w-fit p-4 bg-white border-2 border-r-blue-600 rounded-lg"
              resetOnSelect={true}
            />
          </div>
        )
      }
    </>
  );
}
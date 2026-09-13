'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

export default function TopMenu() {
  const pathname = usePathname();

  return (
    <menu className='flex items-center justify-between gap-x-2 rounded-lg text-md '>
      <li className='list-none'>
        <Link 
          href={'/home'} 
          className={`border border-gray-500 p-1 rounded-lg ${pathname === '/home'? 'bg-white text-black': ''}`}>
          Home
        </Link>
      </li>
      <li className='list-none'>
        <Link 
          href={'/gastos'} 
          className={`border border-gray-500 p-1 rounded-lg ${pathname === '/gastos'? 'bg-white text-black': ''}`}
        >
          Gastos
        </Link>
      </li>
      <li className='list-none'>
        <Link 
          href={'/ingresos'} 
          className={`border border-gray-500 p-1 rounded-lg ${pathname === '/ingresos'? 'bg-white text-black': ''}`}
        >
            Ingresos
        </Link>
      </li>
      <li className='list-none'>
        <Link 
          href={'/graficos'} 
          className={`border border-gray-500 p-1 rounded-lg ${pathname === '/graficos'? 'bg-white text-black': ''}`}
        >
          Gráficos
        </Link>
      </li>
    </menu>
  )
}

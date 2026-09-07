'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

export default function TopMenu() {
  const pathname = usePathname();

  return (
    <nav className='flex items-center justify-between p-4 rounded-lg '>
      <li className='list-none'>
        <Link 
          href={'/home'} 
          className={`border border-gray-500 p-2 rounded-lg ${pathname === '/home'? 'bg-white text-black': ''}`}>
          Home
        </Link>
      </li>
      <li className='list-none'>
        <Link 
          href={'/home'} 
          className={`border border-gray-500 p-2 rounded-lg ${pathname === '/home'? 'bg-white text-black': ''}`}
        >
          Gastos
        </Link>
      </li>
      <li className='list-none'>
        <Link 
          href={'/home'} 
          className={`border border-gray-500 p-2 rounded-lg ${pathname === '/home'? 'bg-white text-black': ''}`}
        >
            Ingresos
        </Link>
      </li>
      <li className='list-none'>
        <Link 
          href={'/home'} 
          className={`border border-gray-500 p-2 rounded-lg ${pathname === '/home'? 'bg-white text-black': ''}`}
        >
          Gráficos
        </Link>
      </li>
    </nav>
  )
}

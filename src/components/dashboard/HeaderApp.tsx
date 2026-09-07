import { IconWallet } from '@tabler/icons-react'
import React from 'react'
import TopMenu from './TopMenu'

export default function HeaderApp() {
  return (
    <header className='fixed top-0 left-0 right-0 z-50 grid grid-cols-2 max-w-3xl mx-auto'>
      <section className='flex items-center gap-x-2'>
          <div className='p-2 border rounded-lg border-gray-500 flex'>
            <IconWallet size={20} />
          </div>
          <p>Finance-App</p>
      </section>
      <TopMenu />
    </header>
  )
}

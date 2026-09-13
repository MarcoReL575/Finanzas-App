import { IconWallet } from '@tabler/icons-react'
import React from 'react'
import TopMenu from './TopMenu'
import UserSection from './UserSection'

export default function HeaderApp() {
  return (
    <header className='fixed bg-gray-900 top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-10 py-2 text-white'>
      <section className='flex items-center gap-x-2'>
        <div className='p-2 border rounded-lg border-gray-500 flex'>
          <IconWallet size={20} />
        </div>
        <p>Finance-App</p>
      </section>

      <TopMenu />

      <UserSection />
    </header>
  )
}

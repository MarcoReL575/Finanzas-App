
import { auth } from '@/src/lib/auth'
import { UserSession } from '@/src/lib/authServer'
import { redirect } from 'next/navigation'
import React from 'react'
import DotsOptionUser from './DotsOptionUser'

export default async function UserSection() {

    const session = await UserSession()
    if(!session?.user) redirect('/auth/signup');

    const { name, email } = session.user
    const userName = name.slice(0,2);

  return (
    <div className='flex items-center justify-between border rounded-lg pl-2 gap-x-4 h-12'>
        <div>
            <div className='border border-gray-400 rounded-full flex items-center justify-center size-8'>
                {userName}
            </div>
        </div>
        <div className=' text-start'>
            <p className='font-semibold text-sm text-white'>{name}</p>
            <p className='text-gray-200 text-xs'>{email}</p>
        </div>
        <DotsOptionUser />
    </div>
  )
}

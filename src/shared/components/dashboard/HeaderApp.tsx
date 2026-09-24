import { IconWallet } from '@tabler/icons-react'
import { UserSession } from '@/src/lib/authServer';
import { redirect } from 'next/navigation';
import { UserSection } from './UserSection';
import Link from 'next/link';

export default async function HeaderApp() {

  const session = await UserSession()
  if(!session?.user) redirect('/auth/signup');

  return (
    <header className='fixed bg-gray-900 top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-10 py-2 text-white'>
      <section className='flex items-center gap-x-2'>
        <Link href='/home' className=' cursor-pointer flex items-center justify-center gap-x-2'>
          <div className='p-2 border rounded-lg border-gray-500 flex'>
            <IconWallet size={20} />
          </div>
          <p>Finance-App</p>
        </Link>
      </section>

      <UserSection email={session.user.email} name={session.user.name} />
    </header>
  )
}

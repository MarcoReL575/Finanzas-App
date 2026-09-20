import { IconWallet } from '@tabler/icons-react'

export default function CardStats() {
  return (
    <div className='border w-full p-4 rounded-lg h-40 flex flex-col justify-around'>
        <div className='flex items-center justify-center'>
            <span className='flex items-center justify-center rounded-full border border-gray-500 w-fit p-2'>
                <IconWallet size={35} />
            </span>
        </div>
        <h2 className='text-center font-semibold text-xl'>Balance Final</h2>
        <p className='text-xl font-bold text-center'>
            $14400
        </p>
    </div>
  )
}

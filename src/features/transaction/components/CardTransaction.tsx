import { SelectTransaction } from '../types/types'
import { IconDotsCircleHorizontal, IconDotsVertical } from '@tabler/icons-react'
import { listaGastos } from '@/src/category'
import { formatDate } from '@/src/shared/helper/formatDate'

interface Props {
    transaction: SelectTransaction
}

export default function CardTransaction({ transaction }: Props) {
    const findTransaction = listaGastos.find((gasto)=> gasto.value === transaction.categoria);

  return (
    <li className='flex flex-col justify-around border border-gray-500 rounded-lg p-4 w-lg mx-auto'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-x-4'>
                <span className='border p-1 rounded-lg'>
                    {findTransaction?.icon}
                </span>
                <div className=''>
                    <h2 className='text-xl capitalize'>
                        {transaction.tipo}
                    </h2>
                    <p className='text-gray-400 capitalize'>
                        {transaction.categoria}
                    </p>
                </div>
            </div>
            <div className='flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300'>
                <IconDotsCircleHorizontal className='hover:text-gray-700 text-gray-800' />
            </div>
        </div>
        <div className='w-full flex items-center justify-end text-gray-500 text-xs'>
            {formatDate(transaction.createdAt)}
        </div>
    </li>
  )
}

import { SelectTransaction } from '../types/types'
import { listaGastos } from '@/src/category'
import { formatDate } from '@/src/shared/helper/formatDate'
import DropdownActions from './DropdownActions'
import { formatCurrency } from '@/src/shared/helper/formatCurrency'

interface Props {
    transaction: SelectTransaction
}

export default function CardTransaction({ transaction }: Props) {
    const findTransaction = listaGastos.find((gasto)=> gasto.value === transaction.categoria);
    const monto = formatCurrency(transaction.monto);

  return (
    <li className='flex flex-col justify-around border border-gray-500 rounded-lg p-4 w-lg mx-auto'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-x-4'>
                <span className='border p-1 rounded-lg'>
                    {findTransaction?.icon}
                </span>
                <div className=''>
                    <h2 className='text-xl capitalize'>
                        {transaction.categoria}
                    </h2>
                    <p className='text-gray-400 capitalize'>
                        {transaction.descripcion}
                    </p>
                </div>
            </div>
            <div className='flex items-center space-x-2 justify-center'>
                <p className={`${transaction.tipo === 'gasto' ? 'text-red-500' : 'text-green-500'} tabular-nums mmin-w-[80px]`}>
                    {transaction.tipo === 'gasto' ? '-' : '+'}
                    {monto}
                </p>
                <div className='flex items-center'>
                    <DropdownActions transaction={transaction} />
                </div>
            </div>
        </div>
        <div className='w-full flex items-center justify-end text-gray-500 text-xs'>
            {formatDate(transaction.createdAt)}
        </div>
    </li>
  )
}
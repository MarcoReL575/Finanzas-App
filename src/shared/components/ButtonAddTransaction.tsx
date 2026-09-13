import { IconCircle, IconCirclePlus } from '@tabler/icons-react'
import Link from 'next/link'

export default function ButtonAddTransaction() {
  return (
    <Link
        className='px-4 flex space-x-2 py-2 rounded-lg bg-green-500 text-white cursor-pointer hover:bg-green-400 transition-all duration-300'
        href={'/gastos/agregar-transaccion'}
    >
        <IconCirclePlus />
        Agregar Gasto
    </Link>
  )
}

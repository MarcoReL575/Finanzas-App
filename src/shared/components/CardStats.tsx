import { IconWallet } from '@tabler/icons-react'
import clsx from 'clsx';
import React from 'react';
import { formatCurrency } from '../helper/formatCurrency';

interface Props {
    titleCard: string;
    total: number;
    icon: React.ReactNode;
    type: 'gasto' | 'ingreso' | 'balance'
}

export default function CardStats({ titleCard, total, icon, type }: Props) {
    const balancePositivo = total > 0;
    console.log(total)

  return (
    <div className={clsx('border-2 w-full p-4 rounded-lg h-40 flex flex-col justify-around', {
        'text-red-500 border-red-800 bg-red-100' : type === 'gasto',
        'text-green-500 border-green-800 bg-green-100': balancePositivo === true,
    })}>
        <div className='flex items-center justify-center'>
            <span className='flex items-center justify-center rounded-full bg-white border-2 border-gray-500 w-fit p-2'>
                {icon}
            </span>
        </div>
        <h2 className='text-center font-semibold text-xl'>
            {titleCard}
        </h2>
        <p className='text-2xl font-bold text-center'>
            {formatCurrency(total)}
        </p>
    </div>
  )
}

import { IconAlertCircle } from '@tabler/icons-react';
import { BudgetDisplayItem, SelectLimiteGasto } from '../types/types';
import { formatCurrency } from '@/src/shared/helper/formatCurrency';

interface Props {
    item: BudgetDisplayItem;
}

export default async function ItemExpenseLimit({item}: Props) {

    let progressBg = 'bg-emerald-500';
    let textColor = 'text-emerald-400';

    if (item.percentage >= 80 && !item.isExceeded) {
        progressBg = 'bg-amber-500';
        textColor = 'text-amber-500';
    } else if (item.isExceeded) {
        progressBg = 'bg-red-500';
        textColor = 'text-red-500';
    }

  return (
    <div className="space-y-1.5">
        <div className='flex items-center justify-between gap-3'>
            <div className='p-2 gap-x-2 capitalize bg-white text-emerald-400 rounded-lg flex items-center justify-center shrink-0 [&>svg]:w-6 [&>svg]:h-6'>
                {item.categoryIcon} {item.categoryLabel}
            </div>
            <div>
                <p className='text-xs'>
                    Gastado: <span className='font-medium text-slate-500'>{formatCurrency(item.spentAmount)}</span>
                </p>
            </div>
        </div>

        <div className='space-y-1.5'>
            <div className='w-full bg-gray-200 h-2.5 rounded-full overflow-hidden'>
                <div
                    data-testid='progresBar'
                    className={`h-full transition-all duration-500 ${progressBg}`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
            </div>
            <div className='flex justify-between items-center text-xs'>
                <span className={`font-semibold ${textColor}`}>
                    {item.percentage}% consumido
                </span>
                <span className=''>
                    {item.isExceeded ? (
                        <strong className='font-medium'>
                            Excedido por <span>{formatCurrency(Math.abs(item.remainingAmount))}</span>
                        </strong>
                    ) : (
                        <>Restante: <strong className='text-slate-500 font-medium'>{formatCurrency(item.remainingAmount)}</strong></>
                    )}
                </span>
            </div>
        </div>
    </div>
  )
}

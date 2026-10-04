import { BudgetDisplayItem } from '../types/types'
import ItemExpenseLimit from './ItemExpenseLimit';

interface Props {
    budgetItems: BudgetDisplayItem[];
}

export default function ExpenseLimitList({ budgetItems }: Props) {
  return (
    <div className='space-y-4'>
        {budgetItems.length === 0 ? (
            <p className='text-sm text-slate-400 text-center py-6'>
                No has configurado ningún límite de gasto para este mes.
            </p>
        ) : (
            budgetItems.map((item) => (
                <ItemExpenseLimit key={item.id} item={item} data-testid={`expense-limit-item-${item.id}`}/>
            ))
        )}
    </div>
  )
}

import ButtonExpenseLimit from './ButtonExpenseLimit';
import { gastoService } from '../services/gastoService';
import ItemExpenseLimit from './ItemExpenseLimit';
import { transactionService } from '../../transaction/services/serviceTransaction';
import { getCategoryInfo } from '../helper/categoryInfo';

interface Props {
    userId: string;
}

export default async function ExpenseLimitSection({ userId }: Props) {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const { success, message, budgets } = await gastoService.getUsersExpenseLimits(userId);
    
    const { success: successT, message: messageT, transactions } = await transactionService.getTransactionsUser(userId);
    
    const currentBudgets = budgets.filter((budget)=> (
        budget.month === currentMonth && budget.year === currentYear
    ));

    const budgetItems = currentBudgets.map((budget)=> {
        // Sumar gastos de esta categoría en el mes y año actual
        const spentAmount = transactions.filter((tr) => {
                const tDate = new Date(tr.createdAt);
                return (
                    tr.categoria === budget.category &&
                    tDate.getMonth() + 1 === currentMonth &&
                    tDate.getFullYear() === currentYear &&
                    (tr.tipo === 'gasto' || !tr.tipo) // Asegurar que sea egreso
                );
            })
            .reduce((acc, curr) => acc + Number(curr.monto || 0), 0);
        const limitAmount = Number(budget.monto);
        const percentage = limitAmount > 0 
            ? Math.min(Math.round((spentAmount / limitAmount) * 100), 100) 
            : 0;

        const categoryInfo = getCategoryInfo(budget.category);
        return {
            id: budget.id,
            category: budget.category,
            categoryLabel: categoryInfo.label,
            categoryIcon: categoryInfo.icon,
            limitAmount,
            spentAmount,
            remainingAmount: limitAmount - spentAmount,
            percentage,
            isExceeded: spentAmount > limitAmount,
        }
    });

    return (
        <section className='bg-gray-100 rounded-lg p-4 space-y-5 '>
            <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-xl'>Límites del Mes</h3>
                <ButtonExpenseLimit />
            </div>
            <div className='space-y-4'>
                {budgetItems.length === 0 ? (
                    <p className='text-sm text-slate-400 text-center py-6'>
                        No has configurado ningún límite de gasto para este mes.
                    </p>
                ) : (
                    budgetItems.map((item) => (
                        <ItemExpenseLimit key={item.id} item={item} />
                    ))
                )}
            </div>
        </section>
    )
}
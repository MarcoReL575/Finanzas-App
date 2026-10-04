import { SelectTransaction } from '../../transaction/types/types';
import { SelectLimiteGasto } from '../types/types';
import { getCategoryInfo } from './categoryInfo';

interface Props {
    budgets: SelectLimiteGasto[];
    transactions: SelectTransaction[];
    month: number;
    year: number;
}

export function calculateExpenseLimitItems({ budgets, transactions, month, year }: Props) {
    const currentBudgets = budgets.filter( (budget) => budget.month === month && budget.year === year ); 

    return currentBudgets.map((budget) => { 
        const spentAmount = transactions .filter((transaction) => { 
            const transactionDate = new Date( transaction.createdAt ); 
            return ( 
                transaction.categoria === budget.category && 
                transactionDate.getMonth() +1  === month && 
                transactionDate.getFullYear() === year && 
                (transaction.tipo === 'gasto' || !transaction.tipo) 
            ); 
        }) .reduce( (total, transaction) => total + Number(transaction.monto || 0), 0 ); 
        const limitAmount = Number(budget.monto); 
        const percentage = limitAmount > 0 
            ? Math.min( Math.round( (spentAmount / limitAmount) * 100 ), 100 ) 
            : 0; 
        const categoryInfo = getCategoryInfo( budget.category ); 
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
        }; 
    }); 
}
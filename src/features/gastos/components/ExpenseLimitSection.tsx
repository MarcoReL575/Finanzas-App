
import { gastoService } from '../services/gastoService';
import { transactionService } from '../../transaction/services/serviceTransaction';
import ExpenseLimitHeader from './ExpenseLimitHeader';
import { calculateExpenseLimitItems } from '../helper/expenseLimitCalculator';
import ExpenseLimitList from './ExpenseLimitList';

interface Props {
    userId: string;
}

export default async function ExpenseLimitSection({ userId }: Props) {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    
    const [{budgets}, { transactions }] = await Promise.all([
        gastoService.getUsersExpenseLimits(userId),
        transactionService.getTransactionsUser(userId)
    ]);

    const expenseLimitItems = calculateExpenseLimitItems({ 
        budgets, 
        transactions, 
        month: currentMonth, 
        year: currentYear, 
    });    

    return (
        <section className='bg-white rounded-lg p-4 space-y-5 '>
            <ExpenseLimitHeader />
            <ExpenseLimitList budgetItems={expenseLimitItems} />
        </section>
    )
}
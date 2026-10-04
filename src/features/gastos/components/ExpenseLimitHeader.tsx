import ButtonExpenseLimit from './ButtonExpenseLimit'

export default function ExpenseLimitHeader() {
  return (
    <div className='flex items-center justify-between'>
        <h3 className='font-semibold text-xl'>Límites del Mes</h3>
        <ButtonExpenseLimit />
    </div>
  )
}

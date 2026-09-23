import ChartBar from "@/src/features/gastos/components/ChartBar";
import { transactionService } from "@/src/features/transaction/services/serviceTransaction";
import { UserSession } from "@/src/lib/authServer";
import { redirect } from "next/navigation";

export default async function PerfilPage() {
  const session = await UserSession();
  if(!session?.user.id) redirect('/auth/signin');

  const { transactions } = await transactionService.getTransactionsUser(session.user.id);

  return (
    <section className='space-y-10'>
      <h1 className='text-4xl font-semibold text-center'>Mi Perfil</h1>
    </section>
  )
}

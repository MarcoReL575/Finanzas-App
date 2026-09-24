import FormUpdateInfoUser from "@/src/features/auth/components/FormUpdateInfoUser";
import { UserSession } from "@/src/lib/authServer";
import { redirect } from "next/navigation";

export default async function PerfilPage() {
  const session = await UserSession();
  if(!session?.user.id) redirect('/auth/signin');

  return (
    <section className='space-y-10'>
      <h1 className='text-4xl font-semibold text-center'>Cambiar Password</h1>
      <FormUpdateInfoUser />
    </section>
  )
}
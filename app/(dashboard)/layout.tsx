import HeaderApp from "@/src/shared/components/dashboard/HeaderApp"

type Props = {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
  return (
    <section className="flex flex-col items-center min-h-screen w-full px-4">
        <HeaderApp />
        <main className="w-full max-w-4xl mt-24 flex flex-col">
            {children}
        </main>
    </section>
  )
}
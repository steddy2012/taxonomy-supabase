import { redirect } from "next/navigation"

import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { getUser } from "@/app/supabase-server"

export const metadata = {
  title: "Purchases",
  description: "Manage your purchases.",
}

export default async function PurchasesPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Purchases Page" text="Manage your purchases." />
      <div className="grid gap-10">
        <p>Some info</p>
      </div>
    </DashboardShell>
  )
}

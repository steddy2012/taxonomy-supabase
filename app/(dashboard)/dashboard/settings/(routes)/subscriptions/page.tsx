import { redirect } from "next/navigation"

import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { getUser } from "@/app/supabase-server"

export const metadata = {
  title: "Subscriptions",
  description: "View our subscription plans.",
}

export default async function SubscriptionsPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Subscriptions Page"
        text="View our subscription plans."
      />
      <div className="grid gap-10">
        <p>Some info</p>
      </div>
    </DashboardShell>
  )
}

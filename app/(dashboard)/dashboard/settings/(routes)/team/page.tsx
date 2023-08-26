import { redirect } from "next/navigation"

import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { getUser } from "@/app/supabase-server"

export const metadata = {
  title: "Team",
  description: "View and edit your team.",
}

export default async function TeamPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Team Page" text="View and edit your team." />
      <div className="grid gap-10">
        <p>Some info</p>
      </div>
    </DashboardShell>
  )
}

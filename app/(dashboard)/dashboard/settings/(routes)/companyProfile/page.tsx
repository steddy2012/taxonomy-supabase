import { redirect } from "next/navigation"

import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { getUser } from "@/app/supabase-server"

export const metadata = {
  title: "Company Profile",
  description: "Manage company settings.",
}

export default async function CompanyProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Company Profile Page"
        text="Manage company settings."
      />
      <div className="grid gap-10">
        <p>Some info</p>
      </div>
    </DashboardShell>
  )
}

import { redirect } from "next/navigation"

import { UserInfoForm } from "@/components/forms/template/user-info-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { getUser } from "@/app/supabase-server"

export const metadata = {
  title: "User Profile",
  description: "View and edit your user details.",
}

export default async function UserProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="User Profile Page"
        text="View and edit your user details."
      />
      <div className="grid gap-10">
        <UserInfoForm
          user={{
            id: user.id,
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            phone_number: user.phone_number || "",
          }}
        />
      </div>
    </DashboardShell>
  )
}

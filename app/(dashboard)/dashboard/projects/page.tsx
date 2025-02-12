import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { FileUploadDialog } from "@/components/projectItems/file-upload-dialog"
import { ProjectCreateButton } from "@/components/projectItems/project-create-button"
import { ProjectItem } from "@/components/projectItems/project-item"
import { ProjectUploadForm } from "@/components/projectItems/project-upload-form"
import { DashboardShell } from "@/components/shell"
import { createServerSupabaseClient, getUser } from "@/app/supabase-server"

export const metadata = {
  title: "Projects Page",
  description: "View projects.",
}

export default async function ProjectsPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const supabase = createServerSupabaseClient()

  const { data: allFileUploads } = await supabase
    .from("all_file_uploads")
    .select(
      "id, lot_number, project_name, date_added, due_date, assigned_user, comment"
    )

  return (
    <DashboardShell>
      <DashboardHeader heading="Projects Page" text="View projects.">
        <FileUploadDialog
          project={{
            lot_number: allFileUploads?.lot_number || "",
            project_name: allFileUploads?.project_name || "",
            comment: allFileUploads?.comment || "",
          }}
        />
      </DashboardHeader>
      <div>
        {allFileUploads?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {allFileUploads.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>
              No projects uploaded
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any projects yet. Start by adding files.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}

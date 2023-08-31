import Link from "next/link"

import { AllFileUploads } from "@/types/main"
import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectOperations } from "@/components/projectItems/project-operations"

interface ProjectItemProps {
  project: Pick<
    AllFileUploads,
    "id" | "lot_number" | "assigned_user" | "date_added" | "project_name"
  >
}

export function ProjectItem({ project }: ProjectItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/editor/${project.id}`}
          className="font-semibold hover:underline"
        >
          Lot Number: {project.lot_number}
        </Link>
        <h1 className="font-semibold">Project: {project.project_name}</h1>
        <div>
          <p className="text-sm text-muted-foreground">
            Added on: {formatDate(new Date(project.date_added).toDateString())}
          </p>
        </div>
      </div>
      <ProjectOperations
        project={{ id: project.id, lot_number: project.lot_number }}
      />
    </div>
  )
}

ProjectItem.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}

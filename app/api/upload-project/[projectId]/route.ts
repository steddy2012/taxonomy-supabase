import { cookies } from "next/headers"
import { createRouteHandlerClient  } from "@supabase/auth-helpers-nextjs"
import * as z from "zod"

import { Database } from "@/types/db"
import { projectUploadSchema } from "@/lib/validations/project-upload"

const routeContextSchema = z.object({
  params: z.object({
    projectId: z.string(),
  }),
})

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const supabase = createRouteHandlerClient <Database>({
    cookies,
  })
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(params.projectId))) {
      return new Response(null, { status: 403 })
    }
    // Delete the post.
    await supabase.from("all_file_uploads").delete().eq("id", params.projectId)

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const supabase = createRouteHandlerClient <Database>({
    cookies,
  })
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(params.projectId))) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = projectUploadSchema.parse(json)

    // Update the post.
    // TODO: Implement sanitization for content.
    await supabase
      .from("all_file_uploads")
      .update({
        lot_number: body.lot_number, //change bost (const body =) from a json to what the user details form uses
        project_name: body.project_name, //change these to form inputs to whats in zod verification
        due_date: body.due_date,
        assigned_user: body.assigned_user,
      })
      .eq("id", params.projectId)
      .select()

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToPost(projectId: string) {
  const supabase = createRouteHandlerClient <Database>({
    cookies,
  })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { count } = await supabase
    .from("all_file_uploads")
    .select("*", { count: "exact", head: true })
    .eq("id", projectId)
    .eq("user_id", session?.user.id)

  return count ? count > 0 : false
}

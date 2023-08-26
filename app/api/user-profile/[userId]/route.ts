import { cookies } from "next/headers"
import { createRouteHandlerClient  } from "@supabase/auth-helpers-nextjs"
import { z } from "zod"

import { Database } from "@/types/db"
import { userProfileSchema } from "@/lib/validations/user-profile" // in order for form to submit you must connect the appropriate zod checks

const routeContextSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const supabase = createRouteHandlerClient <Database>({
    cookies,
  })
  try {
    // Validate the route context.
    const { params } = routeContextSchema.parse(context)

    // Ensure user is authentication and has access to this user.
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user || params.userId !== session?.user.id) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const body = await req.json()
    const payload = userProfileSchema.parse(body)

    // Concatenate first_name and last_name and insert it into the name field.
    const fullName = `${payload.first_name} ${payload.last_name}`;

    // Update the user's custom fields in your database.
    const { data, error } = await supabase
      .from("users") // Replace with your actual table name
      .update({
        name: fullName,
        first_name: payload.first_name,
        last_name: payload.last_name,
        phone_number: payload.phone_number,
      })
      .eq("id", session.user.id); // Update the record with the user's ID

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

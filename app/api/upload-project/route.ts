// Anything in api is what connects to the db 

import { cookies } from "next/headers"
import { createRouteHandlerClient  } from "@supabase/auth-helpers-nextjs"
import * as z from "zod"

import { Database } from "@/types/db"
import { RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"

const projectCreateSchema = z.object({
  project_name: z.string().min(1).max(255),
  lot_number: z.string().min(1).max(255),
  comment: z.string().min(0).max(255),
 //add duedate and other stuff after testing
})

export async function GET() {
  const supabase = createRouteHandlerClient <Database>({
    cookies,
  })
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { data: project } = await supabase
      .from("all_file_uploads")
      .select("id, lot_number, project_name, date_added, due_date, assigned_user, comment")
      .eq("user_id", session.user.id)
      .order("updated_at", { ascending: false })

    return new Response(JSON.stringify(project))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request) {

  const requestBody = await req.json()

  console.log(requestBody);


  const supabase = createRouteHandlerClient <Database>({
    cookies,
  });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();


    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

   // If user is on a free plan.
   // Check if user has reached limit of 3 posts.
    if (!subscriptionPlan?.isPro) {
      const { count } = await supabase
        .from("all_file_uploads")
        .select("*", { count: "exact", head: true })
        .eq("user_id)", user.id) //possibly change to ammount company can have. not just the user

      if (count && count >= 3) {
        return new Response("Requires Pro Plan", { status: 402 });
      }
    }


    const { data: project, error: err } = await supabase
      .from("all_file_uploads")
      .insert([{
        lot_number: requestBody.lot_number, //change bost (const body =) from a json to what the user details form uses
        project_name: requestBody.project_name, //change these to form inputs to whats in zod verification
        comment: requestBody.comment,
        user_id: session?.user?.id
      }])
      .select()

      if(err) {
        throw new Error("There was an error uploading to database")
      }

      return new Response(JSON.stringify(project))
  } catch (error) {
      console.log({error})
      if (error instanceof z.ZodError) {
        return new Response(JSON.stringify(error.issues), { status: 422 })
      }

      if (error instanceof RequiresProPlanError) {
        return new Response("Requires Pro Plan", { status: 402 });
      }

      return new Response(error.message || "Internal Server Error", { status: 500 })
  }



  // const supabase = createRouteHandlerClient <Database>({
  //   cookies,
  // })
  // try {
  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession()

  //   if (!session) {
  //     return new Response("Unauthorized", { status: 403 })
  //   }

  //   const { user } = session
  //   const subscriptionPlan = await getUserSubscriptionPlan(user.id)

  //   // If user is on a free plan.
  //   // Check if user has reached limit of 3 posts.
  //   if (!subscriptionPlan?.isPro) {
  //     const { count } = await supabase
  //       .from("all_file_uploads")
  //       .select("*", { count: "exact", head: true })
  //       .eq("user_id)", user.id)

  //     if (count && count >= 3) {
  //       throw new RequiresProPlanError()
  //     }
  //   }

  //   const json = await req.json()
  //   const body = projectCreateSchema.parse(json)

  //   const { data: project } = await supabase
  //     .from("all_file_uploads")
  //     .insert({
  //       lot_number: body.lot_number, //change bost (const body =) from a json to what the user details form uses
  //       project_name: body.project_name, //change these to form inputs to whats in zod verification
  //       comment: body.comment,
  //     })
  //     .select()

  //   return new Response(JSON.stringify(project))
  // } catch (error) {
    // if (error instanceof z.ZodError) {
    //   return new Response(JSON.stringify(error.issues), { status: 422 })
    // }

    // if (error instanceof RequiresProPlanError) {
    //   return new Response("Requires Pro Plan", { status: 402 })
    // }

  //   return new Response(null, { status: 500 })
  // }
}

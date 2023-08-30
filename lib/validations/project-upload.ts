import * as z from "zod"

export const projectUploadSchema = z.object({
  project_name: z.string().min(2).max(255),
  lot_number: z.string().min(2).max(255),
  comment: z.string().min(0).max(255),
  // due_date: z.string().min(0).max(255),
  // assigned_user: z.string().min(0).max(255),
 //add duedate
 //assign user
})

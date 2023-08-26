import * as z from "zod"

export const userProfileSchema = z.object({
  first_name: z.string().min(2).max(255),
  last_name: z.string().min(2).max(255),
  phone_number: z.string().min(12).max(12)
})

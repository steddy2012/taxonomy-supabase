"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { User } from "@/types/main"
import { cn } from "@/lib/utils"
import { userProfileSchema } from "@/lib/validations/user-profile"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "first_name" | "last_name" | "phone_number">
}

type FormData = z.infer<typeof userProfileSchema> // Always change zod schema from lib/validations

export function UserInfoForm({ user, className, ...props }: UserNameFormProps) {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone_number: user?.phone_number || "",
    },
  })
  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsSaving(true)
    // always change api connection for specific form or db connection
    const response = await fetch(`/api/user-profile/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
      }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your information was not updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Your information has been updated.",
    })

    router.refresh()
  }

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Your Name</CardTitle>
          <CardDescription>
            Please enter your full name or a display name you are comfortable
            with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Label className="sr-only" htmlFor="first_name">
              Name
            </Label>
            <Input
              id="first_name"
              className="w-[400px]"
              size={32}
              {...register("first_name")}
            />
            <Input
              id="last_name"
              className="w-[400px]"
              size={32}
              {...register("last_name")}
            />
            <Input
              id="phone_number"
              className="w-[400px]"
              size={32}
              {...register("phone_number")}
            />
            {/* Make sure to insert error posibilities for new inputs */}
            {errors?.first_name && (
              <p className="px-1 text-xs text-red-600">
                {errors.first_name.message}
              </p>
            )}
            {errors?.last_name && (
              <p className="px-1 text-xs text-red-600">
                {errors.last_name.message}
              </p>
            )}
            {errors?.phone_number && (
              <p className="px-1 text-xs text-red-600">
                {errors.phone_number.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <button
            type="submit"
            className={cn(buttonVariants(), className)}
            disabled={isSaving}
          >
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  )
}

//Always make sure to make a new api connection and add appropriate db inputs

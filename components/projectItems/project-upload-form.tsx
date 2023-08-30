"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { AllFileUploads } from "@/types/main"
import { cn } from "@/lib/utils"
import { projectUploadSchema } from "@/lib/validations/project-upload"
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

interface ProjectUploadFormProps extends React.HTMLAttributes<HTMLFormElement> {
  project: Pick<AllFileUploads,  "lot_number" | "project_name" | "comment">
}

type FormData = z.infer<typeof projectUploadSchema> // Always change zod schema from lib/validations

export function ProjectUploadForm({
  project,
  className,
  ...props
}: ProjectUploadFormProps) {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(projectUploadSchema),
    defaultValues: {
      lot_number: project?.lot_number || "",
      project_name: project?.project_name || "",
      comment: project?.comment || "",
    },
  })
  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    console.log("saved", data)
    setIsSaving(true)
    // // always change api connection for specific form or db connection
    const response = await fetch(`/api/upload-project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lot_number: data.lot_number,
        project_name: data.project_name,
        comment: data.comment,
      }),
    }).then((res) => console.log(res.json()));

    // console.log(response.json())

    setIsSaving(false)

    // if (!response?.ok) {
    //   return toast({
    //     title: "Something went wrong.",
    //     description: "Your project was not updated. Please try again.",
    //     variant: "destructive",
    //   })
    // }

    toast({
      description: "Your project has been uploaded.",
    })

    reset();
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
          <CardTitle>Project Upload</CardTitle>
          <CardDescription>
            Upload the project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label className="FormLabel">Lot Number:</Label>
          <div className="grid gap-1">
            <Input
              id="lot_number"
              className="w-[400px]"
              size={32}
              {...register("lot_number")}
            />
            {/* Make sure to insert error posibilities for new inputs */}
            {errors?.lot_number && (
              <p className="px-1 text-xs text-red-600">
                {errors.lot_number.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardContent>
          <Label className="FormLabel">Project Name:</Label>
          <div className="grid gap-1">
            <Input
              id="project_name"
              className="w-[400px]"
              size={32}
              {...register("project_name")}
            />
            {/* Make sure to insert error posibilities for new inputs */}
            {errors?.project_name && (
              <p className="px-1 text-xs text-red-600">
                {errors.project_name.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardContent>
          <Label className="FormLabel">Comment:</Label>
          <div className="grid gap-1">
            <Input
              id="comment"
              className="w-[400px]"
              size={32}
              {...register("comment")}
            />
            {/* Make sure to insert error posibilities for new inputs */}
            {errors?.comment && (
              <p className="px-1 text-xs text-red-600">
                {errors.comment.message}
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
            <span>Save Details</span>
          </button>
        </CardFooter>
        
      </Card>

      </form>
  
  )
}

//Always make sure to make a new api connection and add appropriate db inputs

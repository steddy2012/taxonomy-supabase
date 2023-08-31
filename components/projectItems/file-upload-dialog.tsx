"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { AllFileUploads } from "@/types/main"
import { cn } from "@/lib/utils"
import { projectUploadSchema } from "@/lib/validations/project-upload"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface ProjectUploadFormProps extends React.HTMLAttributes<HTMLFormElement> {
  project: Pick<AllFileUploads, "lot_number" | "project_name" | "comment">
}

type FormData = z.infer<typeof projectUploadSchema> // Always change zod schema from lib/validations

export function FileUploadDialog({
  project,
  className,
  ...props
}: ProjectUploadFormProps) {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
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
    try {
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
      })

      setIsSaving(false)

      if (!response.ok) {
        if (response.status === 402) {
          return toast({
            title: "Limit of 3 projects reached.",
            description: "Please upgrade to the PRO plan.",
            variant: "destructive",
          })
        } else {
          return toast({
            title: "Something went wrong.",
            description: "Your project was not created. Please try again.",
            variant: "destructive",
          })
        }
      }

      toast({
        description: "Your project has been uploaded.",
      })

      reset()
      router.refresh()
    } catch (error) {
      console.error(error)

      toast({
        title: "Something went wrong.",
        description:
          "There was an error while processing your request. Please try again later.",
        variant: "destructive",
      })

      setIsSaving(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          {" "}
          <Icons.add className="mr-2 h-4 w-4" /> Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form
          className={cn(className)}
          onSubmit={handleSubmit(onSubmit)}
          {...props}
        >
          <div className="grid gap-4 py-4">
            <div>
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
            </div>
            <div>
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
            </div>
            <div>
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
            </div>
          </div>
          <DialogFooter>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import { updateApplication } from "@/api/applications"
import ApplicationForm from "@/components/application/ApplicationForm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Application } from "@/types/application"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SquarePen } from "lucide-react"
import { useState } from "react"

const formId = "edit-application-form"

interface EditDialogProps {
  data: Application
}

const EditDialog = ({ data }: EditDialogProps) => {

  const [open, setOpen] = useState<boolean>(false)
  const { id } = data

  const queryClient = useQueryClient()
  const updateData = useMutation({
    mutationFn: updateApplication,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['applications'] })
      setOpen(false)
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="編集"><SquarePen /></Button>} />
      <DialogContent>

        <DialogHeader>
          <DialogTitle>応募情報の編集</DialogTitle>
          <DialogDescription>
            応募先の情報を編集してください
          </DialogDescription>
        </DialogHeader>

        {open && (
          <ApplicationForm
            defaultValue={data}
            onSubmit={(item) => updateData.mutate({ ...item, id })}
            formId={formId}
          />
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline">
            キャンセル
          </Button>} />
          <Button
            type="submit"
            form={formId}
            disabled={updateData.isPending}>
            保存
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog >
  )

}

export default EditDialog
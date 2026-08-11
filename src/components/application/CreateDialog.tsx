import { createApplication } from "@/api/applications"
import ApplicationForm from "@/components/application/ApplicationForm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

const formId = "create-application-form"

const CreateDialog = () => {

  const [open, setOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()
  const createData = useMutation({
    mutationFn: createApplication,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['applications'] })
      setOpen(false)
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger render={<Button>応募を追加</Button>} />
      <DialogContent>

        <DialogHeader>
          <DialogTitle>応募情報の登録</DialogTitle>
          <DialogDescription>
            応募先の情報を入力してください
          </DialogDescription>
        </DialogHeader>

        {open && (
          <ApplicationForm onSubmit={(item) => createData.mutate(item)} formId={formId} />
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline">
            キャンセル
          </Button>} />
          <Button
            type="submit"
            form={formId}
            disabled={createData.isPending}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  )

}

export default CreateDialog
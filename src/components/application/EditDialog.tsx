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
  const { id, ...formData } = data

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
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="수정"><SquarePen /></Button>} />
      <DialogContent>

        <DialogHeader>
          <DialogTitle>지원 정보 수정하기</DialogTitle>
          <DialogDescription>
            지원한 회사, 날짜, 경로, 상태 등을 수정하세요.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <ApplicationForm defaultValue={formData} onSubmit={(item) => updateData.mutate({ ...item, id })} formId={formId} />
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline">닫기</Button>} />
          <Button
            type="submit"
            form={formId}
            disabled={updateData.isPending}>
            저장
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog >
  )

}

export default EditDialog
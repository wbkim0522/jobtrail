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

      <DialogTrigger render={<Button>등록하기</Button>} />
      <DialogContent>

        <DialogHeader>
          <DialogTitle>지원 정보 등록하기</DialogTitle>
          <DialogDescription>
            지원한 회사, 날짜, 경로, 상태 등을 입력하세요.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <ApplicationForm onSubmit={(item) => createData.mutate(item)} formId={formId} />
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline">닫기</Button>} />
          <Button
            type="submit"
            form={formId}
            disabled={createData.isPending}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  )

}

export default CreateDialog
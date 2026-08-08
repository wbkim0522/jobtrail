import { deleteApplication } from "@/api/applications"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { Application } from "@/types/application"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2, TriangleAlertIcon } from "lucide-react"
import { useState } from "react"

interface DeleteDialogProps {
  data: Application;
}

const DeleteDialog = ({ data }: DeleteDialogProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const queryClient = useQueryClient();
  const deleteData = useMutation({
    mutationFn: deleteApplication,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['applications'] })
      setOpen(false)
    }
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={
        <Button variant="ghost" size="icon" aria-label="삭제">
          <Trash2 />
        </Button>
      } />

      <AlertDialogContent size="sm">

        <AlertDialogHeader>
          <AlertDialogMedia>
            <TriangleAlertIcon color="red" />
          </AlertDialogMedia>
          <AlertDialogTitle>지원 정보 삭제하기</AlertDialogTitle>
          <AlertDialogDescription>
            {data.company} <br />
            {data.appliedAt} / {data.source} <br />
            선택한 회사정보를 삭제하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteData.isPending}
            onClick={() => { deleteData.mutate(data.id) }}>
            삭제하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteDialog
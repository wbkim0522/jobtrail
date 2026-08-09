import { updateApplication } from "@/api/applications"
import StatusSelect from "@/components/application/StatusSelect"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Application } from "@/types/application"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SquarePen } from "lucide-react"
import { useState } from "react"

interface EditDialogProps {
  data: Application
}

const EditDialog = ({ data }: EditDialogProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const [targetData, setTargetData] = useState<Application>(data);
  const queryClient = useQueryClient()
  const updateData = useMutation({
    mutationFn: updateApplication,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['applications'] })
      setOpen(false)
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => {
      if (v) setTargetData(data)
      setOpen(v)
    }}>
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="수정"><SquarePen /></Button>} />
      <DialogContent>
        < DialogHeader >
          <DialogTitle>지원 정보 수정하기</DialogTitle>
          <DialogDescription>
            지원한 회사, 날짜, 경로, 상태 등을 수정하세요.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <Label htmlFor="company">회사</Label>
            <Input id="company" value={targetData.company}
              onChange={(e) => setTargetData({ ...targetData, company: e.target.value })} />
          </Field>
          <Field>
            <Label htmlFor="appliedAt">날짜</Label>
            <Input id="appliedAt" type="date" value={targetData.appliedAt ?? ''}
              onChange={(e) => setTargetData({ ...targetData, appliedAt: e.target.value })} />
          </Field>
          <Field>
            <Label htmlFor="source">경로</Label>
            <Input id="source" value={targetData.source}
              onChange={(e) => setTargetData({ ...targetData, source: e.target.value })} />
          </Field>
          <Field>
            <Label htmlFor="status">상태</Label>
            <StatusSelect value={targetData.status} onChange={(e) => { setTargetData({ ...targetData, status: e }) }} />
          </Field>
          <Field>
            <Label htmlFor="note">비고</Label>
            <Textarea placeholder="그 외 정보를 입력하세요" value={targetData.note}
              onChange={(e) => setTargetData({ ...targetData, note: e.target.value })} />
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">닫기</Button>} />
          <Button onClick={() => updateData.mutate(targetData)}>
            저장
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog >
  )
}

export default EditDialog
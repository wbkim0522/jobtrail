import { createApplication } from "@/api/applications"
import StatusSelect from "@/components/application/StatusSelect"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getToday } from "@/lib/date"
import type { NewAppliaction } from "@/types/application"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

const getInitialData = (): NewAppliaction => ({
  company: "",
  appliedAt: getToday(),     // 호출 시점의 오늘
  source: "",
  status: "draft",
  note: "",
})

const CreateDialog = () => {

  const [open, setOpen] = useState<boolean>(false)
  const [data, setData] = useState<NewAppliaction>(getInitialData)

  const queryClient = useQueryClient()
  const createData = useMutation({
    mutationFn: createApplication,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['applications'] })
      setOpen(false)
      setData(getInitialData())
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

        <FieldGroup>
          <Field>
            <Label htmlFor="company">회사</Label>
            <Input id="company" value={data.company}
              onChange={(e) => setData({ ...data, company: e.target.value })} />
          </Field>
          <Field>
            <Label htmlFor="appliedAt">날짜</Label>
            <Input id="appliedAt" type="date" value={data.appliedAt ?? ''}
              onChange={(e) => setData({ ...data, appliedAt: e.target.value })} />
          </Field>
          <Field>
            <Label htmlFor="source">경로</Label>
            <Input id="source" value={data.source}
              onChange={(e) => setData({ ...data, source: e.target.value })} />
          </Field>
          <Field>
            <Label htmlFor="status">상태</Label>
            <StatusSelect value={data.status} onChange={(e) => { setData({ ...data, status: e }) }} />
          </Field>
          <Field>
            <Label htmlFor="note">비고</Label>
            <Textarea placeholder="그 외 정보를 입력하세요" value={data.note}
              onChange={(e) => setData({ ...data, note: e.target.value })} />
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">닫기</Button>} />
          <Button onClick={() => createData.mutate(data)}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

}

export default CreateDialog
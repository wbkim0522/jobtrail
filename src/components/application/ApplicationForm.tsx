
import StatusSelect from '@/components/application/StatusSelect'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getToday } from '@/lib/date'
import type { NewApplication } from '@/types/application'
import { useState } from 'react'

const getInitialData = (): NewApplication => ({
  company: "",
  appliedAt: getToday(),     // 호출 시점의 오늘
  source: "",
  status: "draft",
  note: "",
})

interface ApplicationFormProps {
  defaultValue?: NewApplication
  onSubmit: (values: NewApplication) => void
  formId: string
}

const ApplicationForm = ({ defaultValue, onSubmit, formId }: ApplicationFormProps) => {

  const [data, setData] = useState<NewApplication>(defaultValue ?? getInitialData())

  return (
    <form id={formId} onSubmit={(e) => {
      e.preventDefault();
      onSubmit(data);
    }}>
      <FieldGroup>
        <Field>
          <Label htmlFor="company">会社</Label>
          <Input id="company" value={data.company}
            onChange={(e) => setData({ ...data, company: e.target.value })} />
        </Field>
        <Field>
          <Label htmlFor="appliedAt">応募日</Label>
          <Input id="appliedAt" type="date" value={data.appliedAt ?? ''}
            onChange={(e) => setData({ ...data, appliedAt: e.target.value })} />
        </Field>
        <Field>
          <Label htmlFor="source">応募経路</Label>
          <Input id="source" value={data.source}
            onChange={(e) => setData({ ...data, source: e.target.value })} />
        </Field>
        <Field>
          <Label htmlFor="status">ステータス</Label>
          <StatusSelect value={data.status} onChange={(e) => { setData({ ...data, status: e }) }} />
        </Field>
        <Field>
          <Label htmlFor="note">備考</Label>
          <Textarea placeholder="その他の情報を入力" value={data.note}
            onChange={(e) => setData({ ...data, note: e.target.value })} />
        </Field>
      </FieldGroup>
    </form>
  )
}

export default ApplicationForm
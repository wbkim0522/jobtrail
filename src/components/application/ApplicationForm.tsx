import StatusSelect from '@/components/application/StatusSelect'
import { Field, FieldError, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getToday } from '@/lib/date'
import type { Application, NewApplication } from '@/types/application'
import { useState } from 'react'

const getInitialData = (): NewApplication => ({
  company: "",
  appliedAt: getToday(),     // 호출 시점의 오늘
  source: "",
  status: "draft",
  note: "",
})

interface ApplicationFormProps {
  applications: Application[]
  defaultValue?: Application
  onSubmit: (values: NewApplication) => void
  formId: string
}

const ApplicationForm = ({ applications, defaultValue, onSubmit, formId }: ApplicationFormProps) => {

  const [newData, setNewData] = useState<NewApplication>(defaultValue ?? getInitialData());
  const duplicate = (applications).find((item) => (
    item.company === newData.company &&
    item.company !== '' &&
    item.id !== defaultValue?.id
  ))

  return (
    <form id={formId} onSubmit={(e) => {
      e.preventDefault();
      onSubmit(newData);
    }}>
      <FieldGroup>
        <Field className='relative'>
          <Label htmlFor="company">会社</Label>
          <Input id="company" value={newData.company}
            onChange={(e) => { setNewData({ ...newData, company: e.target.value }) }} />
          {duplicate && (
            <FieldError className='absolute -bottom-5.5 right-1 text-xs animate-in fade-in text-right'>
              {duplicate.appliedAt ? `${duplicate.appliedAt}に登録済みです` : "登録済みです"}
            </FieldError>
          )}
        </Field>
        <Field>
          <Label htmlFor="appliedAt">応募日</Label>
          <Input id="appliedAt" type="date" value={newData.appliedAt ?? ''}
            onChange={(e) => setNewData({ ...newData, appliedAt: e.target.value || null })} />
        </Field>
        <Field>
          <Label htmlFor="source">応募経路</Label>
          <Input id="source" value={newData.source}
            onChange={(e) => setNewData({ ...newData, source: e.target.value })} />
        </Field>
        <Field>
          <Label htmlFor="status">ステータス</Label>
          <StatusSelect value={newData.status} onChange={(e) => { setNewData({ ...newData, status: e }) }} />
        </Field>
        <Field>
          <Label htmlFor="note">備考</Label>
          <Textarea placeholder="その他の情報を入力" value={newData.note}
            onChange={(e) => setNewData({ ...newData, note: e.target.value })} />
        </Field>
      </FieldGroup>
    </form>
  )
}

export default ApplicationForm
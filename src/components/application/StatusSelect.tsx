import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { APPLICATION_STATUS, type ApplicationStatus } from "@/constants/status";

const items = Object.entries(APPLICATION_STATUS).map(([key, config]) => ({ value: key, label: config.label }));

interface StatusSelectProps {
  value: ApplicationStatus
  onChange: (value: ApplicationStatus) => void
}

const StatusSelect = ({ value, onChange }: StatusSelectProps) => {
  return (
    <Select items={items} value={value}
      onValueChange={(e) => onChange(e as ApplicationStatus)}>
      <SelectTrigger>
        <SelectValue placeholder="상태를 선택하세요" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          {
            items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default StatusSelect
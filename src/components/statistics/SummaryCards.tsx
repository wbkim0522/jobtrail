import { Card, CardContent } from "@/components/ui/card";
import type { Summary } from "@/lib/stats"
interface SummaryCardsProps {
  data: Summary;
}

const SummaryCards = ({ data }: SummaryCardsProps) => {
  const items = [
    { label: "総応募数", value: data.total, color: ''},
    { label: "選考中", value: data.inProgress, color: 'border-l-blue-400'},
    { label: "不合格", value: data.rejected, color: 'border-l-rose-400'},
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className={`border-l-4 ${item.color}`}>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-2xl font-bold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )

}

export default SummaryCards
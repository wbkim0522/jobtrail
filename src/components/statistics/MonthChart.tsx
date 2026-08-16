import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import type { MonthlyCount } from '@/lib/stats'
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from 'recharts'

const chartConfig = {
  count: { label: "件数", color: "var(--color-blue-400)" },
}

interface MonthChartProps {
  data: MonthlyCount[]
}

const MonthChart = ({ data }: MonthChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>月別応募数</CardTitle>
        <CardDescription>応募日ベース。準備中は含まない</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <LineChart data={data} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} padding={{ left: 24, right: 24 }} />
            <YAxis tickLine={false} axisLine={false} />
            <Line dataKey="count" stroke="var(--color-blue-400)" strokeWidth={2} dot={{ r: 4 }}>
              <LabelList dataKey="count" position="top" offset={12} />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>

  )
}

export default MonthChart
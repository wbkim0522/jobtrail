import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { APPLICATION_STATUS } from "@/constants/status"
import type { StatusCount } from "@/lib/stats"
import { Bar, BarChart, CartesianGrid, LabelList, Rectangle, XAxis, YAxis, type BarShapeProps } from "recharts"

const chartConfig = {
  count: { label: "件数", color: "var(--chart-1)" },
}

interface StatusChartProps {
  data: StatusCount[]
}

const StatusChart = ({ data }: StatusChartProps) => {

  const configs = data.map((item) => APPLICATION_STATUS[item.status])

  const renderBar = (props: BarShapeProps) => (
    <Rectangle {...props} fill={configs[props.index].color} radius={[4, 4, 0, 0]} />
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>状態分布</CardTitle>
        <CardDescription>選考段階順</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-54 w-full">
          <BarChart data={data} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="status" tickLine={false} axisLine={false} tickFormatter={(_, index) => configs[index].label} />
            <YAxis tickLine={false} axisLine={false} />
            <Bar dataKey="count" shape={renderBar}>
              <LabelList dataKey="count" position="top" className="fill-foreground" />
            </Bar>
          </BarChart>
        </ChartContainer>

      </CardContent>
    </Card>

  )
}

export default StatusChart
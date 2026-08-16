import MonthChart from "@/components/statistics/MonthChart";
import StatusChart from "@/components/statistics/StatusChart";
import SummaryCards from "@/components/statistics/SummaryCards";
import { useApplications } from "@/hooks/useApplications"
import { countByMonth, countByStatus, summarize } from "@/lib/stats"

const StatisticsPage = () => {

  const { data } = useApplications();

  return (
    <main className="flex flex-col gap-4">
      <SummaryCards data={summarize(data)}/>
      <StatusChart data={countByStatus(data)} />
      <MonthChart data={countByMonth(data)} />
    </main>
  )
}

export default StatisticsPage
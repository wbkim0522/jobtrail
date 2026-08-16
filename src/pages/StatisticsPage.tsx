import MonthChart from "@/components/statistics/MonthChart";
import StatusChart from "@/components/statistics/StatusChart";
import SummaryCards from "@/components/statistics/SummaryCards";
import { useApplications } from "@/hooks/useApplications"
import { countByMonth, countByStatus, summarize } from "@/lib/stats"

const StatisticsPage = () => {

  const { applications } = useApplications();

  return (
    <main className="flex flex-col gap-4">
      <SummaryCards data={summarize(applications)}/>
      <StatusChart data={countByStatus(applications)} />
      <MonthChart data={countByMonth(applications)} />
    </main>
  )
}

export default StatisticsPage
import { fetchApplications } from "@/api/applications"
import ApplicationTable from "@/components/application/ApplicationTable"
import { useQuery } from "@tanstack/react-query"

const App = () => {

  const reuslt = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications
  });

  if (reuslt.isLoading) return <div>로딩중...</div>

  return (
    <>
      <ApplicationTable data={reuslt.data ?? []} />
    </>
  )
}

export default App

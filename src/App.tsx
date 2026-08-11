import { fetchApplications } from "@/api/applications"
import ApplicationTable from "@/components/application/ApplicationTable"
import CreateDialog from "@/components/application/CreateDialog"
import { useQuery } from "@tanstack/react-query"

const App = () => {
  console.log(import.meta.env.VITE_SUPABASE_URL)
  console.log(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
  const reuslt = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications
  });

  if (reuslt.isLoading) return <div>로딩중...</div>

  return (
    <>
      <CreateDialog />
      <ApplicationTable data={reuslt.data ?? []} />
    </>
  )
}

export default App

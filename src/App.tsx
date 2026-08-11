import { fetchApplications } from "@/api/applications"
import ApplicationTable from "@/components/application/ApplicationTable"
import CreateDialog from "@/components/application/CreateDialog"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

const App = () => {

  const { data, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">

        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Jobtrail</h1>
          </div>
          <CreateDialog />
        </header>

        <main>
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ApplicationTable data={data ?? []} />
          )}

        </main>

      </div>
    </div>
  )
}

export default App

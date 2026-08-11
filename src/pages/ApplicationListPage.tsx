import { fetchApplications } from "@/api/applications"
import ApplicationTable from "@/components/application/ApplicationTable"
import CreateDialog from "@/components/application/CreateDialog"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"
import { Loader2, LogOut } from "lucide-react"


const ApplicationListPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications
  });

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">

        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Jobtrail</h1>
          </div>
          <div className="flex items-center gap-2">
            <CreateDialog />
            <Button
              size="icon"
              aria-label="ログアウト"
              onClick={handleLogout}>
              <LogOut />
            </Button>
          </div>
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

export default ApplicationListPage
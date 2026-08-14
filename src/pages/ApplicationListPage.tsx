import { fetchApplications } from "@/api/applications"
import ApplicationTable from "@/components/application/ApplicationTable"
import CreateDialog from "@/components/application/CreateDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"
import { Loader2, LogOut, Search } from "lucide-react"
import { useState } from "react"


const ApplicationListPage = () => {

  const { data, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications
  });

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const [keyword, setKeyword] = useState('');

  const filtered = (data ?? []).filter((item) =>
    item.company.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">

        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Jobtrail</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              aria-label="ログアウト"
              onClick={handleLogout}>
              <LogOut />
            </Button>
          </div>
        </header>

        <main className="flex flex-col gap-4">
          {/* searchBar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="会社名で検索"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-10"
              />
            </div>
            <CreateDialog />
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ApplicationTable data={filtered} />
          )}

        </main>

      </div>
    </div>
  )
}

export default ApplicationListPage
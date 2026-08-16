import ApplicationTable from "@/components/application/ApplicationTable"
import CreateDialog from "@/components/application/CreateDialog"
import { Input } from "@/components/ui/input"
import { useApplications } from "@/hooks/useApplications"
import { Loader2, Search } from "lucide-react"
import { useState } from "react"


const ApplicationListPage = () => {

  const { applications, isLoading } = useApplications();

  const [keyword, setKeyword] = useState('');

  const filtered = (applications).filter((item) =>
    item.company.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
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
  )
}

export default ApplicationListPage
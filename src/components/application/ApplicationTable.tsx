import DeleteDialog from "@/components/application/DeleteDialog"
import EditDialog from "@/components/application/EditDialog"
import StatusBadge from "@/components/application/StatusBadge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Application } from "@/types/application"


interface TableProps {
  data: Application[]
}

const ApplicationTable = ({ data }: TableProps) => {

  return (
    <section className="rounded-md border overflow-hidden">
      <Table className="table-fixed" containerClassName="max-h-[calc(100vh-140px)] overflow-y-auto">
        <TableHeader className="sticky top-0 z-10 border-b bg-muted">
          <TableRow>
            <TableHead className="w-50">会社</TableHead>
            <TableHead className="w-25 text-center">応募日</TableHead>
            <TableHead className="w-35">応募経路</TableHead>
            <TableHead className="w-23 text-center">ステータス</TableHead>
            <TableHead>備考</TableHead>
            <TableHead className="w-21"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {
            data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  応募履歴がありません
                </TableCell>
              </TableRow>
            ) : (
              data.map((rowData) => (
                <TableRow key={rowData.id}>
                  <TableCell className="truncate">
                    {rowData.company}
                  </TableCell>
                  <TableCell className="text-center">
                    {rowData.appliedAt ?? '-'}
                  </TableCell>
                  <TableCell>
                    {rowData.source}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={rowData.status} />
                  </TableCell>
                  <TableCell className="truncate">
                    {rowData.note}
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <EditDialog data={rowData} />
                    <DeleteDialog data={rowData} />
                  </TableCell>
                </TableRow>
              ))
            )
          }
        </TableBody>

      </Table>
    </section>

  )
}

export default ApplicationTable
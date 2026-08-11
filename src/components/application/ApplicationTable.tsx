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
      <Table containerClassName="max-h-[calc(100vh-160px)] overflow-y-auto">
        <TableHeader className="sticky top-0 z-10 border-b bg-muted">
          <TableRow>
            <TableHead>会社</TableHead>
            <TableHead>応募日</TableHead>
            <TableHead>応募経路</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead>備考</TableHead>
            <TableHead></TableHead>
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
                  <TableCell>
                    {rowData.company}
                  </TableCell>
                  <TableCell>
                    {rowData.appliedAt ?? '-'}
                  </TableCell>
                  <TableCell>
                    {rowData.source}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={rowData.status} />
                  </TableCell>
                  <TableCell>
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
import StatusBadge from "@/components/application/StatusBadge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Application } from "@/types/application"

interface TableProps {
  data: Application[]
}

const ApplicationTable = ({ data }: TableProps) => {

  return (
    <Table>

      <TableHeader>
        <TableRow>
          <TableHead>회사</TableHead>
          <TableHead>날짜</TableHead>
          <TableHead>지원처</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>비고</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {
          data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                지원 이력이 없습니다
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
              </TableRow>
            ))
          )
        }
      </TableBody>

    </Table>
  )
}

export default ApplicationTable
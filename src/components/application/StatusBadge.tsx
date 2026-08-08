import { Badge } from "@/components/ui/badge"
import { APPLICATION_STATUS, type ApplicationStatus } from "@/constants/status"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const statusBadgeVariants = cva(
	"border font-medium transition-colors min-w-16",
	{
		variants: {
			status: {
				draft: "bg-slate-100 text-slate-700 border-slate-200",
				applied: "bg-blue-100 text-blue-700 border-blue-200",
				screening: "bg-indigo-100 text-indigo-700 border-indigo-200",
				interview: "bg-violet-100 text-violet-700 border-violet-200",
				offer: "bg-emerald-100 text-emerald-700 border-emerald-200",
				rejected: "bg-rose-100 text-rose-700 border-rose-200",
				withdrawn: "bg-gray-200 text-gray-500 border-gray-300",
			} satisfies Record<ApplicationStatus, string>,
		},
	}
)

interface statusBadgeProps {
	status: ApplicationStatus
}

const StatusBadge = ({ status }: statusBadgeProps) => {

	const config = APPLICATION_STATUS[status]

	return (
		<Badge
			className={cn(statusBadgeVariants({ status }))}
		>
			{config.label}
		</Badge>
	)
}

export default StatusBadge
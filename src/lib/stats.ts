import {
  APPLICATION_STATUS,
  isApplicationStatus,
  type ApplicationStatus,
} from "@/constants/status"
import type { Application } from "@/types/application"

// Month
export type MonthlyCount = { month: string; count: number }
export const countByMonth = (applications: Application[]): MonthlyCount[] => {
  const counts = new Map<string, number>()
  const toMonthKey = (d: Date) => {
    const yaer = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    return `${yaer}-${month}`
  }

  for (const app of applications) {
    const month = app.appliedAt?.slice(0, 7) // yyyy-MM
    if (!month) continue

    counts.set(month, (counts.get(month) ?? 0) + 1)
  }

  const months = [...counts.keys()].sort()
  if (months.length === 0) return []

  const first = months[0]
  const last = months[months.length - 1]
  const [year, month] = first.split("-").map(Number)
  const cursor = new Date(year, month - 1)
  const result: MonthlyCount[] = []

  while (toMonthKey(cursor) <= last) {
    const key = toMonthKey(cursor)
    result.push({ month: key, count: counts.get(key) ?? 0 })
    cursor.setMonth(cursor.getMonth() + 1)
  }

  return result
}

// Status
export type StatusCount = { status: ApplicationStatus; count: number }
export const countByStatus = (applications: Application[]): StatusCount[] => {
  const counts = new Map<ApplicationStatus, number>()

  for (const app of applications) {
    const status = app.status
    counts.set(status, (counts.get(status) ?? 0) + 1)
  }

  const statuses = Object.keys(APPLICATION_STATUS).filter(isApplicationStatus)
  const result = statuses.map((status) => ({
    status,
    count: counts.get(status) ?? 0,
  }))

  return result
}

// Summary
export type Summary = {
  total: number
  inProgress: number
  rejected: number
}

export const summarize = (applications: Application[]): Summary => {
  const counts = countByStatus(applications)

  const get = (status: ApplicationStatus) =>
    counts.find((item) => item.status === status)?.count ?? 0

  return {
    total: applications.length - get("draft"),
    inProgress: get("applied") + get("screening") + get("interview"),
    rejected: get("rejected"),
  }
}

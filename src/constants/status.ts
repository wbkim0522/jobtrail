export const APPLICATION_STATUS = {
  draft: { label: "準備中", order: 0, color: "var(--color-slate-400)" },
  applied: { label: "応募済み", order: 1, color: "var(--color-blue-400)" },
  screening: { label: "書類選考", order: 2, color: "var(--color-indigo-400)" },
  interview: { label: "面接", order: 3, color: "var(--color-violet-400)" },
  offer: { label: "内定", order: 4, color: "var(--color-emerald-400)" },
  rejected: { label: "不合格", order: 5, color: "var(--color-rose-400)" },
  withdrawn: { label: "辞退", order: 6, color: "var(--color-gray-400)" },
} as const

export type ApplicationStatus = keyof typeof APPLICATION_STATUS
export const isApplicationStatus = (value: string): value is ApplicationStatus => value in APPLICATION_STATUS;
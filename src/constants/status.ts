export const APPLICATION_STATUS = {
  draft: { label: "準備中", order: 0 },
  applied: { label: "応募済み", order: 1 },
  screening: { label: "書類選考", order: 2 },
  interview: { label: "面接", order: 3 },
  offer: { label: "内定", order: 4 },
  rejected: { label: "不合格", order: 5 },
  withdrawn: { label: "辞退", order: 6 },
} as const

export type ApplicationStatus = keyof typeof APPLICATION_STATUS
export const isApplicationStatus = (value: string): value is ApplicationStatus => value in APPLICATION_STATUS;
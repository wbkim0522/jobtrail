export const APPLICATION_STATUS = {
  draft: { label: "준비중", order: 0 },
  applied: { label: "지원완료", order: 1 },
  screening: { label: "서류전형", order: 2 },
  interview: { label: "면접", order: 3 },
  offer: { label: "내정", order: 4 },
  rejected: { label: "불합격", order: 5 },
  withdrawn: { label: "사퇴", order: 6 },
} as const

export type ApplicationStatus = keyof typeof APPLICATION_STATUS
import type { ApplicationStatus } from "@/constants/status"

// 조회용 (Read)
export type Application = {
	id: string
	company: string
	appliedAt: string | null
	source: string
	status: ApplicationStatus
	note: string
}

// 등록용 (Create)
export type NewAppliaction = Omit<Application, 'id'>

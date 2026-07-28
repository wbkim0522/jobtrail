import type { Application, NewAppliaction } from "@/types/application"

export const db = {
  applications: [] as Application[],
}

export const fetchApplications = async (): Promise<Application[]> => {
  // fake api call delay
  await new Promise((resolve) => {
    setTimeout(resolve, 300)
  })

  return db.applications
}

export const createApplication = async (
  input: NewAppliaction,
): Promise<Application> => {
  // fake api call delay
  await new Promise((r) => setTimeout(r, 300))

  const newData = {
    ...input,
    id: crypto.randomUUID(),
  }

  db.applications = [...db.applications, newData]

  return newData
}

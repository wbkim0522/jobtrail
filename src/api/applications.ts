import { mockApplications } from "@/mocks/mockApplications"
import type { Application, NewApplication } from "@/types/application"

export const db = {
  applications: mockApplications,
}

// read
export const fetchApplications = async (): Promise<Application[]> => {
  // fake api call delay
  await new Promise((resolve) => {
    setTimeout(resolve, 300)
  })

  return db.applications
}

// create
export const createApplication = async (
  input: NewApplication,
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

// delete
export const deleteApplication = async (id: string): Promise<void> => {
  // fake api call delay
  await new Promise((r) => setTimeout(r, 300))

  const newList = db.applications.filter((item) => item.id !== id)

  db.applications = newList
}

// update
export const updateApplication = async (data: Application): Promise<void> => {
  // fake api call delay
  await new Promise((r) => setTimeout(r, 300))

  const updateList = db.applications.map((item) => (item.id === data.id) ? data : item)

  db.applications = updateList
}

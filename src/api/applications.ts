
import { mockApplications } from "@/mocks/mockApplications"
import type { Application, NewAppliaction } from "@/types/application"

export const fetchApplications = async (): Promise<Application[]> => {
    await new Promise((resolve) => {
        setTimeout(resolve, 300)
    })

    return mockApplications
}

export const createApplication = async (input: NewAppliaction) : Promise<Application> => {

    const newData = {
        ...input,
        id: crypto.randomUUID()
    }

    mockApplications.push(newData);

    return newData
}
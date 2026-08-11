import { supabase } from "@/lib/supabase"
import type { Application, NewApplication } from "@/types/application"
import type { Database } from "@/types/database.types"

type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"]
type ApplicationInsert = Database["public"]["Tables"]["applications"]["Insert"]

// read
export const fetchApplications = async (): Promise<Application[]> => {
  const { data, error } = await supabase.from("applications").select()
  if (error) throw error

  return data.map(toApplication)
}

// create
export const createApplication = async (
  input: NewApplication,
): Promise<Application> => {
  const { data, error } = await supabase
    .from("applications")
    .insert(toRow(input))
    .select()
    .single()

  if (error) throw error

  return toApplication(data)
}

// delete
export const deleteApplication = async (id: string): Promise<void> => {
  const { error } = await supabase.from("applications").delete().eq("id", id)
  if (error) throw error
}

// update
export const updateApplication = async (data: Application): Promise<void> => {
  const { error } = await supabase
    .from("applications")
    .update(toRow(data))
    .eq('id', data.id);

  if (error) throw error
}

// DB uses snake_case; convert at the boundary
const toApplication = (row: ApplicationRow): Application => ({
  id: row.id,
  company: row.company,
  status: row.status,
  appliedAt: row.applied_at,
  source: row.source,
  note: row.note,
})

const toRow = (application: NewApplication): ApplicationInsert => ({
  company: application.company,
  status: application.status,
  applied_at: application.appliedAt,
  source: application.source,
  note: application.note,
})

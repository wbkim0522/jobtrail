import { fetchApplications } from "@/api/applications"
import { useQuery } from "@tanstack/react-query"

export const useApplications = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  })

  return { data: data ?? [], isLoading }
}

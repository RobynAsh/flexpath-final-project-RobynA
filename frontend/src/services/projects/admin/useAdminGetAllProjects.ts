import { useQuery } from '@tanstack/react-query'
import { useProfile } from '../../../providers/ProfileContext'
import type { ProjectSummary } from '../types/projectTypes'

export const adminProjectsQueryKey = ['admin', 'projects', 'all'] as const

const getAllAdminProjects = async (
  token: string,
): Promise<ProjectSummary[]> => {
  const response = await fetch('/api/admin/projects/all', {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error('Unable to get projects.')
  }

  return response.json() as Promise<ProjectSummary[]>
}

export const useAdminGetAllProjects = () => {
  const { jwtToken } = useProfile()

  return useQuery({
    queryKey: [...adminProjectsQueryKey, jwtToken],
    queryFn: () => getAllAdminProjects(jwtToken),
    enabled: Boolean(jwtToken),
    retry: false,
  })
}

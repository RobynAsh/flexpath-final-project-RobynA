import { useQuery } from '@tanstack/react-query'
import { useProfile } from '../../providers/ProfileContext'
import type { ProjectSummary } from './types/projectTypes'

export const projectsQueryKey = ['projects'] as const

const getProjects = async (
  token: string,
  includePublic: boolean,
): Promise<ProjectSummary[]> => {
  const response = await fetch(`/api/projects?includePublic=${includePublic}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Unable to get projects.')
  }

  return response.json() as Promise<ProjectSummary[]>
}

export const useGetProjects = (includePublic = false) => {
  const { jwtToken } = useProfile()

  return useQuery({
    queryKey: [...projectsQueryKey, { includePublic }, jwtToken],
    queryFn: () => getProjects(jwtToken, includePublic),
    enabled: Boolean(jwtToken),
    retry: false,
  })
}

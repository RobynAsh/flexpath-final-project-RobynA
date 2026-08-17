import { useQuery } from '@tanstack/react-query'
import { useProfile } from '../../providers/ProfileContext'
import type { ProjectSummary } from './types/projectTypes'

export const projectsQueryKey = ['projects'] as const

const getProjects = async (token: string): Promise<ProjectSummary[]> => {
  const response = await fetch('/api/projects', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Unable to get projects.')
  }

  return response.json() as Promise<ProjectSummary[]>
}

export const useGetProjects = () => {
  const { jwtToken } = useProfile()

  return useQuery({
    queryKey: [...projectsQueryKey, jwtToken],
    queryFn: () => getProjects(jwtToken),
    enabled: Boolean(jwtToken),
    retry: false,
  })
}

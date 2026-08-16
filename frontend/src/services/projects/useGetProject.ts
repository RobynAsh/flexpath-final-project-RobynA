import { useQuery } from '@tanstack/react-query'
import { useProfile } from '../../providers/ProfileContext'
import type { ProjectDetails } from './types/projectTypes'

export const projectQueryKey = ['projects', 'detail'] as const

const getProject = async (
  projectId: number,
  token: string,
): Promise<ProjectDetails> => {
  const response = await fetch(`/api/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Unable to get the project.')
  }

  return response.json() as Promise<ProjectDetails>
}

export const useGetProject = (projectId: number) => {
  const { jwtToken } = useProfile()

  return useQuery({
    queryKey: [...projectQueryKey, projectId, jwtToken],
    queryFn: () => getProject(projectId, jwtToken),
    enabled: Boolean(jwtToken) && Number.isInteger(projectId) && projectId > 0,
    retry: false,
  })
}

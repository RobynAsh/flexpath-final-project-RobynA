import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../providers/ProfileContext'
import type { AddProjectRequest } from './types/projectFormTypes'
import { projectsQueryKey } from './useGetProjects'

const updateProject = async (
  projectId: number,
  project: AddProjectRequest,
  token: string,
): Promise<void> => {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...project,
      dateStarted: project.dateStarted || null,
      dateFinished: project.dateFinished || null,
      dateNeededBy: project.dateNeededBy || null,
    }),
  })

  if (!response.ok) {
    throw new Error('There was an error updating the project.')
  }
}

export const useUpdateProject = (projectId: number) => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (project: AddProjectRequest) =>
      updateProject(projectId, project, jwtToken),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectsQueryKey }),
  })
}

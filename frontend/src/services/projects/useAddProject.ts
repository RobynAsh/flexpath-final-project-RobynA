import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../providers/ProfileContext'
import type { AddProjectRequest } from './types/projectFormTypes'
import { projectsQueryKey } from './useGetProjects'

const addProject = async (
  project: AddProjectRequest,
  token: string,
): Promise<void> => {
  const response = await fetch('/api/projects', {
    method: 'POST',
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
    throw new Error('There was an error adding the project.')
  }
}

export const useAddProject = () => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (project: AddProjectRequest) => addProject(project, jwtToken),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectsQueryKey }),
  })
}

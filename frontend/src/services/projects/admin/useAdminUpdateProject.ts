import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../../providers/ProfileContext'
import type { AddProjectRequest } from '../types/projectFormTypes'
import { adminProjectsQueryKey } from './useAdminGetAllProjects'

const updateAdminProject = async (
  projectId: number,
  project: AddProjectRequest,
  token: string,
): Promise<void> => {
  const response = await fetch(`/api/admin/projects/${projectId}`, {
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

export const useAdminUpdateProject = (projectId: number) => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (project: AddProjectRequest) =>
      updateAdminProject(projectId, project, jwtToken),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminProjectsQueryKey }),
  })
}

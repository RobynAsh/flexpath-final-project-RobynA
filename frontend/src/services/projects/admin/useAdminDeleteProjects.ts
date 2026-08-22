import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../../providers/ProfileContext'
import { adminProjectsQueryKey } from './useAdminGetAllProjects'

const deleteAdminProject = async (projectId: number, token: string) => {
  const response = await fetch(`/api/admin/projects/${projectId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error('There was an error deleting the selected projects.')
  }
}

export const useAdminDeleteProjects = () => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectIds: number[]) =>
      Promise.all(
        projectIds.map((projectId) => deleteAdminProject(projectId, jwtToken)),
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminProjectsQueryKey }),
  })
}

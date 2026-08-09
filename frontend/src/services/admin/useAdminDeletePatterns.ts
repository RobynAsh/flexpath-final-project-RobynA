import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../providers/ProfileContext'
import { adminPatternsQueryKey } from './useAdminGetAllPatterns'

const deleteAdminPattern = async (patternId: number, token: string) => {
  const response = await fetch(`/api/admin/patterns/${patternId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('There was an error deleting the selected patterns.')
  }
}

export const useAdminDeletePatterns = () => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patternIds: number[]) =>
      Promise.all(
        patternIds.map((patternId) => deleteAdminPattern(patternId, jwtToken)),
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminPatternsQueryKey }),
  })
}

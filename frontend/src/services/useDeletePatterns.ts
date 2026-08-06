import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../providers/ProfileContext'
import { allPatternsQueryKey } from './useGetAllPatterns'

const deletePattern = async (patternId: number, token: string) => {
  const response = await fetch(`/api/patterns/${patternId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('There was an error deleting the selected patterns.')
  }
}

export const useDeletePatterns = () => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patternIds: number[]) =>
      Promise.all(
        patternIds.map((patternId) => deletePattern(patternId, jwtToken)),
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: allPatternsQueryKey }),
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../providers/ProfileContext'
import { patternsQueryKey } from './useGetPatterns'

const deletePattern = async (patternId: number, token: string) => {
  const response = await fetch(`/api/patterns/${patternId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('There was an error deleting the pattern.')
  }
}

export const useDeletePattern = () => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patternId: number) => deletePattern(patternId, jwtToken),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: patternsQueryKey }),
  })
}

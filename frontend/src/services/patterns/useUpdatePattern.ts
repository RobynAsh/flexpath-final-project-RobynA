import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../providers/ProfileContext'
import type { AddPatternRequest } from './types/patternFormTypes'
import { patternsQueryKey } from './useGetPatterns'

const updatePattern = async (
  patternId: number,
  pattern: AddPatternRequest,
  token: string,
): Promise<void> => {
  const { username: _username, ...request } = pattern
  const response = await fetch(`/api/patterns/${patternId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('There was an error updating the pattern.')
  }
}

export const useUpdatePattern = (patternId: number) => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pattern: AddPatternRequest) =>
      updatePattern(patternId, pattern, jwtToken),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: patternsQueryKey }),
  })
}

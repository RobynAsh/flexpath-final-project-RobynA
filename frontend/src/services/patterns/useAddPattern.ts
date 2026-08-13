import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../providers/ProfileContext'
import type { AddPatternRequest } from './types/patternFormTypes'
import { patternsQueryKey } from './useGetPatterns'

const addPattern = async (
  pattern: AddPatternRequest,
  token: string,
): Promise<void> => {
  // Remove the username from the request body since the backend will use the JWT to determine the username
  const { username: _username, ...request } = pattern
  const response = await fetch('/api/patterns', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('There was an error adding the pattern.')
  }
}

export const useAddPattern = () => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pattern: AddPatternRequest) => addPattern(pattern, jwtToken),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: patternsQueryKey }),
  })
}

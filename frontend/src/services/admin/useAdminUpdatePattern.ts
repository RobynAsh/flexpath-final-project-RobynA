import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../providers/ProfileContext'
import type { AddPatternRequest } from './useAdminAddPattern'
import { adminPatternsQueryKey } from './useAdminGetAllPatterns'

const updateAdminPattern = async (
  patternId: number,
  pattern: AddPatternRequest,
  token: string,
): Promise<void> => {
  const response = await fetch(`/api/admin/patterns/${patternId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pattern),
  })

  if (!response.ok) {
    throw new Error('There was an error updating the pattern.')
  }
}

export const useAdminUpdatePattern = (patternId: number) => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pattern: AddPatternRequest) =>
      updateAdminPattern(patternId, pattern, jwtToken),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminPatternsQueryKey }),
  })
}

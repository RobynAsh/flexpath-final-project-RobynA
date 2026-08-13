import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../../providers/ProfileContext'
import type { AddPatternRequest } from '../types/patternFormTypes'
import { adminPatternsQueryKey } from './useAdminGetAllPatterns'

export type {
  AddPatternRequest,
  PatternMaterial,
  PatternTool,
  PatternYarn,
} from '../types/patternFormTypes'

const addAdminPattern = async (
  pattern: AddPatternRequest,
  token: string,
): Promise<void> => {
  const response = await fetch('/api/admin/patterns', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pattern),
  })

  if (!response.ok) {
    throw new Error('There was an error adding the pattern.')
  }
}

export const useAdminAddPattern = () => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pattern: AddPatternRequest) =>
      addAdminPattern(pattern, jwtToken),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminPatternsQueryKey }),
  })
}

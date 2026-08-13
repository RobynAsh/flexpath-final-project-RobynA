import { useQuery } from '@tanstack/react-query'
import { useProfile } from '../../../providers/ProfileContext'
import type { PatternDetails } from '../types/patternTypes'

export type {
  Pattern,
  PatternDetails,
  PatternMaterial,
  PatternTag,
  PatternTool,
  PatternYarn,
} from '../types/patternTypes'

export const adminPatternsQueryKey = ['admin', 'patterns', 'all'] as const

const getAllAdminPatterns = async (
  token: string,
): Promise<PatternDetails[]> => {
  const response = await fetch('/api/admin/patterns/all', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Unable to get patterns.')
  }

  return response.json() as Promise<PatternDetails[]>
}

export const useAdminGetAllPatterns = () => {
  const { jwtToken } = useProfile()

  return useQuery({
    queryKey: [...adminPatternsQueryKey, jwtToken],
    queryFn: () => getAllAdminPatterns(jwtToken),
    enabled: Boolean(jwtToken),
    retry: false,
  })
}

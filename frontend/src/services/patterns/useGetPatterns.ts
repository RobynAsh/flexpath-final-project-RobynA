import { useQuery } from '@tanstack/react-query'
import { useProfile } from '../../providers/ProfileContext'
import type { PatternDetails } from './types/patternTypes'

export const patternsQueryKey = ['patterns'] as const

const getPatterns = async (
  token: string,
  limit?: number,
): Promise<PatternDetails[]> => {
  const url =
    limit === undefined ? '/api/patterns' : `/api/patterns?limit=${limit}`
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Unable to get patterns.')
  }

  return response.json() as Promise<PatternDetails[]>
}

export const useGetPatterns = (limit?: number) => {
  const { jwtToken } = useProfile()

  return useQuery({
    queryKey: [...patternsQueryKey, limit, jwtToken],
    queryFn: () => getPatterns(jwtToken, limit),
    enabled: Boolean(jwtToken),
    retry: false,
  })
}

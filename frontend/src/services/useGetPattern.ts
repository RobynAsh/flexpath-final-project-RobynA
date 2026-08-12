import { useQuery } from '@tanstack/react-query'
import { useProfile } from '../providers/ProfileContext'
import type { PatternDetails } from './types/patternTypes'

export const patternQueryKey = ['patterns', 'detail'] as const

const getPattern = async (
  patternId: number,
  token: string,
): Promise<PatternDetails> => {
  const response = await fetch(`/api/patterns/${patternId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Unable to get the pattern.')
  }

  return response.json() as Promise<PatternDetails>
}

export const useGetPattern = (patternId: number) => {
  const { jwtToken } = useProfile()

  return useQuery({
    queryKey: [...patternQueryKey, patternId, jwtToken],
    queryFn: () => getPattern(patternId, jwtToken),
    enabled: Boolean(jwtToken) && Number.isInteger(patternId) && patternId > 0,
    retry: false,
  })
}

import { useQuery } from '@tanstack/react-query'
import type { SortDirection } from '../../components/form/SortForm/SortForm'
import type { FilterField, SortField } from '../../hooks/usePatternsFilterSort'
import { useProfile } from '../../providers/ProfileContext'
import type { PatternDetails } from './types/patternTypes'

export const patternsQueryKey = ['patterns'] as const

export type GetPatternsOptions = {
  limit?: number
  filterField?: FilterField
  filterText?: string
  sortField?: SortField
  sortDirection?: SortDirection
}

const getPatterns = async (
  token: string,
  options: GetPatternsOptions,
): Promise<PatternDetails[]> => {
  const params = new URLSearchParams()

  if (options.limit !== undefined) {
    params.set('limit', String(options.limit))
  }
  if (options.filterField !== undefined) {
    params.set('filterField', options.filterField)
  }
  if (options.filterText?.trim()) {
    params.set('filterText', options.filterText.trim())
  }
  if (options.sortField !== undefined) {
    params.set('sortField', options.sortField)
  }
  if (options.sortDirection !== undefined) {
    params.set('sortDirection', options.sortDirection)
  }

  const query = params.toString()
  const url = query ? `/api/patterns?${query}` : '/api/patterns'
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

export const useGetPatterns = (options: GetPatternsOptions = {}) => {
  const { jwtToken } = useProfile()

  return useQuery({
    queryKey: [...patternsQueryKey, options, jwtToken],
    queryFn: () => getPatterns(jwtToken, options),
    enabled: Boolean(jwtToken),
    retry: false,
  })
}

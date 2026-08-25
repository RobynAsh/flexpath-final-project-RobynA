import { useQuery } from '@tanstack/react-query'
import type { SortDirection } from '../../../components/form/SortForm/SortForm'
import type {
  FilterField,
  SortField,
} from '../../../hooks/usePatternsFilterSort'
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

export type GetAllAdminPatternsOptions = {
  filterField?: FilterField
  filterText?: string
  sortField?: SortField
  sortDirection?: SortDirection
}

const getAllAdminPatterns = async (
  token: string,
  options: GetAllAdminPatternsOptions,
): Promise<PatternDetails[]> => {
  const params = new URLSearchParams()

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
  const url = query
    ? `/api/admin/patterns/all?${query}`
    : '/api/admin/patterns/all'
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

export const useAdminGetAllPatterns = (
  options: GetAllAdminPatternsOptions = {},
) => {
  const { jwtToken } = useProfile()

  return useQuery({
    queryKey: [...adminPatternsQueryKey, options, jwtToken],
    queryFn: () => getAllAdminPatterns(jwtToken, options),
    enabled: Boolean(jwtToken),
    retry: false,
  })
}

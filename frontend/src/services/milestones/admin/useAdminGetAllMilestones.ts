import { useQuery } from '@tanstack/react-query'
import type { SortDirection } from '../../../components/form/SortForm/SortForm'
import type {
  MilestoneFilterField,
  MilestoneSortField,
} from '../../../hooks/useMilestonesFilterSort'
import { useProfile } from '../../../providers/ProfileContext'
import type { AdminMilestoneDetails } from '../types/milestoneTypes'

export const adminMilestonesQueryKey = ['admin', 'milestones', 'all'] as const

export type GetAllAdminMilestonesOptions = {
  filterField?: MilestoneFilterField
  filterText?: string
  sortField?: MilestoneSortField
  sortDirection?: SortDirection
}

const getAllAdminMilestones = async (
  token: string,
  options: GetAllAdminMilestonesOptions,
): Promise<AdminMilestoneDetails[]> => {
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
    ? `/api/admin/milestones/all?${query}`
    : '/api/admin/milestones/all'
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error('Unable to get milestones.')
  }

  return response.json() as Promise<AdminMilestoneDetails[]>
}

export const useAdminGetAllMilestones = (
  options: GetAllAdminMilestonesOptions = {},
) => {
  const { jwtToken } = useProfile()

  return useQuery({
    queryKey: [...adminMilestonesQueryKey, options, jwtToken],
    queryFn: () => getAllAdminMilestones(jwtToken, options),
    enabled: Boolean(jwtToken),
    retry: false,
  })
}

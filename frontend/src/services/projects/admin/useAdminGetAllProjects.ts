import { useQuery } from '@tanstack/react-query'
import type { SortDirection } from '../../../components/form/SortForm/SortForm'
import type {
  ProjectFilterField,
  ProjectSortField,
} from '../../../hooks/useProjectsFilterSort'
import { useProfile } from '../../../providers/ProfileContext'
import type { ProjectSummary } from '../types/projectTypes'

export const adminProjectsQueryKey = ['admin', 'projects', 'all'] as const

export type GetAllAdminProjectsOptions = {
  filterField?: ProjectFilterField
  filterText?: string
  sortField?: ProjectSortField
  sortDirection?: SortDirection
}

const getAllAdminProjects = async (
  token: string,
  options: GetAllAdminProjectsOptions,
): Promise<ProjectSummary[]> => {
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
    ? `/api/admin/projects/all?${query}`
    : '/api/admin/projects/all'
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error('Unable to get projects.')
  }

  return response.json() as Promise<ProjectSummary[]>
}

export const useAdminGetAllProjects = (
  options: GetAllAdminProjectsOptions = {},
) => {
  const { jwtToken } = useProfile()

  return useQuery({
    queryKey: [...adminProjectsQueryKey, options, jwtToken],
    queryFn: () => getAllAdminProjects(jwtToken, options),
    enabled: Boolean(jwtToken),
    retry: false,
  })
}

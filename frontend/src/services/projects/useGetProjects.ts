import { useQuery } from '@tanstack/react-query'
import type { SortDirection } from '../../components/form/SortForm/SortForm'
import type {
  ProjectFilterField,
  ProjectSortField,
} from '../../hooks/useProjectsFilterSort'
import { useProfile } from '../../providers/ProfileContext'
import type { ProjectSummary } from './types/projectTypes'

export const projectsQueryKey = ['projects'] as const

export type GetProjectsOptions = {
  includePublic?: boolean
  filterField?: ProjectFilterField
  filterText?: string
  sortField?: ProjectSortField
  sortDirection?: SortDirection
}

const getProjects = async (
  token: string,
  options: GetProjectsOptions,
): Promise<ProjectSummary[]> => {
  const params = new URLSearchParams()
  params.set('includePublic', String(options.includePublic ?? false))

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

  const response = await fetch(`/api/projects?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Unable to get projects.')
  }

  return response.json() as Promise<ProjectSummary[]>
}

export const useGetProjects = (options: GetProjectsOptions = {}) => {
  const { jwtToken } = useProfile()

  return useQuery({
    queryKey: [...projectsQueryKey, options, jwtToken],
    queryFn: () => getProjects(jwtToken, options),
    enabled: Boolean(jwtToken),
    retry: false,
  })
}

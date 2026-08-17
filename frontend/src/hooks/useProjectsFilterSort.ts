import { useMemo } from 'react'
import type { SelectOption } from '../components/form/Select/Select'
import type { SortDirection } from '../components/form/SortForm/SortForm'
import type {
  Project,
  ProjectSummary,
} from '../services/projects/types/projectTypes'

export type ProjectSortField = 'name' | 'createdAt' | 'updatedAt'
export type ProjectFilterField = Exclude<
  keyof Project,
  'projectId' | 'patternId'
>

const filterFields: SelectOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'username', label: 'Username' },
  { value: 'status', label: 'Status' },
  { value: 'public', label: 'Visibility' },
  { value: 'care', label: 'Care Instructions' },
  { value: 'gauge', label: 'Gauge' },
  { value: 'dateStarted', label: 'Date Started' },
  { value: 'dateFinished', label: 'Date Finished' },
  { value: 'dateNeededBy', label: 'Date Needed By' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
]

const sortFields: SelectOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
]

const dateFields: ProjectFilterField[] = [
  'dateStarted',
  'dateFinished',
  'dateNeededBy',
  'createdAt',
  'updatedAt',
]

export const useProjectsFilterSort = ({
  projects,
  filterField,
  filterText,
  sortField,
  sortDirection,
}: {
  projects?: ProjectSummary[]
  filterField: ProjectFilterField
  filterText: string
  sortField: ProjectSortField
  sortDirection: SortDirection
}) => {
  const visibleProjects = useMemo(() => {
    if (!projects) {
      return []
    }

    const normalizedFilter = filterText.trim().toLocaleLowerCase()
    const filteredProjects = normalizedFilter
      ? projects.filter(({ project }) => {
          const fieldValue = project[filterField]
          const searchableValue =
            fieldValue && dateFields.includes(filterField)
              ? `${fieldValue} ${new Date(String(fieldValue)).toLocaleString()}`
              : filterField === 'public'
                ? fieldValue
                  ? 'public'
                  : 'private'
                : String(fieldValue ?? '')

          return searchableValue.toLocaleLowerCase().includes(normalizedFilter)
        })
      : projects

    return [...filteredProjects].sort((first, second) => {
      const firstValue = first.project[sortField]
      const secondValue = second.project[sortField]
      const comparison =
        sortField === 'name'
          ? firstValue.localeCompare(secondValue, undefined, {
              sensitivity: 'base',
            })
          : new Date(firstValue).getTime() - new Date(secondValue).getTime()

      return sortDirection === 'ascending' ? comparison : -comparison
    })
  }, [filterField, filterText, projects, sortDirection, sortField])

  return { filterFields, sortFields, visibleProjects }
}

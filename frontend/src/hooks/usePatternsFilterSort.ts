import { useMemo } from 'react'
import type { SelectOption } from '../components/form/Select/Select'
import type { SortDirection } from '../components/form/SortForm/SortForm'
import type { Pattern, PatternDetails } from '../services/types/patternTypes'

export type SortField = 'name' | 'createdAt' | 'updatedAt'
export type FilterField = Exclude<keyof Pattern, 'patternId'>

const filterFields: SelectOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'username', label: 'Username' },
  { value: 'designer', label: 'Designer' },
  { value: 'category', label: 'Category' },
  { value: 'technique', label: 'Technique' },
  { value: 'difficulty', label: 'Difficulty' },
  { value: 'description', label: 'Description' },
  { value: 'link', label: 'Pattern URL' },
  { value: 'imageUrl', label: 'Image URL' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
]

const sortFields: SelectOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
]

export const usePatternsFilterSort = ({
  patterns,
  filterField,
  filterText,
  sortField,
  sortDirection,
}: {
  patterns?: PatternDetails[]
  filterField: FilterField
  filterText: string
  sortField: SortField
  sortDirection: SortDirection
}) => {
  const visiblePatterns = useMemo(() => {
    if (!patterns) {
      return []
    }

    const normalizedFilter = filterText.trim().toLocaleLowerCase()
    const filteredPatterns = normalizedFilter
      ? patterns.filter(({ pattern }) => {
          const fieldValue = pattern[filterField]
          const searchableValue =
            filterField === 'createdAt' || filterField === 'updatedAt'
              ? `${fieldValue} ${new Date(String(fieldValue)).toLocaleString()}`
              : String(fieldValue ?? '')

          return searchableValue.toLocaleLowerCase().includes(normalizedFilter)
        })
      : patterns

    return [...filteredPatterns].sort((first, second) => {
      const firstValue = first.pattern[sortField]
      const secondValue = second.pattern[sortField]
      const comparison =
        sortField === 'name'
          ? firstValue.localeCompare(secondValue, undefined, {
              sensitivity: 'base',
            })
          : new Date(firstValue).getTime() - new Date(secondValue).getTime()

      return sortDirection === 'ascending' ? comparison : -comparison
    })
  }, [filterField, filterText, patterns, sortDirection, sortField])

  return { filterFields, sortFields, visiblePatterns }
}

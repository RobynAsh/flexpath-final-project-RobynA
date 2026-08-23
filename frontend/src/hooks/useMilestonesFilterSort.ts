import { useMemo } from 'react'
import type { SelectOption } from '../components/form/Select/Select'
import type { SortDirection } from '../components/form/SortForm/SortForm'
import type { AdminMilestoneDetails } from '../services/milestones/types/milestoneTypes'

export type MilestoneFilterField =
  | 'projectName'
  | 'username'
  | 'note'
  | 'rowCount'
  | 'repeatCount'
  | 'createdAt'
  | 'updatedAt'
export type MilestoneSortField =
  | 'projectName'
  | 'username'
  | 'rowCount'
  | 'repeatCount'
  | 'createdAt'
  | 'updatedAt'

const filterFields: SelectOption[] = [
  { value: 'projectName', label: 'Project' },
  { value: 'username', label: 'Username' },
  { value: 'note', label: 'Note' },
  { value: 'rowCount', label: 'Row Count' },
  { value: 'repeatCount', label: 'Repeat Count' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
]

const sortFields: SelectOption[] = [
  { value: 'projectName', label: 'Project' },
  { value: 'username', label: 'Username' },
  { value: 'rowCount', label: 'Row Count' },
  { value: 'repeatCount', label: 'Repeat Count' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
]

const fieldValue = (
  details: AdminMilestoneDetails,
  field: MilestoneFilterField | MilestoneSortField,
) =>
  field === 'projectName' || field === 'username'
    ? details[field]
    : details.milestone[field]

export const useMilestonesFilterSort = ({
  milestones,
  filterField,
  filterText,
  sortField,
  sortDirection,
}: {
  milestones?: AdminMilestoneDetails[]
  filterField: MilestoneFilterField
  filterText: string
  sortField: MilestoneSortField
  sortDirection: SortDirection
}) => {
  const visibleMilestones = useMemo(() => {
    if (!milestones) return []

    const normalizedFilter = filterText.trim().toLocaleLowerCase()
    const filteredMilestones = normalizedFilter
      ? milestones.filter((details) => {
          const value = fieldValue(details, filterField)
          const searchableValue =
            filterField === 'createdAt' || filterField === 'updatedAt'
              ? `${value} ${new Date(String(value)).toLocaleString()}`
              : String(value ?? '')

          return searchableValue.toLocaleLowerCase().includes(normalizedFilter)
        })
      : milestones

    return [...filteredMilestones].sort((first, second) => {
      const firstValue = fieldValue(first, sortField)
      const secondValue = fieldValue(second, sortField)
      let comparison: number

      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        comparison =
          new Date(String(firstValue)).getTime() -
          new Date(String(secondValue)).getTime()
      } else if (sortField === 'rowCount' || sortField === 'repeatCount') {
        comparison = Number(firstValue) - Number(secondValue)
      } else {
        comparison = String(firstValue).localeCompare(
          String(secondValue),
          undefined,
          {
            sensitivity: 'base',
          },
        )
      }

      return sortDirection === 'ascending' ? comparison : -comparison
    })
  }, [filterField, filterText, milestones, sortDirection, sortField])

  return { filterFields, sortFields, visibleMilestones }
}

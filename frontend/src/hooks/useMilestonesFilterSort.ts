import type { SelectOption } from '../components/form/Select/Select'

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

export const milestoneFilterFields: SelectOption[] = [
  { value: 'projectName', label: 'Project' },
  { value: 'username', label: 'Username' },
  { value: 'note', label: 'Note' },
  { value: 'rowCount', label: 'Row Count' },
  { value: 'repeatCount', label: 'Repeat Count' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
]

export const milestoneSortFields: SelectOption[] = [
  { value: 'projectName', label: 'Project' },
  { value: 'username', label: 'Username' },
  { value: 'rowCount', label: 'Row Count' },
  { value: 'repeatCount', label: 'Repeat Count' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
]

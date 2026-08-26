import type { SelectOption } from '../components/form/Select/Select'
import type { Project } from '../services/projects/types/projectTypes'

export type ProjectSortField = 'name' | 'createdAt' | 'updatedAt'
export type ProjectFilterField = Exclude<
  keyof Project,
  'projectId' | 'patternId'
>

export const projectFilterFields: SelectOption[] = [
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

export const projectSortFields: SelectOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
]

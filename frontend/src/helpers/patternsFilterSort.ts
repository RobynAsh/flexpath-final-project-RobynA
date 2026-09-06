import type { SelectOption } from '../components/form/Select/Select'
import type { Pattern } from '../services/patterns/types/patternTypes'

export type SortField = 'name' | 'createdAt' | 'updatedAt'
export type FilterField = Exclude<keyof Pattern, 'patternId'>

export const patternFilterFields: SelectOption[] = [
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

export const patternSortFields: SelectOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
]

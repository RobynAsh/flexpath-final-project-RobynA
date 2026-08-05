import { Select, type SelectOption } from '../Select/Select'
import { TextField } from '../TextField/TextField'

export type FilterFormProps = {
  filterFields: SelectOption[]
  filterField: string
  filterText: string
  onFilterFieldChange: (_field: string) => void
  onFilterTextChange: (_text: string) => void
  placeholder?: string
}

export const FilterForm = ({
  filterFields,
  filterField,
  filterText,
  onFilterFieldChange,
  onFilterTextChange,
  placeholder = 'Enter text to filter',
}: FilterFormProps) => {
  return (
    <form
      className="flex flex-col gap-4 md:flex-row"
      onSubmit={(event) => {
        event.preventDefault()
      }}
    >
      <Select
        id="filter-field"
        label="Filter By"
        options={filterFields}
        value={filterField}
        onChange={(event) => onFilterFieldChange(event.target.value)}
      />
      <TextField
        id="filter-text"
        label="Search Text"
        value={filterText}
        onChange={(event) => onFilterTextChange(event.target.value)}
        placeholder={placeholder}
        containerClassName="grow"
      />
    </form>
  )
}

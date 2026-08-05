import { TextField } from '../TextField/TextField'

export type FilterFieldOption = {
  value: string
  label: string
}

export type FilterFormProps = {
  filterFields: FilterFieldOption[]
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
      <div className="flex flex-col gap-2">
        <label htmlFor="filter-field" className="text-lg sm:text-xl">
          Filter By
        </label>
        <select
          id="filter-field"
          className="border-thread-200 rounded-lg border-2 bg-transparent px-3 py-2 text-lg outline-none focus:border-olive-400 sm:text-xl"
          value={filterField}
          onChange={(event) => onFilterFieldChange(event.target.value)}
        >
          {filterFields.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
      </div>
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

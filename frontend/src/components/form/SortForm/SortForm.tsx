export type SortDirection = 'ascending' | 'descending'

export type SortFieldOption = {
  value: string
  label: string
}

export type SortFormProps = {
  sortFields: SortFieldOption[]
  sortField: string
  sortDirection: SortDirection
  onSortFieldChange: (_field: string) => void
  onSortDirectionChange: (_direction: SortDirection) => void
}

export const SortForm = ({
  sortFields,
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionChange,
}: SortFormProps) => {
  return (
    <form
      className="bg-surface border-border shadow-card flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-end sm:gap-8 md:inline-flex"
      onSubmit={(event) => {
        event.preventDefault()
      }}
    >
      <div className="flex min-w-48 flex-col gap-2">
        <label htmlFor="sort-field" className="text-lg sm:text-xl">
          Sort By
        </label>
        <select
          id="sort-field"
          className="border-thread-200 rounded-lg border-2 bg-transparent px-3 py-2 text-lg outline-none focus:border-olive-400 sm:text-xl"
          value={sortField}
          onChange={(event) => onSortFieldChange(event.target.value)}
        >
          {sortFields.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-lg sm:text-xl">Sort Direction</legend>
        <div className="flex min-h-12 items-center gap-5">
          {(['ascending', 'descending'] as const).map((direction) => (
            <label
              key={direction}
              className="flex cursor-pointer items-center gap-2 text-lg sm:text-xl"
            >
              <input
                type="radio"
                name="sort-direction"
                value={direction}
                checked={sortDirection === direction}
                onChange={() => onSortDirectionChange(direction)}
                className="h-5 w-5 cursor-pointer accent-olive-500"
              />
              {direction === 'ascending' ? 'Ascending' : 'Descending'}
            </label>
          ))}
        </div>
      </fieldset>
    </form>
  )
}

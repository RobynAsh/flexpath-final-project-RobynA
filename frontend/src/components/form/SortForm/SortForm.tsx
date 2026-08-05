import { Select, type SelectOption } from '../Select/Select'

export type SortDirection = 'ascending' | 'descending'

export type SortFormProps = {
  sortFields: SelectOption[]
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
      <Select
        id="sort-field"
        label="Sort By"
        options={sortFields}
        value={sortField}
        onChange={(event) => onSortFieldChange(event.target.value)}
        containerClassName="min-w-48"
      />

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

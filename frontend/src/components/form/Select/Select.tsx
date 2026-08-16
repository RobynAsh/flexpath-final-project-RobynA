import { forwardRef, type ComponentPropsWithoutRef } from 'react'

export type SelectOption = {
  value: string
  label: string
}

export interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  id: string
  label: string
  error?: string
  options: SelectOption[]
  containerClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { id, label, error, options, containerClassName = '', ...selectProps },
    ref,
  ) {
    return (
      <div className={`flex flex-col gap-2 ${containerClassName}`}>
        <label htmlFor={id} className="text-lg sm:text-xl">
          {label}
        </label>
        <select
          ref={ref}
          id={id}
          className={`${error ? 'border-rose-600 focus:border-rose-400' : 'border-thread-200 focus:border-olive-400'} rounded-lg border-2 bg-transparent px-3 py-2 text-lg outline-none sm:text-xl`}
          {...selectProps}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-left text-rose-600">{error}</p>}
      </div>
    )
  },
)

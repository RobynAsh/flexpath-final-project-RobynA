import { forwardRef, type ComponentPropsWithoutRef } from 'react'

export type SelectOption = {
  value: string
  label: string
}

export interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  id: string
  label: string
  options: SelectOption[]
  containerClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { id, label, options, containerClassName = '', ...selectProps },
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
          className="border-thread-200 rounded-lg border-2 bg-transparent px-3 py-2 text-lg outline-none focus:border-olive-400 sm:text-xl"
          {...selectProps}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )
  },
)

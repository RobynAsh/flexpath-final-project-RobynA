import { forwardRef, type ComponentPropsWithoutRef } from 'react'

interface TextAreaProps extends ComponentPropsWithoutRef<'textarea'> {
  id: string
  label: string
  error?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ id, label, error, ...textAreaProps }, ref) {
    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={id}
          className={`${error ? 'text-rose-500' : ''} text-lg sm:text-xl`}
        >
          {label}
        </label>
        <div className="flex flex-col gap-1">
          <textarea
            ref={ref}
            id={id}
            className={`${error ? 'border-rose-600' : 'border-thread-200'} min-h-32 resize-y rounded-lg border-2 bg-transparent p-2 text-lg outline-none sm:text-xl`}
            {...textAreaProps}
          />
          {error && <p className="text-left text-rose-600">{error}</p>}
        </div>
      </div>
    )
  },
)

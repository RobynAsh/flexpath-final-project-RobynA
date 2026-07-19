import { IconDefinition } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'

interface TextFieldProps extends ComponentPropsWithoutRef<'input'> {
  id: string
  label: string
  error?: string
  leftIcon?: IconDefinition
  rightIcon?: IconDefinition
  rightIconOnClick?: () => void
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      id,
      label,
      type = 'text',
      error,
      leftIcon,
      rightIcon,
      rightIconOnClick,
      ...inputProps
    },
    ref,
  ) {
    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={id}
          className={`${error ? 'text-rose-500' : ''} text-lg sm:text-xl`}
        >
          {label}
        </label>
        <div className="flex flex-col gap-1">
          <div
            className={`${error ? 'border-rose-600' : 'border-thread-200'} flex items-center gap-1 rounded-lg border-2 px-1 py-2 sm:gap-2 sm:p-2`}
          >
            {leftIcon && (
              <FontAwesomeIcon
                icon={leftIcon}
                className={`${error ? 'text-rose-500' : 'text-olive-400'} text-lg sm:text-xl`}
              />
            )}
            <input
              ref={ref}
              type={type}
              id={id}
              className="grow bg-transparent text-lg outline-none sm:text-xl"
              {...inputProps}
            />
            {rightIcon && (
              <div onClick={rightIconOnClick}>
                <FontAwesomeIcon
                  icon={rightIcon}
                  className={`${error ? `text-rose-500 ${rightIconOnClick ? 'hover:text-rose-600' : ''}` : `text-olive-400 ${rightIconOnClick ? 'hover:text-olive-500' : ''}`} text-lg sm:text-xl ${rightIconOnClick ? 'cursor-pointer transition-colors duration-300' : ''}`}
                  onClick={rightIconOnClick}
                />
              </div>
            )}
          </div>
          {error && <p className="text-left text-rose-600">{error}</p>}
        </div>
      </div>
    )
  },
)

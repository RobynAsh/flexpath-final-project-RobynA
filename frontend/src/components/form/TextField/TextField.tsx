import { IconDefinition } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ChangeEventHandler, DetailedHTMLProps } from 'react'

interface TextFieldProps extends DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> {
  id: string
  type?: string
  placeholder?: string
  leftIcon?: IconDefinition
  rightIcon?: IconDefinition
  rightIconOnClick?: () => void
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export const TextField = ({
  id,
  type = 'text',
  placeholder,
  leftIcon,
  rightIcon,
  rightIconOnClick,
  value,
  onChange,
  ...rest
}: TextFieldProps) => {
  return (
    <div className="border-thread-200 flex items-center gap-1 rounded-lg border-2 px-1 py-2 sm:gap-2 sm:p-2">
      {leftIcon && (
        <FontAwesomeIcon
          icon={leftIcon}
          className="text-lg text-olive-400 sm:text-xl"
        />
      )}
      <input
        type={type}
        id={id}
        className="grow bg-transparent text-lg outline-none sm:text-xl"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {rightIcon && (
        <div onClick={rightIconOnClick}>
          <FontAwesomeIcon
            icon={rightIcon}
            className={`text-lg text-olive-400 sm:text-xl ${rightIconOnClick ? 'cursor-pointer transition-colors duration-300 hover:text-olive-500' : ''}`}
            onClick={rightIconOnClick}
          />
        </div>
      )}
    </div>
  )
}

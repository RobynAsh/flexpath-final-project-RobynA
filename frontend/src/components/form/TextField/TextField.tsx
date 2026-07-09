import { IconDefinition } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const TextField = ({
  id,
  type = 'text',
  placeholder,
  leftIcon,
  rightIcon,
  rightIconOnClick,
}: {
  id: string
  type?: string
  placeholder?: string
  leftIcon?: IconDefinition
  rightIcon?: IconDefinition
  rightIconOnClick?: () => void
}) => {
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

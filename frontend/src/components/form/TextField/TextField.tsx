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
  leftIcon?: string
  rightIcon?: string
  rightIconOnClick?: () => void
}) => {
  return (
    <div className="border-thread-200 flex items-center gap-2 rounded-lg border-2 p-2">
      {leftIcon && (
        <i className={`fa-regular ${leftIcon} text-xl text-olive-400`} />
      )}
      <input
        type={type}
        id={id}
        className="grow bg-transparent text-xl outline-none"
        placeholder={placeholder}
      />
      {rightIcon && (
        <div onClick={rightIconOnClick}>
          <i
            className={`fa-regular ${rightIcon} text-xl text-olive-400 ${rightIconOnClick ? 'cursor-pointer transition-colors duration-300 hover:text-olive-500' : ''}`}
          />
        </div>
      )}
    </div>
  )
}

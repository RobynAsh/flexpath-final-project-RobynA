export const Button = ({
  children,
  variant,
  className = '',
  type = 'button',
  onClick,
}: {
  children: React.ReactNode
  variant: 'primary' | 'secondary'
  className?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  onClick?: () => void
}) => {
  return (
    <button
      type={type}
      className={`cursor-pointer rounded-md p-1 text-lg transition-colors duration-300 sm:text-xl ${
        variant === 'primary'
          ? 'bg-olive-500 text-olive-50 hover:bg-olive-600'
          : 'border-2 border-rose-200 bg-transparent text-rose-400 hover:border-rose-300 hover:bg-rose-100'
      } `}
      onClick={onClick}
    >
      <span
        className={`flex p-1 ${variant === 'primary' ? 'border border-dashed border-olive-300' : 'p-1'} ${className}`}
      >
        {children}
      </span>
    </button>
  )
}

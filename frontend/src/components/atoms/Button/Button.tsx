import { useMemo } from 'react'
import { tw } from '../../../helpers/tw'

export const Button = ({
  children,
  variant,
  className = '',
  type = 'button',
  form,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode
  variant: 'primary' | 'secondary' | 'tertiary'
  className?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  form?: string
  onClick?: () => void
  disabled?: boolean
}) => {
  const buttonClasses = useMemo(() => {
    let classes = tw`w-full cursor-pointer rounded-md text-lg transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xl `
    switch (variant) {
      case 'primary':
        classes += tw`bg-olive-500 text-olive-50 hover:bg-olive-600 p-0.5`
        break
      case 'secondary':
        classes += tw`border-2 border-rose-200 bg-transparent text-rose-400 hover:border-rose-300 hover:bg-rose-100 p-1`
        break
      case 'tertiary':
        classes += tw`border-2 border-thread-100 hover:border-thread-200 bg-thread-100 text-honey-400 hover:bg-thread-200 hover:text-thread-400 p-1`
        break
    }

    return classes
  }, [variant])

  const spanClasses = useMemo(() => {
    let classes = tw`flex items-center justify-center gap-2 p-1 rounded-md `
    switch (variant) {
      case 'primary':
        classes += tw`border border-dashed border-olive-300`
        break
      case 'secondary':
        classes += tw`p-1`
        break
      case 'tertiary':
        classes += tw`p-1`
        break
    }

    return classes
  }, [variant])

  return (
    <button
      type={type}
      form={form}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className={`${spanClasses} ${variant === 'primary' ? '' : 'p-1'} ${className}`}
      >
        {children}
      </span>
    </button>
  )
}

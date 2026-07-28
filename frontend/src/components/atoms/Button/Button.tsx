import { useMemo } from 'react'
import { tw } from '../../../helpers/tw'

export const Button = ({
  children,
  variant,
  className = '',
  type = 'button',
  form,
  onClick,
}: {
  children: React.ReactNode
  variant: 'primary' | 'secondary' | 'tertiary'
  className?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  form?: string
  onClick?: () => void
}) => {
  const buttonClasses = useMemo(() => {
    let classes = tw`w-full cursor-pointer rounded-md p-1 text-lg transition-colors duration-300 sm:text-xl `
    switch (variant) {
      case 'primary':
        classes += tw`bg-olive-500 text-olive-50 hover:bg-olive-600`
        break
      case 'secondary':
        classes += tw`border-2 border-rose-200 bg-transparent text-rose-400 hover:border-rose-300 hover:bg-rose-100`
        break
      case 'tertiary':
        classes += tw`bg-thread-100 text-honey-400 hover:bg-thread-200 hover:text-thread-400`
        break
    }

    return classes
  }, [variant])

  const spanClasses = useMemo(() => {
    let classes = tw`flex items-center justify-center gap-2 p-1 `
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
    <button type={type} form={form} className={buttonClasses} onClick={onClick}>
      <span
        className={`${spanClasses} ${variant === 'primary' ? '' : 'p-1'} ${className}`}
      >
        {children}
      </span>
    </button>
  )
}

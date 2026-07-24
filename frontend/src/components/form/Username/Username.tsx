import { faUser } from '@fortawesome/free-regular-svg-icons'
import { TextField } from '../TextField/TextField'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'

interface UsernameProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'id' | 'type'
> {
  placeholder?: string
  error?: string
}

export const Username = forwardRef<HTMLInputElement, UsernameProps>(
  function Username(
    { error, placeholder = 'Enter your username', ...inputProps },
    ref,
  ) {
    return (
      <TextField
        {...inputProps}
        ref={ref}
        id="username"
        label="Username"
        error={error}
        placeholder={placeholder}
        leftIcon={faUser}
      />
    )
  },
)

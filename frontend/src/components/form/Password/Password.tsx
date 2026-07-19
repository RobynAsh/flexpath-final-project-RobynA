import { forwardRef, useState, type ComponentPropsWithoutRef } from 'react'
import { TextField } from '../TextField/TextField'
import {
  faEye,
  faEyeSlash,
  faUserLock,
} from '@fortawesome/free-solid-svg-icons'

interface PasswordProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'id' | 'type'
> {
  id: string
  label: string
  error?: string
}

export const Password = forwardRef<HTMLInputElement, PasswordProps>(
  function Password(
    { id, label, placeholder = 'Enter your password', error, ...inputProps },
    ref,
  ) {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <TextField
        {...inputProps}
        ref={ref}
        id={id}
        label={label}
        error={error}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        leftIcon={faUserLock}
        rightIcon={showPassword ? faEyeSlash : faEye}
        rightIconOnClick={() => {
          setShowPassword(!showPassword)
        }}
      />
    )
  },
)

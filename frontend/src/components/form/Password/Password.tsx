import { useState, type ChangeEventHandler } from 'react'
import { TextField } from '../TextField/TextField'
import {
  faEye,
  faEyeSlash,
  faUserLock,
} from '@fortawesome/free-solid-svg-icons'

export const Password = ({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-lg sm:text-xl">
        {label}
      </label>
      {/* Input */}
      <TextField
        id={id}
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter your password"
        leftIcon={faUserLock}
        rightIcon={showPassword ? faEyeSlash : faEye}
        value={value}
        onChange={onChange}
        rightIconOnClick={() => {
          setShowPassword(!showPassword)
        }}
        required
      />
    </div>
  )
}

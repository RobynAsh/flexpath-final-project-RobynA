import { useState } from 'react'
import { TextField } from '../TextField/TextField'
import {
  faEye,
  faEyeSlash,
  faUserLock,
} from '@fortawesome/free-solid-svg-icons'

export const Password = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="password" className="text-lg sm:text-xl">
        Password
      </label>
      {/* Input */}
      <TextField
        id="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter your password"
        leftIcon={faUserLock}
        rightIcon={showPassword ? faEyeSlash : faEye}
        rightIconOnClick={() => {
          console.log('yo')
          setShowPassword(!showPassword)
        }}
      />
    </div>
  )
}

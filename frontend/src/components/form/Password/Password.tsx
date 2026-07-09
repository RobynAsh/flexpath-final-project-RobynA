import { useState } from 'react'
import { TextField } from '../TextField/TextField'

export const Password = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="password" className="text-xl">
        Password
      </label>
      {/* Input */}
      <TextField
        id="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter your password"
        leftIcon="fa-lock"
        rightIcon={showPassword ? 'fa-eye-slash' : 'fa-eye'}
        rightIconOnClick={() => {
          console.log('yo')
          setShowPassword(!showPassword)
        }}
      />
    </div>
  )
}

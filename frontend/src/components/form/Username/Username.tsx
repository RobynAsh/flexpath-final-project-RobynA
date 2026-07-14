import { faUser } from '@fortawesome/free-regular-svg-icons'
import { TextField } from '../TextField/TextField'
import type { ChangeEventHandler } from 'react'

export const Username = ({
  value,
  onChange,
}: {
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="username" className="text-lg sm:text-xl">
        Username
      </label>
      <TextField
        id="username"
        placeholder="Enter your username"
        leftIcon={faUser}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  )
}

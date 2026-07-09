import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { TextField } from '../TextField/TextField'

export const EmailAddress = () => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="email" className="text-lg sm:text-xl">
        Email Address
      </label>
      {/* Input */}
      <TextField
        id="email"
        placeholder="you@example.com"
        leftIcon={faEnvelope}
      />
    </div>
  )
}

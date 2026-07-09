import { TextField } from '../TextField/TextField'

export const EmailAddress = () => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="email" className="text-xl">
        Email Address
      </label>
      {/* Input */}
      <TextField
        id="email"
        placeholder="you@example.com"
        leftIcon="fa-envelope"
      />
    </div>
  )
}

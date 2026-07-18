import { FormEventHandler, useState } from 'react'
import { Password } from '../../form/Password/Password'
import { Username } from '../../form/Username/Username'
import { PreLoginLayout } from '../../layouts/PreLoginLayout/PreLoginLayout'
import { Button } from '../../atoms/Button/Button'
import { DashBorder } from '../../atoms/DashBorder/DashBorder'
import { faFrog, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navigate, useNavigate } from 'react-router-dom'

export const CreateAccount = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean
}) => {
  const navigate = useNavigate()

  const [createAccountError, setCreateAccountError] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const onCreateAccount: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setCreateAccountError('')

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error('There was an error creating your account.')
      }

      navigate('/login', { replace: true, state: { createdAccount: true } })
    } catch (error) {
      setCreateAccountError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
      )
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <PreLoginLayout
      title="Welcome!"
      subtitle="Create an account to start your creative journey."
    >
      <form onSubmit={onCreateAccount} className="flex flex-col gap-3">
        <Username
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Password
          id="password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Password
          id="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        {createAccountError && (
          <p role="alert" className="text-center text-rose-600">
            {createAccountError}
          </p>
        )}
        <Button
          type="submit"
          variant="primary"
          className="items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faUserPlus} className="text-xl" />
          <span>Create Account</span>
        </Button>
        <DashBorder>
          <span className="text-xl">or</span>
        </DashBorder>
        <Button
          variant="secondary"
          className="items-center justify-center gap-2"
          onClick={() => {
            navigate('/login')
          }}
        >
          <FontAwesomeIcon icon={faFrog} className="text-xl" />
          <span>Log-in</span>
        </Button>
      </form>
    </PreLoginLayout>
  )
}

import { useState } from 'react'
import { Password } from '../../form/Password/Password'
import { Username } from '../../form/Username/Username'
import { PreLoginLayout } from '../../layouts/PreLoginLayout/PreLoginLayout'
import { Button } from '../../atoms/Button/Button'
import { DashBorder } from '../../atoms/DashBorder/DashBorder'
import { faFrog, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  useCreateAccount,
  type CreateAccountCredentials,
} from '../../../services/useCreateAccount'

type CreateAccountForm = CreateAccountCredentials & {
  confirmPassword: string
}

export const CreateAccount = () => {
  const navigate = useNavigate()
  const { mutateAsync: createAccount } = useCreateAccount()

  const [createAccountError, setCreateAccountError] = useState('')
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<CreateAccountForm>()

  const usernameField = register('username', {
    required: 'Username is required.',
  })
  const passwordField = register('password', {
    required: 'Password is required.',
    validate: (password) =>
      password === getValues('confirmPassword') || 'Passwords do not match.',
    deps: 'confirmPassword',
  })
  const confirmPasswordField = register('confirmPassword', {
    required: 'Please confirm your password.',
    validate: (confirmPassword) =>
      confirmPassword === getValues('password') || 'Passwords do not match.',
    deps: 'password',
  })

  const onCreateAccount = async ({ username, password }: CreateAccountForm) => {
    setCreateAccountError('')

    try {
      await createAccount({ username, password })

      navigate('/login', { replace: true, state: { createdAccount: true } })
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Username is already taken.'
      ) {
        setError(
          'username',
          { type: 'server', message: error.message },
          { shouldFocus: true },
        )
        return
      }

      setCreateAccountError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
      )
    }
  }

  return (
    <PreLoginLayout
      title="Welcome!"
      subtitle="Create an account to start your creative journey."
    >
      <form
        noValidate
        onSubmit={handleSubmit(onCreateAccount, () => {
          setCreateAccountError('')
        })}
        className="flex flex-col gap-3"
      >
        <Username {...usernameField} error={errors.username?.message} />
        <Password
          {...passwordField}
          id="password"
          label="Password"
          error={errors.password?.message}
        />
        <Password
          {...confirmPasswordField}
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
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
          <FontAwesomeIcon icon={faUserPlus} />
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
          <FontAwesomeIcon icon={faFrog} />
          <span>Log-in</span>
        </Button>
      </form>
    </PreLoginLayout>
  )
}

import { faFrog, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../atoms/Button/Button'
import { Checkbox } from '../../form/Checkbox/Checkbox'
import { Username } from '../../form/Username/Username'
import { Password } from '../../form/Password/Password'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DashBorder } from '../../atoms/DashBorder/DashBorder'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { clearStoredJWTToken } from '../../../helpers/loginHelpers'
import { PreLoginLayout } from '../../layouts/PreLoginLayout/PreLoginLayout'
import { useForm } from 'react-hook-form'

export type LoginResponse = {
  accessToken: {
    token: string
  }
}

type LoginLocationState = {
  createdAccount?: boolean
} | null

type LoginForm = {
  username: string
  password: string
}

export const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [rememberMe, setRememberMe] = useState(false)
  const [loginError, setLoginError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const usernameField = register('username', {
    required: 'Username is required.',
  })
  const passwordField = register('password', {
    required: 'Password is required.',
  })

  const didUserCreateAccount = (location.state as LoginLocationState)
    ?.createdAccount

  const onLogin = async ({ username, password }: LoginForm) => {
    setLoginError('')

    try {
      const response = await fetch('/auth/login', {
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
        if (response.status === 401) {
          throw new Error('Incorrect username or password.')
        }

        throw new Error('Unable to log in right now.')
      }

      const { accessToken }: LoginResponse = await response.json()
      const tokenStorage = rememberMe ? localStorage : sessionStorage

      clearStoredJWTToken()
      tokenStorage.setItem('token', accessToken.token)

      navigate('/', { replace: true })
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
      )
    }
  }

  return (
    <PreLoginLayout
      title="Welcome Back!"
      subtitle="Log in to continue your creative journey."
    >
      {didUserCreateAccount && (
        <p className="rounded border border-olive-300 bg-olive-200 p-2 text-olive-600">
          Account created successfully! Please log-in to get started.
        </p>
      )}
      <form
        noValidate
        onSubmit={handleSubmit(onLogin, () => {
          setLoginError('')
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
        <Checkbox
          id="remember-me"
          label="Remember Me"
          checked={rememberMe}
          onChange={(event) => setRememberMe(event.target.checked)}
        />
        {loginError && (
          <p role="alert" className="text-center text-rose-600">
            {loginError}
          </p>
        )}
        <Button
          type="submit"
          variant="primary"
          className="items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faFrog} className="text-xl" />
          <span>Log In</span>
        </Button>
        <DashBorder>
          <span className="text-xl">or</span>
        </DashBorder>
        <Button
          variant="secondary"
          className="items-center justify-center gap-2"
          onClick={() => {
            navigate('/create-account')
          }}
        >
          <FontAwesomeIcon icon={faUserPlus} className="text-xl" />
          <span>Create an Account</span>
        </Button>
      </form>
    </PreLoginLayout>
  )
}

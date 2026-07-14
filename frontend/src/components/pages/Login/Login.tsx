import { faFrog, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../atoms/Button/Button'
import { Checkbox } from '../../form/Checkbox/Checkbox'
import { Username } from '../../form/Username/Username'
import { Password } from '../../form/Password/Password'
import { BaseLayout } from '../../layouts/BaseLayout/BaseLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DashBorder } from '../../atoms/DashBorder/DashBorder'
import { FormEventHandler, useState } from 'react'

type LoginResponse = {
  accessToken: {
    token: string
  }
}

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loginError, setLoginError] = useState('')

  const onLogin: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
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

      tokenStorage.setItem('token', accessToken.token)
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
      )
    }
  }

  return (
    <BaseLayout containerClassName="sm:py-12">
      <div className="flex w-full flex-col items-center justify-center sm:flex-row">
        <div className="hidden w-1/2 grow items-center justify-center lg:flex">
          <img
            src="/assets/hero-polaroid.png"
            alt="Hero Polaroid"
            width="75%"
            className="pointer-events-none"
          />
        </div>
        <div className="lily-pad-container flex min-w-11/12 flex-col gap-3 rounded-2xl border-2 border-dashed border-rose-200 p-4 sm:min-w-0 sm:grow sm:px-4 sm:pt-10 lg:w-1/2 lg:max-w-[50%] lg:px-12 xl:px-20">
          {/* Welcome Back Section */}
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-4xl font-bold text-olive-400 sm:text-5xl lg:text-5xl">
              Welcome Back!
            </h1>
            <p className="text-lg sm:text-2xl">
              Log in to continue your creative journey.
            </p>
            <div className="w-full">
              <DashBorder>
                <img
                  src="/assets/heart-doodle.png"
                  alt="Heart Doodle"
                  className="h-5 w-5"
                />
              </DashBorder>
            </div>
          </div>

          {/* Login Form Section */}
          <form onSubmit={onLogin} className="flex flex-col gap-3">
            <Username
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Password
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
            >
              <FontAwesomeIcon icon={faUserPlus} className="text-xl" />
              <span>Create an Account</span>
            </Button>
          </form>
        </div>
      </div>
    </BaseLayout>
  )
}

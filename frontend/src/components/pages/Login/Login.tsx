import { faFrog, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../atoms/Button/Button'
import { Checkbox } from '../../form/Checkbox/Checkbox'
import { EmailAddress } from '../../form/EmailAddress/EmailAddress'
import { Password } from '../../form/Password/Password'
import { BaseLayout } from '../../layouts/BaseLayout/BaseLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DashBorder } from '../../atoms/DashBorder/DashBorder'

export const Login = () => {
  return (
    <BaseLayout containerClassName="sm:py-12">
      <div className="flex w-full flex-col items-center justify-center sm:flex-row">
        <div className="hidden grow lg:flex">
          <img
            src="/assets/hero-polaroid.png"
            alt="Hero Polaroid"
            width="75%"
            className="pointer-events-none"
          />
        </div>
        <div className="lily-pad-container flex min-w-11/12 flex-col gap-3 rounded-2xl border-2 border-dashed border-rose-200 p-4 sm:min-w-0 sm:grow sm:px-4 sm:pt-10 md:px-12 lg:max-w-[50%] xl:px-20">
          {/* Welcome Back Section */}
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-4xl font-bold text-olive-400 sm:text-5xl lg:text-3xl xl:text-4xl">
              Welcome Back!
            </h1>
            <p className="text-lg sm:text-2xl lg:text-lg xl:text-2xl">
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
          <div className="flex flex-col gap-3">
            <EmailAddress />
            <Password />
            <Checkbox id="remember-me" label="Remember Me" />
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
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

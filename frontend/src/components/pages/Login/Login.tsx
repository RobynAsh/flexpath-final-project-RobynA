import { EmailAddress } from '../../form/EmailAddress/EmailAddress'
import { Password } from '../../form/Password/Password'
import { BaseLayout } from '../../layouts/BaseLayout/BaseLayout'

export const Login = () => {
  return (
    <BaseLayout containerClassName="py-12">
      <div className="flex">
        <div className="lily-pad-container flex flex-col gap-3 rounded-2xl border-2 border-dashed border-rose-200 p-4 pt-10">
          {/* Welcome Back Section */}
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-5xl font-bold text-olive-400">Welcome Back!</h1>
            <p className="text-xl">Log in to continue your creative journey.</p>
            <div className="flex items-center gap-3">
              <div className="h-[2px] grow border-b-2 border-dashed border-rose-200" />
              <img
                src="/assets/heart-doodle.png"
                alt="Heart Doodle"
                className="h-5 w-5"
              />
              <div className="h-[2px] grow border-b-2 border-dashed border-rose-200" />
            </div>
          </div>

          {/* Login Form Section */}
          <div className="flex flex-col gap-3">
            <EmailAddress />
            <Password />
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

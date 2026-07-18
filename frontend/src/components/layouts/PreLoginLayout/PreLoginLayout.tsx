import { ReactNode } from 'react'
import { DashBorder } from '../../atoms/DashBorder/DashBorder'

export const PreLoginLayout = ({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center sm:flex-row sm:py-12">
      {/* Side Image for Larger Screen */}
      <div className="hidden w-1/2 grow items-center justify-center lg:flex">
        <img
          src="/assets/hero-polaroid.png"
          alt="Hero Polaroid"
          width="75%"
          className="pointer-events-none"
        />
      </div>

      <div className="lily-pad-container flex min-w-11/12 flex-col gap-3 rounded-2xl border-2 border-dashed border-rose-200 p-4 sm:min-w-0 sm:grow sm:px-4 sm:pt-10 lg:w-1/2 lg:max-w-[50%] lg:px-12 xl:px-20">
        {/* Title/Subtitle Section */}
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-4xl font-bold text-olive-400 sm:text-5xl lg:text-5xl">
            {title}
          </h1>
          <p className="text-lg sm:text-2xl">{subtitle}</p>
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

        {children}
      </div>
    </div>
  )
}

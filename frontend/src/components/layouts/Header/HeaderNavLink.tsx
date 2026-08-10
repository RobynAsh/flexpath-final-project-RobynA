import { Link, To } from 'react-router-dom'

export const HeaderNavLink = ({
  to,
  children,
}: {
  to: To
  children?: React.ReactNode
}) => {
  return (
    <Link
      to={to}
      className="group nav-link-tab bg-thread-200 hover:bg-thread-300 relative z-20 flex cursor-pointer rounded p-0.5 transition-colors duration-300 md:rounded-none md:px-0.5 md:py-0"
    >
      <div className="border-thread-100 flex grow items-center justify-center rounded border border-dashed p-1 md:border-t-0 md:border-r md:border-b-0 md:border-l md:px-2 md:py-0">
        <div className="pt-0 transition-all duration-300 group-hover:md:pt-3">
          {children}
        </div>
      </div>

      {/* Nav Tab Overhang */}
      <div className="group-hover:bg-thread-300 bg-thread-200 absolute top-full right-0 left-0 hidden h-2.5 overflow-hidden rounded-b-lg px-0.5 pb-0.5 transition-all duration-300 group-hover:h-5.5 md:block">
        <div className="border-thread-100 min-h-full w-full rounded-b border-r border-b border-l border-dashed" />
      </div>
    </Link>
  )
}

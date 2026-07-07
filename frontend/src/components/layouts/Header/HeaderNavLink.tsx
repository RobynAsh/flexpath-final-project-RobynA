export const HeaderNavLink = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="nav-link-tab bg-thread-200 relative flex cursor-pointer px-1 pt-0">
      <div className="border-thread-100 flex items-center justify-center border-r border-l border-dashed px-2">
        <div className="nav-link-text transition-all">{children}</div>
      </div>

      {/* Nav Tab Overhang */}
      <div className="nav-link-overhang bg-thread-200 absolute top-full right-0 left-0 overflow-hidden rounded-b-lg px-1 pb-1 transition-all">
        <div className="border-thread-100 min-h-full w-full border-r border-b border-l border-dashed" />
      </div>
    </div>
  )
}

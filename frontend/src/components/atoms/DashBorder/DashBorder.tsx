export const DashBorder = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="h-[2px] grow border-b-2 border-dashed border-rose-200" />
      {children}
      <div className="h-[2px] grow border-b-2 border-dashed border-rose-200" />
    </div>
  )
}

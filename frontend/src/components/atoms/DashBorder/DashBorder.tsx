export const DashBorder = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="h-0.5 grow border-b-2 border-dashed border-rose-200" />
      {children}
      {children && (
        <div className="h-0.5 grow border-b-2 border-dashed border-rose-200" />
      )}
    </div>
  )
}

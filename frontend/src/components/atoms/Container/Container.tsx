export const Container = ({
  children,
  className = '',
  gap = true,
}: {
  children: React.ReactNode
  className?: string
  gap?: boolean
}) => {
  return (
    <div
      className={`container mx-auto flex flex-col p-2 ${gap ? 'gap-3' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

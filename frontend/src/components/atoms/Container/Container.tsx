export const Container = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={`container mx-auto flex flex-col gap-3 p-2 ${className}`}>
      {children}
    </div>
  )
}

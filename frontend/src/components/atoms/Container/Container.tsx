export const Container = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={`container mx-auto flex p-2 ${className}`}>{children}</div>
  )
}

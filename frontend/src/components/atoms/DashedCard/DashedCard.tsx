export const DashedCard = ({
  background = 'bg-paper-200',
  borderColor = 'border-paper-300',
  shadow = true,
  className = '',
  children,
}: {
  background?: string
  borderColor?: string
  shadow?: boolean
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={`flex ${background} rounded p-0.5 ${shadow ? 'shadow' : ''} ${className}`}
    >
      <div className={`${borderColor} grow rounded border border-dashed p-2`}>
        {children}
      </div>
    </div>
  )
}

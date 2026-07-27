import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ChipProps {
  label: string
  onRemove?: () => void
}

export const Chip = ({ label, onRemove }: ChipProps) => {
  const displayLabel = label.charAt(0).toUpperCase() + label.slice(1)

  return (
    <span className="text-ink flex items-center gap-1 rounded-full bg-olive-100 px-3 py-1 text-base capitalize">
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${displayLabel}`}
          className="cursor-pointer text-olive-300 hover:text-olive-600"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}
    </span>
  )
}

import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

export const Checkbox = ({ id, label }: { id: string; label: string }) => {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <label
      htmlFor={id}
      className="group hover:text-ink flex cursor-pointer items-center gap-2 text-lg sm:text-xl"
    >
      <div
        className={`relative h-5 w-5 rounded-lg border-2 ${isChecked ? 'border-olive-400 bg-olive-300 group-hover:border-olive-500 group-hover:bg-olive-400' : 'border-thread-200 group-hover:border-thread-400 group-hover:bg-paper-200 bg-transparent'}`}
      >
        {isChecked && (
          <FontAwesomeIcon
            icon={faCheck}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-olive-50"
          />
        )}
      </div>
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
        className="hidden"
      />
      {label}
    </label>
  )
}

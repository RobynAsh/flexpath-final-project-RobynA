import { faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, type KeyboardEvent } from 'react'
import { Chip } from '../../atoms/Chip/Chip'

interface MultiSelectProps {
  id: string
  label: string
  value: string[]
  onChange: (_value: string[]) => void
  placeholder?: string
  error?: string
}

export const MultiSelect = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: MultiSelectProps) => {
  const [inputValue, setInputValue] = useState('')

  const addValue = () => {
    const nextValue = inputValue.trim().toLocaleLowerCase()

    if (
      nextValue &&
      !value.some(
        (selectedValue) => selectedValue.toLocaleLowerCase() === nextValue,
      )
    ) {
      onChange([...value, nextValue])
    }

    if (nextValue) {
      setInputValue('')
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault()
      addValue()
    }
  }

  const removeValue = (valueToRemove: string) => {
    onChange(value.filter((selectedValue) => selectedValue !== valueToRemove))
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={`${error ? 'text-rose-500' : ''} text-lg sm:text-xl`}
      >
        {label}
      </label>
      <div className="flex flex-col gap-1">
        <div
          className={`${error ? 'border-rose-600' : 'border-thread-200'} flex min-h-12 flex-wrap items-center gap-2 rounded-lg border-2 p-2`}
        >
          <FontAwesomeIcon
            icon={faTag}
            className="text-lg text-olive-400 sm:text-xl"
          />
          {value.map((selectedValue) => (
            <Chip
              key={selectedValue}
              label={selectedValue}
              onRemove={() => removeValue(selectedValue)}
            />
          ))}
          <input
            id={id}
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-w-40 grow bg-transparent text-lg outline-none sm:text-xl"
          />
        </div>
        {error && <p className="text-left text-rose-600">{error}</p>}
      </div>
    </div>
  )
}

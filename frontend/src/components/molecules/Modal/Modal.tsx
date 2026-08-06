import { type ReactNode } from 'react'
import { Button } from '../../atoms/Button/Button'

export type ModalButton = {
  onClick: () => void
  label: string
  disabled?: boolean
}

export const Modal = ({
  headerText,
  closeModal,
  closeDisabled = false,
  firstButton,
  secondButton,
  children,
}: {
  headerText: string
  closeModal: () => void
  closeDisabled?: boolean
  firstButton: ModalButton
  secondButton: ModalButton
  children: ReactNode
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !closeDisabled) {
          closeModal()
        }
      }}
    >
      <div className="bg-surface border-border w-full max-w-lg rounded-xl border p-5 shadow-lg">
        <h2>{headerText}</h2>

        {children}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="tertiary"
            disabled={firstButton.disabled}
            onClick={firstButton.onClick}
          >
            {firstButton.label}
          </Button>
          <Button
            variant="secondary"
            disabled={secondButton.disabled}
            onClick={secondButton.onClick}
          >
            {secondButton.label}
          </Button>
        </div>
      </div>
    </div>
  )
}

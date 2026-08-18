import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { AddMilestoneRequest } from '../../../../services/milestones/types/milestoneTypes'
import { Button } from '../../../atoms/Button/Button'
import { TextArea } from '../../../form/TextArea/TextArea'
import { TextField } from '../../../form/TextField/TextField'

type MilestoneFormValues = {
  note: string
  rowCount: string
  repeatCount: string
}

type MilestoneFormProps = {
  onSubmit: (_milestone: AddMilestoneRequest) => Promise<unknown>
}

const emptyMilestone: MilestoneFormValues = {
  note: '',
  rowCount: '',
  repeatCount: '',
}

export const MilestoneForm = ({ onSubmit }: MilestoneFormProps) => {
  const [submitError, setSubmitError] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MilestoneFormValues>({ defaultValues: emptyMilestone })

  const noteField = register('note', {
    required: 'Milestone note is required.',
    validate: (value) =>
      value.trim().length > 0 || 'Milestone note is required.',
  })
  const rowCountField = register('rowCount', {
    validate: (value) =>
      value === '' || Number(value) >= 0 || 'Row count cannot be negative.',
  })
  const repeatCountField = register('repeatCount', {
    validate: (value) =>
      value === '' || Number(value) >= 0 || 'Repeat count cannot be negative.',
  })

  const submitMilestone = async (values: MilestoneFormValues) => {
    setSubmitError('')
    setIsSaved(false)

    try {
      await onSubmit({
        note: values.note.trim(),
        rowCount: values.rowCount === '' ? 0 : Number(values.rowCount),
        repeatCount: values.repeatCount === '' ? 0 : Number(values.repeatCount),
      })
      reset(emptyMilestone)
      setIsSaved(true)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
      )
    }
  }

  useEffect(() => {
    if (isSaved) {
      const timer = setTimeout(() => {
        setIsSaved(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isSaved])

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submitMilestone)}
      className="bg-surface border-border shadow-card flex flex-col gap-4 rounded-xl border p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          {...rowCountField}
          id="milestone-row-count"
          type="number"
          min="0"
          step="1"
          label="Row Count"
          placeholder="Optional"
          error={errors.rowCount?.message}
        />
        <TextField
          {...repeatCountField}
          id="milestone-repeat-count"
          type="number"
          min="0"
          step="1"
          label="Repeat Count"
          placeholder="Optional"
          error={errors.repeatCount?.message}
        />
      </div>

      <TextArea
        {...noteField}
        id="milestone-note"
        label="Note"
        placeholder="What progress did you make?"
        error={errors.note?.message}
      />

      {submitError && (
        <p role="alert" className="text-rose-600">
          {submitError}
        </p>
      )}
      {isSaved && (
        <p role="status" className="text-olive-600">
          Milestone added.
        </p>
      )}

      <div className="sm:w-52 sm:self-end">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          <FontAwesomeIcon icon={faPlus} />
          {isSubmitting ? 'Adding...' : 'Add Milestone'}
        </Button>
      </div>
    </form>
  )
}

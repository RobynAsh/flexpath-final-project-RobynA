import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import type { ProjectSummary } from '../../../../services/projects/types/projectTypes'
import type { AdminMilestoneRequest } from '../../../../services/milestones/types/milestoneTypes'
import { Button } from '../../../atoms/Button/Button'
import { Select } from '../../../form/Select/Select'
import { TextArea } from '../../../form/TextArea/TextArea'
import { TextField } from '../../../form/TextField/TextField'

type AdminMilestoneFormProps = {
  projects: ProjectSummary[]
  initialValues?: AdminMilestoneRequest
  onSubmit: (_milestone: AdminMilestoneRequest) => Promise<unknown>
  successRedirectPath: string
}

const emptyMilestone: AdminMilestoneRequest = {
  projectId: 0,
  note: '',
  rowCount: 0,
  repeatCount: 0,
}

export const AdminMilestoneForm = ({
  projects,
  initialValues = emptyMilestone,
  onSubmit,
  successRedirectPath,
}: AdminMilestoneFormProps) => {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminMilestoneRequest>({ defaultValues: initialValues })

  const projectField = register('projectId', {
    valueAsNumber: true,
    validate: (value) =>
      projects.some(({ project }) => project.projectId === value) ||
      'Project is required.',
  })
  const noteField = register('note', {
    required: 'Milestone note is required.',
    validate: (value) =>
      value.trim().length > 0 || 'Milestone note is required.',
  })
  const rowCountField = register('rowCount', {
    valueAsNumber: true,
    validate: (value) =>
      (Number.isInteger(value) && value >= 0) ||
      'Row count must be a non-negative whole number.',
  })
  const repeatCountField = register('repeatCount', {
    valueAsNumber: true,
    validate: (value) =>
      (Number.isInteger(value) && value >= 0) ||
      'Repeat count must be a non-negative whole number.',
  })

  const submitMilestone = async (milestone: AdminMilestoneRequest) => {
    setSubmitError('')

    try {
      await onSubmit({ ...milestone, note: milestone.note.trim() })
      navigate(successRedirectPath)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
      )
    }
  }

  const projectOptions = [
    { value: '0', label: 'Select a project' },
    ...projects.map(({ project }) => ({
      value: String(project.projectId),
      label: `${project.name} (${project.username})`,
    })),
  ]

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submitMilestone)}
      className="flex w-full max-w-4xl flex-col gap-5 md:self-center"
    >
      <Select
        {...projectField}
        id="projectId"
        label="Project"
        options={projectOptions}
        error={errors.projectId?.message}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          {...rowCountField}
          id="rowCount"
          type="number"
          min="0"
          step="1"
          label="Row Count"
          error={errors.rowCount?.message}
        />
        <TextField
          {...repeatCountField}
          id="repeatCount"
          type="number"
          min="0"
          step="1"
          label="Repeat Count"
          error={errors.repeatCount?.message}
        />
      </div>

      <TextArea
        {...noteField}
        id="note"
        label="Note"
        placeholder="What progress was made?"
        error={errors.note?.message}
      />

      {submitError && (
        <p role="alert" className="text-center text-rose-600">
          {submitError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link to={successRedirectPath} className="sm:w-44">
          <Button variant="secondary">
            <FontAwesomeIcon icon={faArrowLeft} />
            Cancel
          </Button>
        </Link>
        <div className="sm:w-44">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            <FontAwesomeIcon icon={faFloppyDisk} />
            {isSubmitting ? 'Saving...' : 'Save Milestone'}
          </Button>
        </div>
      </div>
    </form>
  )
}

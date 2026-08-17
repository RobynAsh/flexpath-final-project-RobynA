import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import type { PatternDetails } from '../../../services/patterns/types/patternTypes'
import type { AddProjectRequest } from '../../../services/projects/types/projectFormTypes'
import { Button } from '../../atoms/Button/Button'
import { Checkbox } from '../../form/Checkbox/Checkbox'
import { MultiSelect } from '../../form/MultiSelect/MultiSelect'
import { Select } from '../../form/Select/Select'
import { TextArea } from '../../form/TextArea/TextArea'
import { TextField } from '../../form/TextField/TextField'

type ProjectFormProps = {
  patterns: PatternDetails[]
  initialValues?: AddProjectRequest
  onSubmit: (_project: AddProjectRequest) => Promise<unknown>
  successRedirectPath: string
}

const emptyProject: AddProjectRequest = {
  patternId: 0,
  name: '',
  status: 'Not Started',
  isPublic: false,
  care: '',
  gauge: '',
  tags: [],
  dateStarted: '',
  dateFinished: '',
  dateNeededBy: '',
}

const statusOptions = [
  { value: 'Not Started', label: 'Not Started' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
]

export const ProjectForm = ({
  patterns,
  initialValues = emptyProject,
  onSubmit,
  successRedirectPath,
}: ProjectFormProps) => {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProjectRequest>({ defaultValues: initialValues })

  const patternField = register('patternId', {
    valueAsNumber: true,
    validate: (value) => value > 0 || 'Pattern is required.',
  })
  const nameField = register('name', {
    required: 'Project name is required.',
  })
  const statusField = register('status', {
    required: 'Status is required.',
  })
  const careField = register('care')
  const gaugeField = register('gauge')
  const dateStartedField = register('dateStarted')
  const dateFinishedField = register('dateFinished')
  const dateNeededByField = register('dateNeededBy')

  const submitProject = async (project: AddProjectRequest) => {
    setSubmitError('')

    try {
      await onSubmit(project)
      navigate(successRedirectPath)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
      )
    }
  }

  const patternOptions = [
    { value: '0', label: 'Select a pattern' },
    ...patterns.map(({ pattern }) => ({
      value: String(pattern.patternId),
      label: pattern.name,
    })),
  ]

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submitProject)}
      className="flex w-full max-w-4xl flex-col gap-5 md:self-center"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          {...nameField}
          id="name"
          label="Project Name"
          placeholder="Enter the project name"
          error={errors.name?.message}
        />
        <div>
          <Select
            {...patternField}
            id="patternId"
            label="Pattern"
            error={errors.patternId?.message}
            options={patternOptions}
            aria-invalid={Boolean(errors.patternId)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          {...statusField}
          id="status"
          label="Status"
          options={statusOptions}
        />
        <TextField
          {...gaugeField}
          id="gauge"
          label="Gauge"
          placeholder="e.g. 18 stitches and 24 rows per 4 inches"
          maxLength={255}
        />
      </div>

      <Controller
        control={control}
        name="tags"
        render={({ field }) => (
          <MultiSelect
            id="tags"
            label="Tags"
            value={field.value}
            onChange={field.onChange}
            placeholder="Type a tag and press Enter"
          />
        )}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <TextField
          {...dateStartedField}
          id="dateStarted"
          type="date"
          label="Date Started"
        />
        <TextField
          {...dateFinishedField}
          id="dateFinished"
          type="date"
          label="Date Finished"
        />
        <TextField
          {...dateNeededByField}
          id="dateNeededBy"
          type="date"
          label="Date Needed By"
        />
      </div>

      <TextArea
        {...careField}
        id="care"
        label="Care Instructions"
        placeholder="Add washing, drying, or other care instructions"
        maxLength={1000}
      />

      <Controller
        control={control}
        name="isPublic"
        render={({ field }) => (
          <Checkbox
            id="isPublic"
            label="Make this project public"
            checked={field.value}
            onChange={field.onChange}
          />
        )}
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
          <Button type="submit" variant="primary">
            <FontAwesomeIcon icon={faFloppyDisk} />
            Save Project
          </Button>
        </div>
      </div>
    </form>
  )
}

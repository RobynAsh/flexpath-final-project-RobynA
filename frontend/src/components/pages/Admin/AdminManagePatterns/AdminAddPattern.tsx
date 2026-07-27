import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import {
  useAddPattern,
  type AddPatternRequest,
} from '../../../../services/useAddPattern'
import { Button } from '../../../atoms/Button/Button'
import { MultiSelect } from '../../../form/MultiSelect/MultiSelect'
import { TextArea } from '../../../form/TextArea/TextArea'
import { TextField } from '../../../form/TextField/TextField'
import { Username } from '../../../form/Username/Username'

export const AdminAddPattern = () => {
  const navigate = useNavigate()
  const { mutateAsync: addPattern } = useAddPattern()
  const [addPatternError, setAddPatternError] = useState('')

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddPatternRequest>({
    defaultValues: {
      tags: [],
    },
  })

  const usernameField = register('username', {
    required: 'Username is required.',
  })
  const nameField = register('name', {
    required: 'Pattern name is required.',
  })
  const designerField = register('designer', {
    required: 'Designer is required.',
  })
  const categoryField = register('category', {
    required: 'Category is required.',
  })
  const techniqueField = register('technique', {
    required: 'Technique is required.',
  })
  const difficultyField = register('difficulty', {
    required: 'Difficulty is required.',
  })
  const descriptionField = register('description', {
    required: 'Description is required.',
  })
  const linkField = register('link', {
    required: 'Pattern URL is required.',
  })
  const imageUrlField = register('imageUrl')

  const onSubmit = async (pattern: AddPatternRequest) => {
    setAddPatternError('')

    try {
      await addPattern(pattern)
      navigate('/admin/patterns')
    } catch (error) {
      setAddPatternError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
      )
    }
  }

  return (
    <div className="flex w-full max-w-4xl flex-col gap-5 md:self-center">
      <div>
        <h1>Add Pattern</h1>
        <h4>Add a pattern to the Frog Log catalog.</h4>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Username
          {...usernameField}
          placeholder="Who owns this pattern?"
          error={errors.username?.message}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            {...nameField}
            id="name"
            label="Pattern Name"
            placeholder="Enter the pattern name"
            error={errors.name?.message}
          />
          <TextField
            {...designerField}
            id="designer"
            label="Designer"
            placeholder="Enter the designer's name"
            error={errors.designer?.message}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <TextField
            {...categoryField}
            id="category"
            label="Category"
            placeholder="e.g. Sweater"
            error={errors.category?.message}
          />
          <TextField
            {...techniqueField}
            id="technique"
            label="Technique"
            placeholder="e.g. Crochet"
            error={errors.technique?.message}
          />
          <TextField
            {...difficultyField}
            id="difficulty"
            label="Difficulty"
            placeholder="e.g. Beginner"
            error={errors.difficulty?.message}
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

        <TextArea
          {...descriptionField}
          id="description"
          label="Description"
          placeholder="Describe the pattern"
          maxLength={1000}
          error={errors.description?.message}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            {...linkField}
            id="link"
            type="url"
            label="Pattern URL"
            placeholder="https://example.com/pattern"
            error={errors.link?.message}
          />
          <TextField
            {...imageUrlField}
            id="imageUrl"
            type="url"
            label="Image URL"
            placeholder="https://example.com/pattern-image.jpg"
          />
        </div>

        {addPatternError && (
          <p role="alert" className="text-center text-rose-600">
            {addPatternError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link to="/admin/patterns" className="sm:w-44">
            <Button variant="secondary">
              <FontAwesomeIcon icon={faArrowLeft} />
              Cancel
            </Button>
          </Link>
          <div className="sm:w-44">
            <Button type="submit" variant="primary">
              <FontAwesomeIcon icon={faFloppyDisk} />
              Save Pattern
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

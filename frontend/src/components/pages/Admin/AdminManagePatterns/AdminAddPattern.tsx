import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons'
import { faAdd, faArrowLeft, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import {
  useAddPattern,
  type AddPatternRequest,
  type PatternYarn,
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
      yarn: [],
    },
  })

  const {
    register: registerYarn,
    handleSubmit: handleYarnSubmit,
    reset: resetYarn,
    formState: { errors: yarnErrors },
  } = useForm<PatternYarn>()

  const {
    fields: yarnFields,
    append: appendYarn,
    remove: removeYarn,
  } = useFieldArray({
    control,
    name: 'yarn',
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

  const yarnWeightField = registerYarn('weight', {
    required: 'Weight is required.',
    valueAsNumber: true,
    min: {
      value: 1,
      message: 'Weight must be between 1 and 7.',
    },
    max: {
      value: 7,
      message: 'Weight must be between 1 and 7.',
    },
  })
  const yarnYardageField = registerYarn('yardage', {
    required: 'Yardage is required.',
    valueAsNumber: true,
    min: {
      value: 1,
      message: 'Yardage must be greater than 0.',
    },
  })
  const yarnGramsField = registerYarn('grams', {
    required: 'Grams are required.',
    valueAsNumber: true,
    min: {
      value: 1,
      message: 'Grams must be greater than 0.',
    },
  })
  const yarnDescriptionField = registerYarn('description', {
    required: 'Yarn description is required.',
  })

  const onAddYarn = (yarn: PatternYarn) => {
    appendYarn(yarn)
    resetYarn()
  }

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

      {/* Pattern Details Form */}
      <form
        id="pattern-details"
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
      </form>

      {/* Pattern Required Yarn */}
      <h2 className="border-thread-200 border-b-2 border-dashed pb-2">
        Yarn Required
      </h2>

      <div className="flex flex-col gap-2">
        <form className="border-thread-200 flex flex-col gap-3 rounded-lg border-2 p-3">
          <TextField
            {...yarnDescriptionField}
            id="yarn-description"
            label="Description"
            placeholder="Describe this yarn requirement (e.g. Body, Cloud, etc.)"
            maxLength={255}
            error={yarnErrors.description?.message}
          />

          <div className="grid gap-3 md:grid-cols-3">
            <TextField
              {...yarnWeightField}
              id="yarn-weight"
              type="number"
              label="Weight"
              placeholder="1 - 7"
              min={1}
              max={7}
              error={yarnErrors.weight?.message}
            />
            <TextField
              {...yarnYardageField}
              id="yarn-yardage"
              type="number"
              label="Yardage"
              placeholder="e.g. 251"
              min={1}
              error={yarnErrors.yardage?.message}
            />
            <TextField
              {...yarnGramsField}
              id="yarn-grams"
              type="number"
              label="Grams"
              placeholder="e.g. 142"
              min={1}
              error={yarnErrors.grams?.message}
            />
          </div>

          <Button
            type="submit"
            variant="tertiary"
            onClick={handleYarnSubmit(onAddYarn)}
          >
            <FontAwesomeIcon icon={faAdd} />
            Add Yarn Requirement
          </Button>
        </form>

        {yarnFields.map((yarn, index) => (
          <div
            key={yarn.id}
            className="border-thread-200 flex flex-col gap-2 rounded-lg border-2 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-lg sm:text-xl">{yarn.description}</p>
              <p className="text-thread-400">
                Weight {yarn.weight} · {yarn.yardage} yards · {yarn.grams} grams
              </p>
            </div>
            <div className="sm:w-32">
              <Button
                type="button"
                variant="secondary"
                onClick={() => removeYarn(index)}
              >
                <FontAwesomeIcon icon={faXmark} />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pattern Required Tool(s) */}
      <h2 className="border-thread-200 border-b-2 border-dashed pb-2">
        Tool(s) Required
      </h2>

      <div className="border-thread-200 flex flex-col rounded-lg border-2 p-2">
        <Button variant="tertiary">
          <FontAwesomeIcon icon={faAdd} />
          Add Tool Requirement
        </Button>
      </div>

      {/* Pattern Required Material(s) */}
      <h2 className="border-thread-200 border-b-2 border-dashed pb-2">
        Material(s) Required
      </h2>

      <div className="border-thread-200 flex flex-col rounded-lg border-2 p-2">
        <Button variant="tertiary">
          <FontAwesomeIcon icon={faAdd} />
          Add Material Requirement
        </Button>
      </div>

      {addPatternError && (
        <p role="alert" className="text-center text-rose-600">
          {addPatternError}
        </p>
      )}

      {/* Pattern Details Form Submit */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link to="/admin/patterns" className="sm:w-44">
          <Button variant="secondary">
            <FontAwesomeIcon icon={faArrowLeft} />
            Cancel
          </Button>
        </Link>
        <div className="sm:w-44">
          <Button type="submit" variant="primary" form="pattern-details">
            <FontAwesomeIcon icon={faFloppyDisk} />
            Save Pattern
          </Button>
        </div>
      </div>
    </div>
  )
}

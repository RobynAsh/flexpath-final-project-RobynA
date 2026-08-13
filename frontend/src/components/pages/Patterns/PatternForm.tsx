import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons'
import { faAdd, faArrowLeft, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import type {
  AddPatternRequest,
  PatternMaterial,
  PatternTool,
  PatternYarn,
} from '../../../services/patterns/types/patternFormTypes'
import { Button } from '../../atoms/Button/Button'
import { MultiSelect } from '../../form/MultiSelect/MultiSelect'
import { TextArea } from '../../form/TextArea/TextArea'
import { TextField } from '../../form/TextField/TextField'
import { Username } from '../../form/Username/Username'

type PatternFormProps = {
  includeUsername: boolean
  initialValues?: AddPatternRequest
  onSubmit: (_pattern: AddPatternRequest) => Promise<unknown>
  successRedirectPath: string
}

const emptyPattern: AddPatternRequest = {
  username: '',
  name: '',
  designer: '',
  category: '',
  technique: '',
  difficulty: '',
  description: '',
  link: '',
  imageUrl: '',
  tags: [],
  yarn: [],
  tools: [],
  materials: [],
}

export const PatternForm = ({
  includeUsername,
  initialValues = emptyPattern,
  onSubmit,
  successRedirectPath,
}: PatternFormProps) => {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')

  const {
    control,
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<AddPatternRequest>({ defaultValues: initialValues })

  const {
    register: registerYarn,
    handleSubmit: handleYarnSubmit,
    reset: resetYarn,
    formState: { errors: yarnErrors },
  } = useForm<PatternYarn>()

  const {
    register: registerTool,
    handleSubmit: handleToolSubmit,
    reset: resetTool,
    formState: { errors: toolErrors },
  } = useForm<PatternTool>()

  const {
    register: registerMaterial,
    handleSubmit: handleMaterialSubmit,
    reset: resetMaterial,
    formState: { errors: materialErrors },
  } = useForm<PatternMaterial>()

  const {
    fields: yarnFields,
    append: appendYarn,
    remove: removeYarn,
  } = useFieldArray({
    control,
    name: 'yarn',
  })

  const {
    fields: toolFields,
    append: appendTool,
    remove: removeTool,
  } = useFieldArray({
    control,
    name: 'tools',
  })

  const {
    fields: materialFields,
    append: appendMaterial,
    remove: removeMaterial,
  } = useFieldArray({
    control,
    name: 'materials',
  })

  const usernameField = register('username', {
    required: includeUsername ? 'Username is required.' : false,
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

  const toolTypeField = registerTool('toolType', {
    required: 'Tool type is required.',
  })
  const toolSizeField = registerTool('sizeMm', {
    required: 'Size is required.',
    valueAsNumber: true,
    min: {
      value: 0.01,
      message: 'Size must be greater than 0.',
    },
  })

  const materialNameField = registerMaterial('name', {
    required: 'Material name is required.',
  })
  const materialDescriptionField = registerMaterial('description')
  const materialQuantityField = registerMaterial('quantity', {
    required: 'Quantity is required.',
    valueAsNumber: true,
    min: {
      value: 1,
      message: 'Quantity must be greater than 0.',
    },
  })

  const onAddYarn = (yarn: PatternYarn) => {
    appendYarn(yarn)
    clearErrors('root.yarn')
    resetYarn()
  }

  const onAddTool = (tool: PatternTool) => {
    appendTool(tool)
    clearErrors('root.tools')
    resetTool()
  }

  const onAddMaterial = (material: PatternMaterial) => {
    appendMaterial(material)
    resetMaterial()
  }

  const submitPattern = async (pattern: AddPatternRequest) => {
    setSubmitError('')

    if (pattern.yarn.length === 0 || pattern.tools.length === 0) {
      if (pattern.yarn.length === 0) {
        setError('root.yarn', {
          message: 'At least one yarn is required.',
        })
      }
      if (pattern.tools.length === 0) {
        setError('root.tools', {
          message: 'At least one tool is required.',
        })
      }
      return
    }

    try {
      await onSubmit(pattern)
      navigate(successRedirectPath)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
      )
    }
  }

  return (
    <div className="flex w-full max-w-4xl flex-col gap-5 md:self-center">
      {/* Pattern Details Form */}
      <form
        id="pattern-details"
        noValidate
        onSubmit={handleSubmit(submitPattern)}
        className="flex flex-col gap-4"
      >
        {includeUsername && (
          <Username
            {...usernameField}
            placeholder="Who owns this pattern?"
            error={errors.username?.message}
          />
        )}

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
        {errors.root?.yarn?.message && (
          <p role="alert" className="text-center text-rose-600">
            {errors.root.yarn.message}
          </p>
        )}

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
        Tools Required
      </h2>

      <div className="flex flex-col gap-2">
        {errors.root?.tools?.message && (
          <p role="alert" className="text-center text-rose-600">
            {errors.root.tools.message}
          </p>
        )}

        <form className="border-thread-200 flex flex-col gap-3 rounded-lg border-2 p-3">
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              {...toolTypeField}
              id="tool-type"
              label="Tool Type"
              placeholder="e.g. Crochet hook"
              maxLength={255}
              error={toolErrors.toolType?.message}
            />
            <TextField
              {...toolSizeField}
              id="tool-size-mm"
              type="number"
              label="Size (mm)"
              placeholder="e.g. 5.5"
              min={0.01}
              step="any"
              error={toolErrors.sizeMm?.message}
            />
          </div>

          <Button
            type="submit"
            variant="tertiary"
            onClick={handleToolSubmit(onAddTool)}
          >
            <FontAwesomeIcon icon={faAdd} />
            Add Tool Requirement
          </Button>
        </form>

        {toolFields.map((tool, index) => (
          <div
            key={tool.id}
            className="border-thread-200 flex flex-col gap-2 rounded-lg border-2 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-lg sm:text-xl">{tool.toolType}</p>
              <p className="text-thread-400">{tool.sizeMm} mm</p>
            </div>
            <div className="sm:w-32">
              <Button
                type="button"
                variant="secondary"
                onClick={() => removeTool(index)}
              >
                <FontAwesomeIcon icon={faXmark} />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pattern Required Material(s) */}
      <h2 className="border-thread-200 border-b-2 border-dashed pb-2">
        Materials Required
      </h2>

      <div className="flex flex-col gap-2">
        <form className="border-thread-200 flex flex-col gap-3 rounded-lg border-2 p-3">
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              {...materialNameField}
              id="material-name"
              label="Material Name"
              placeholder="e.g. Buttons"
              maxLength={255}
              error={materialErrors.name?.message}
            />
            <TextField
              {...materialQuantityField}
              id="material-quantity"
              type="number"
              label="Quantity"
              placeholder="e.g. 6"
              min={1}
              error={materialErrors.quantity?.message}
            />
          </div>

          <TextField
            {...materialDescriptionField}
            id="material-description"
            label="Description"
            placeholder="Describe this material requirement"
            maxLength={1000}
            error={materialErrors.description?.message}
          />

          <Button
            type="submit"
            variant="tertiary"
            onClick={handleMaterialSubmit(onAddMaterial)}
          >
            <FontAwesomeIcon icon={faAdd} />
            Add Material Requirement
          </Button>
        </form>

        {materialFields.map((material, index) => (
          <div
            key={material.id}
            className="border-thread-200 flex flex-col gap-2 rounded-lg border-2 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-lg sm:text-xl">{material.name}</p>
              <p className="text-thread-400">
                Quantity: {material.quantity}
                {material.description ? ` · ${material.description}` : ''}
              </p>
            </div>
            <div className="sm:w-32">
              <Button
                type="button"
                variant="secondary"
                onClick={() => removeMaterial(index)}
              >
                <FontAwesomeIcon icon={faXmark} />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {submitError && (
        <p role="alert" className="text-center text-rose-600">
          {submitError}
        </p>
      )}

      {/* Pattern Details Form Submit */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link to={successRedirectPath} className="sm:w-44">
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

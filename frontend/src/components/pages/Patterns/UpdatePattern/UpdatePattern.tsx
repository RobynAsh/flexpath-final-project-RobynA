import { Link, useParams } from 'react-router-dom'
import { useGetPattern } from '../../../../services/useGetPattern'
import type { AddPatternRequest } from '../../../../services/types/patternFormTypes'
import { useUpdatePattern } from '../../../../services/useUpdatePattern'
import { PatternForm } from '../PatternForm'

export const UpdatePattern = () => {
  const { patternId: patternIdParam } = useParams()
  const patternId = Number(patternIdParam)
  const { data: patternDetails, isPending, isError } = useGetPattern(patternId)

  const { mutateAsync: updatePattern } = useUpdatePattern(patternId)

  if (isPending) {
    return <p role="status">Loading pattern...</p>
  }

  if (
    !Number.isInteger(patternId) ||
    patternId <= 0 ||
    isError ||
    !patternDetails
  ) {
    return (
      <div className="flex flex-col gap-3">
        <p>Unable to load the pattern. It may not exist.</p>
        <Link className="text-olive-600 underline" to="/patterns">
          Return to Patterns
        </Link>
      </div>
    )
  }

  const initialValues: AddPatternRequest = {
    username: '',
    name: patternDetails.pattern.name,
    designer: patternDetails.pattern.designer ?? '',
    category: patternDetails.pattern.category ?? '',
    technique: patternDetails.pattern.technique ?? '',
    difficulty: patternDetails.pattern.difficulty ?? '',
    description: patternDetails.pattern.description ?? '',
    link: patternDetails.pattern.link ?? '',
    imageUrl: patternDetails.pattern.imageUrl ?? '',
    tags: patternDetails.tags.map((tag) => tag.name),
    yarn: patternDetails.yarn.map(
      ({ weight, yardage, grams, description }) => ({
        weight,
        yardage,
        grams,
        description: description ?? '',
      }),
    ),
    tools: patternDetails.tools.map(({ toolType, sizeMm }) => ({
      toolType,
      sizeMm,
    })),
    materials: patternDetails.materials.map(
      ({ name, description, quantity }) => ({
        name,
        description: description ?? '',
        quantity,
      }),
    ),
  }

  return (
    <div className="flex w-full max-w-4xl flex-col gap-5 md:self-center">
      <div>
        <h1>Update Pattern</h1>
        <h4>Update a pattern in your Frog Log.</h4>
      </div>

      <PatternForm
        includeUsername={false}
        initialValues={initialValues}
        onSubmit={updatePattern}
        successRedirectPath={`/patterns/${patternId}`}
      />
    </div>
  )
}

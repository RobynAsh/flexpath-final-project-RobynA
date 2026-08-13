import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDeletePattern } from '../../../../services/patterns/useDeletePattern'
import { useGetPattern } from '../../../../services/patterns/useGetPattern'
import { Button } from '../../../atoms/Button/Button'
import { Chip } from '../../../atoms/Chip/Chip'
import { Modal } from '../../../molecules/Modal/Modal'

const displayValue = (value: string | null) => value || 'Not provided'

const formatDateTime = (value: string) => new Date(value).toLocaleString()

export const Pattern = () => {
  const navigate = useNavigate()
  const { patternId: patternIdParam } = useParams()
  const patternId = Number(patternIdParam)
  const { data: details, isPending, isError } = useGetPattern(patternId)
  const deletePattern = useDeletePattern()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const confirmDelete = () => {
    deletePattern.mutate(patternId, {
      onSuccess: () => navigate('/patterns'),
    })
  }

  if (isPending) {
    return <p role="status">Loading pattern...</p>
  }

  if (!Number.isInteger(patternId) || patternId <= 0 || isError || !details) {
    return (
      <div className="flex flex-col gap-3">
        <p role="alert">Unable to load the pattern. It may not exist.</p>
        <Link className="text-olive-600 underline" to="/patterns">
          Return to Patterns
        </Link>
      </div>
    )
  }

  const { pattern, tags, yarn, tools, materials } = details

  return (
    <div className="flex w-full max-w-5xl flex-col gap-6 md:self-center">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1>{pattern.name}</h1>
          <p className="text-muted text-lg">by {pattern.designer}</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row md:shrink-0">
          <div>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <FontAwesomeIcon icon={faTrash} />
              Delete Pattern
            </Button>
          </div>
          <div>
            <Link to={`/patterns/${pattern.patternId}/update`}>
              <Button variant="tertiary">
                <FontAwesomeIcon icon={faPen} />
                Edit Pattern
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-surface border-border shadow-card grid gap-5 rounded-xl border p-5 md:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
        <div className="space-y-3">
          <h2>Pattern Information</h2>

          {tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li key={tag.tagId}>
                  <Chip label={tag.name} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No tags</p>
          )}

          <p className="whitespace-pre-wrap">
            {displayValue(pattern.description)}
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {pattern.link ? (
              <a
                className="text-olive-600 underline hover:text-olive-400"
                href={pattern.link}
                target="_blank"
                rel="noreferrer"
              >
                View pattern instructions
              </a>
            ) : (
              <span className="text-muted">No pattern URL provided</span>
            )}
            {pattern.imageUrl && (
              <a
                className="text-olive-600 underline hover:text-olive-400"
                href={pattern.imageUrl}
                target="_blank"
                rel="noreferrer"
              >
                View pattern image
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[max-content_1fr] content-start gap-x-4 gap-y-2 rounded-lg bg-olive-50 p-4">
          <p className="font-bold">Category</p>
          <p>{displayValue(pattern.category)}</p>
          <p className="font-bold">Technique</p>
          <p>{displayValue(pattern.technique)}</p>
          <p className="font-bold">Difficulty</p>
          <p>{displayValue(pattern.difficulty)}</p>
          <p className="font-bold">Created</p>
          <p>{formatDateTime(pattern.createdAt)}</p>
          <p className="font-bold">Updated</p>
          <p>{formatDateTime(pattern.updatedAt)}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="border-thread-200 border-b-2 border-dashed pb-2">
          Yarn Required
        </h2>
        {yarn.length > 0 ? (
          <ul className="grid gap-3 md:grid-cols-2">
            {yarn.map((item) => (
              <li
                className="border-thread-200 rounded-lg border-2 p-4"
                key={item.patternYarnId}
              >
                <p className="text-lg font-bold">
                  {displayValue(item.description)}
                </p>
                <p className="text-thread-400">
                  Weight {item.weight} · {item.yardage} yards · {item.grams}{' '}
                  grams
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No yarn requirements</p>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="border-thread-200 border-b-2 border-dashed pb-2">
          Tools Required
        </h2>
        {tools.length > 0 ? (
          <ul className="grid gap-3 md:grid-cols-2">
            {tools.map((tool) => (
              <li
                className="border-thread-200 rounded-lg border-2 p-4"
                key={tool.patternToolId}
              >
                <p className="text-lg font-bold">{tool.toolType}</p>
                <p className="text-thread-400">{tool.sizeMm} mm</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No tool requirements</p>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="border-thread-200 border-b-2 border-dashed pb-2">
          Materials Required
        </h2>
        {materials.length > 0 ? (
          <ul className="grid gap-3 md:grid-cols-2">
            {materials.map((material) => (
              <li
                className="border-thread-200 rounded-lg border-2 p-4"
                key={material.patternMaterialId}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-lg font-bold">{material.name}</p>
                  <p className="text-thread-400">
                    Quantity: {material.quantity}
                  </p>
                </div>
                {material.description && <p>{material.description}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No material requirements</p>
        )}
      </div>

      {isDeleteModalOpen && (
        <Modal
          headerText="Delete Pattern?"
          closeModal={() => setIsDeleteModalOpen(false)}
          closeDisabled={deletePattern.isPending}
          firstButton={{
            label: 'Cancel',
            onClick: () => setIsDeleteModalOpen(false),
            disabled: deletePattern.isPending,
          }}
          secondButton={{
            label: deletePattern.isPending ? 'Deleting...' : 'Delete Pattern',
            onClick: confirmDelete,
            disabled: deletePattern.isPending,
          }}
        >
          <p className="my-4">
            Are you sure you want to delete {pattern.name}?
          </p>

          {deletePattern.isError && (
            <p role="alert" className="mb-4 text-rose-500">
              Unable to delete the pattern. Please try again.
            </p>
          )}
        </Modal>
      )}
    </div>
  )
}

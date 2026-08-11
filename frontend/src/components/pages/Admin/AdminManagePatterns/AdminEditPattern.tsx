import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAdminDeletePatterns } from '../../../../services/admin/useAdminDeletePatterns'
import { useAdminGetAllPatterns } from '../../../../services/admin/useAdminGetAllPatterns'
import { useAdminUpdatePattern } from '../../../../services/admin/useAdminUpdatePattern'
import type { AddPatternRequest } from '../../../../services/types/patternFormTypes'
import { Button } from '../../../atoms/Button/Button'
import { Modal } from '../../../molecules/Modal/Modal'
import { PatternForm } from '../../Patterns/PatternForm'

export const AdminEditPattern = () => {
  const navigate = useNavigate()
  const { patternId: patternIdParam } = useParams()
  const patternId = Number(patternIdParam)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const {
    data: patterns,
    isPending,
    isError: isLoadError,
  } = useAdminGetAllPatterns()
  const patternDetails = patterns?.find(
    ({ pattern }) => pattern.patternId === patternId,
  )

  const { mutateAsync: updatePattern } = useAdminUpdatePattern(patternId)
  const deletePatterns = useAdminDeletePatterns()

  const confirmDelete = () => {
    deletePatterns.mutate([patternId], {
      onSuccess: () => navigate('/admin/patterns'),
    })
  }

  if (isPending) {
    return <p role="status">Loading pattern...</p>
  }

  if (isLoadError) {
    return (
      <p role="alert" className="text-rose-600">
        Unable to load the pattern. Please try again.
      </p>
    )
  }

  if (!patternDetails) {
    return (
      <div className="flex flex-col gap-3">
        <p role="alert">Pattern not found.</p>
        <Link to="/admin/patterns">Return to Manage Patterns</Link>
      </div>
    )
  }

  const initialValues: AddPatternRequest = {
    username: patternDetails.pattern.username,
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
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <div>
          <h1>Edit Pattern</h1>
          <h4>Update a pattern in the Frog Log catalog.</h4>
        </div>
        <div>
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete Pattern
          </Button>
        </div>
      </div>

      <PatternForm
        includeUsername
        initialValues={initialValues}
        onSubmit={updatePattern}
        successRedirectPath="/admin/patterns"
      />

      {isDeleteModalOpen && (
        <Modal
          headerText="Delete Pattern?"
          closeModal={() => setIsDeleteModalOpen(false)}
          closeDisabled={deletePatterns.isPending}
          firstButton={{
            label: 'Cancel',
            onClick: () => setIsDeleteModalOpen(false),
            disabled: deletePatterns.isPending,
          }}
          secondButton={{
            label: deletePatterns.isPending ? 'Deleting...' : 'Delete Pattern',
            onClick: confirmDelete,
            disabled: deletePatterns.isPending,
          }}
        >
          <p className="my-4">
            Are you sure you want to delete {patternDetails.pattern.name}?
          </p>

          {deletePatterns.isError && (
            <p role="alert" className="mb-4 text-rose-500">
              Unable to delete the pattern. Please try again.
            </p>
          )}
        </Modal>
      )}
    </div>
  )
}

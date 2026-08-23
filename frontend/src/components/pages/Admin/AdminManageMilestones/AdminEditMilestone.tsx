import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAdminDeleteMilestones } from '../../../../services/milestones/admin/useAdminDeleteMilestones'
import { useAdminGetAllMilestones } from '../../../../services/milestones/admin/useAdminGetAllMilestones'
import { useAdminUpdateMilestone } from '../../../../services/milestones/admin/useAdminUpdateMilestone'
import { useAdminGetAllProjects } from '../../../../services/projects/admin/useAdminGetAllProjects'
import { Button } from '../../../atoms/Button/Button'
import { Modal } from '../../../molecules/Modal/Modal'
import { AdminMilestoneForm } from './AdminMilestoneForm'

export const AdminEditMilestone = () => {
  const navigate = useNavigate()

  const { milestoneId: milestoneIdParam } = useParams()
  const milestoneId = Number(milestoneIdParam)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const {
    data: milestones,
    isPending: areMilestonesPending,
    isError: areMilestonesError,
  } = useAdminGetAllMilestones()
  const {
    data: projects,
    isPending: areProjectsPending,
    isError: areProjectsError,
  } = useAdminGetAllProjects()
  const milestoneDetails = milestones?.find(
    ({ milestone }) => milestone.milestoneId === milestoneId,
  )
  const { mutateAsync: updateMilestone } = useAdminUpdateMilestone(milestoneId)
  const deleteMilestones = useAdminDeleteMilestones()

  const confirmDelete = () => {
    deleteMilestones.mutate([milestoneId], {
      onSuccess: () => navigate('/admin/milestones'),
    })
  }

  if (areMilestonesPending || areProjectsPending) {
    return <p role="status">Loading milestone...</p>
  }

  if (areMilestonesError || areProjectsError) {
    return (
      <p role="alert" className="text-rose-600">
        Unable to load the milestone. Please try again.
      </p>
    )
  }

  if (!milestoneDetails || !projects) {
    return (
      <div className="flex flex-col gap-3">
        <p role="alert">Milestone not found.</p>
        <Link to="/admin/milestones">Return to Manage Milestones</Link>
      </div>
    )
  }

  const { milestone, projectName } = milestoneDetails

  return (
    <div className="flex w-full max-w-4xl flex-col gap-5 md:self-center">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <div>
          <h1>Edit Milestone</h1>
          <h4>Update a milestone in the Frog Log catalog.</h4>
        </div>
        <div>
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete Milestone
          </Button>
        </div>
      </div>

      <AdminMilestoneForm
        projects={projects}
        initialValues={{
          projectId: milestone.projectId,
          note: milestone.note,
          rowCount: milestone.rowCount,
          repeatCount: milestone.repeatCount,
        }}
        onSubmit={updateMilestone}
        successRedirectPath="/admin/milestones"
      />

      {isDeleteModalOpen && (
        <Modal
          headerText="Delete Milestone?"
          closeModal={() => setIsDeleteModalOpen(false)}
          closeDisabled={deleteMilestones.isPending}
          firstButton={{
            label: 'Cancel',
            onClick: () => setIsDeleteModalOpen(false),
            disabled: deleteMilestones.isPending,
          }}
          secondButton={{
            label: deleteMilestones.isPending
              ? 'Deleting...'
              : 'Delete Milestone',
            onClick: confirmDelete,
            disabled: deleteMilestones.isPending,
          }}
        >
          <p className="my-4">
            Are you sure you want to delete this milestone from {projectName}?
          </p>
          {deleteMilestones.isError && (
            <p role="alert" className="mb-4 text-rose-500">
              Unable to delete the milestone. Please try again.
            </p>
          )}
        </Modal>
      )}
    </div>
  )
}

import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAdminGetAllPatterns } from '../../../../services/patterns/admin/useAdminGetAllPatterns'
import { useAdminDeleteProjects } from '../../../../services/projects/admin/useAdminDeleteProjects'
import { useAdminGetAllProjects } from '../../../../services/projects/admin/useAdminGetAllProjects'
import { useAdminUpdateProject } from '../../../../services/projects/admin/useAdminUpdateProject'
import type { AddProjectRequest } from '../../../../services/projects/types/projectFormTypes'
import { Button } from '../../../atoms/Button/Button'
import { Modal } from '../../../molecules/Modal/Modal'
import { ProjectForm } from '../../Projects/ProjectForm'

export const AdminEditProject = () => {
  const navigate = useNavigate()

  const { projectId: projectIdParam } = useParams()
  const projectId = Number(projectIdParam)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const {
    data: projects,
    isPending: areProjectsPending,
    isError: areProjectsError,
  } = useAdminGetAllProjects()
  const {
    data: patterns,
    isPending: arePatternsPending,
    isError: arePatternsError,
  } = useAdminGetAllPatterns()

  const projectDetails = projects?.find(
    ({ project }) => project.projectId === projectId,
  )

  const { mutateAsync: updateProject } = useAdminUpdateProject(projectId)
  const deleteProjects = useAdminDeleteProjects()

  const confirmDelete = () => {
    deleteProjects.mutate([projectId], {
      onSuccess: () => navigate('/admin/projects'),
    })
  }

  if (areProjectsPending || arePatternsPending) {
    return <p role="status">Loading project...</p>
  }

  if (areProjectsError || arePatternsError) {
    return (
      <p role="alert" className="text-rose-600">
        Unable to load the project. Please try again.
      </p>
    )
  }

  if (!projectDetails || !patterns) {
    return (
      <div className="flex flex-col gap-3">
        <p role="alert">Project not found.</p>
        <Link to="/admin/projects">Return to Manage Projects</Link>
      </div>
    )
  }

  const { project, tags } = projectDetails
  const initialValues: AddProjectRequest = {
    username: project.username,
    patternId: project.patternId,
    name: project.name,
    status: project.status,
    isPublic: project.public,
    care: project.care ?? '',
    gauge: project.gauge ?? '',
    tags: tags.map((tag) => tag.name),
    dateStarted: project.dateStarted ?? '',
    dateFinished: project.dateFinished ?? '',
    dateNeededBy: project.dateNeededBy ?? '',
  }

  return (
    <div className="flex w-full max-w-4xl flex-col gap-5 md:self-center">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <div>
          <h1>Edit Project</h1>
          <h4>Update a project in the Frog Log catalog.</h4>
        </div>
        <div>
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete Project
          </Button>
        </div>
      </div>

      <ProjectForm
        includeUsername
        patterns={patterns}
        initialValues={initialValues}
        onSubmit={updateProject}
        successRedirectPath="/admin/projects"
      />

      {isDeleteModalOpen && (
        <Modal
          headerText="Delete Project?"
          closeModal={() => setIsDeleteModalOpen(false)}
          closeDisabled={deleteProjects.isPending}
          firstButton={{
            label: 'Cancel',
            onClick: () => setIsDeleteModalOpen(false),
            disabled: deleteProjects.isPending,
          }}
          secondButton={{
            label: deleteProjects.isPending ? 'Deleting...' : 'Delete Project',
            onClick: confirmDelete,
            disabled: deleteProjects.isPending,
          }}
        >
          <p className="my-4">
            Are you sure you want to delete {project.name}?
          </p>
          {deleteProjects.isError && (
            <p role="alert" className="mb-4 text-rose-500">
              Unable to delete the project. Please try again.
            </p>
          )}
        </Modal>
      )}
    </div>
  )
}

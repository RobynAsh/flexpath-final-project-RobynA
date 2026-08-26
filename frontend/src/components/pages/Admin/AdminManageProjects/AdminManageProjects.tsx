import { faAdd, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  type ProjectFilterField,
  type ProjectSortField,
  projectFilterFields,
  projectSortFields,
} from '../../../../hooks/useProjectsFilterSort'
import { useAdminDeleteProjects } from '../../../../services/projects/admin/useAdminDeleteProjects'
import { useAdminGetAllProjects } from '../../../../services/projects/admin/useAdminGetAllProjects'
import type { ProjectSummary } from '../../../../services/projects/types/projectTypes'
import { Button } from '../../../atoms/Button/Button'
import { DashBorder } from '../../../atoms/DashBorder/DashBorder'
import { FilterForm } from '../../../form/FilterForm/FilterForm'
import { SortForm, type SortDirection } from '../../../form/SortForm/SortForm'
import { Modal } from '../../../molecules/Modal/Modal'
import { ProjectCard } from '../../../molecules/ProjectCard/ProjectCard'

let filterTimeout: number

export const AdminManageProjects = () => {
  const [filterField, setFilterField] = useState<ProjectFilterField>('name')
  const [filterText, setFilterText] = useState('')
  const [debouncedFilterText, setDebouncedFilterText] = useState('')
  const [sortField, setSortField] = useState<ProjectSortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending')

  useEffect(() => {
    window.clearTimeout(filterTimeout)
    filterTimeout = window.setTimeout(
      () => setDebouncedFilterText(filterText),
      300,
    )

    return () => window.clearTimeout(filterTimeout)
  }, [filterText])

  const {
    data: projects,
    isPending,
    isError,
  } = useAdminGetAllProjects({
    filterField,
    filterText: debouncedFilterText,
    sortField,
    sortDirection,
  })
  const visibleProjects = projects ?? []
  const hasFilterText = filterText.trim().length > 0

  const [selectedProjects, setSelectedProjects] = useState<
    Map<number, ProjectSummary>
  >(new Map())

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deleteProjects = useAdminDeleteProjects()

  const setProjectSelected = (details: ProjectSummary, selected: boolean) => {
    setSelectedProjects((current) => {
      const updated = new Map(current)
      const projectId = details.project.projectId

      if (selected) updated.set(projectId, details)
      else updated.delete(projectId)

      return updated
    })
  }

  const confirmDelete = () => {
    deleteProjects.mutate([...selectedProjects.keys()], {
      onSuccess: () => {
        setSelectedProjects(new Map())
        setIsDeleteModalOpen(false)
      },
    })
  }

  return (
    <div className="flex w-full max-w-6xl flex-col gap-5 md:self-center">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <div>
          <h1>Manage Projects</h1>
          <h4>Add, Update or Delete Projects</h4>
        </div>
        <div className="flex grow flex-col justify-end gap-2 md:flex-row">
          {selectedProjects.size > 0 && (
            <div>
              <Button
                variant="tertiary"
                onClick={() => setSelectedProjects(new Map())}
              >
                <FontAwesomeIcon icon={faRotateLeft} />
                Reset
              </Button>
            </div>
          )}
          <div>
            <Button
              variant="secondary"
              disabled={selectedProjects.size === 0}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <FontAwesomeIcon icon={faTrash} />
              {selectedProjects.size === 0
                ? 'Delete Projects'
                : `Delete ${selectedProjects.size} Projects`}
            </Button>
          </div>
          <Link to="add">
            <Button variant="secondary">
              <FontAwesomeIcon icon={faAdd} />
              Add Project
            </Button>
          </Link>
        </div>
      </div>

      <FilterForm
        filterFields={projectFilterFields}
        filterField={filterField}
        filterText={filterText}
        onFilterFieldChange={(field) =>
          setFilterField(field as ProjectFilterField)
        }
        onFilterTextChange={setFilterText}
        placeholder="Enter text to filter projects"
      />

      <DashBorder>
        <span className="text-2xl font-bold">
          {visibleProjects.length === 1 ? 'Project' : 'Projects'}:{' '}
          {visibleProjects.length}
        </span>
      </DashBorder>

      {!isPending && !isError && visibleProjects.length > 0 && (
        <SortForm
          sortFields={projectSortFields}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortFieldChange={(field) => setSortField(field as ProjectSortField)}
          onSortDirectionChange={setSortDirection}
        />
      )}

      {isPending && <p role="status">Loading projects...</p>}
      {isError && (
        <p role="alert" className="text-rose-500">
          Unable to load projects. Please try again.
        </p>
      )}
      {!isPending && !isError && projects?.length === 0 && !hasFilterText && (
        <p>No projects have been added yet.</p>
      )}
      {!isPending &&
        !isError &&
        projects &&
        (projects.length > 0 || hasFilterText) &&
        visibleProjects.length === 0 && <p>No projects match your search.</p>}

      {!isPending && !isError && visibleProjects.length > 0 && (
        <div className="flex flex-col gap-4">
          {visibleProjects.map((details) => (
            <ProjectCard
              details={details}
              key={details.project.projectId}
              selected={selectedProjects.has(details.project.projectId)}
              onSelectedChange={(selected) =>
                setProjectSelected(details, selected)
              }
              editPath={`/admin/projects/edit/${details.project.projectId}`}
              showUsername
              linkTitle={false}
            />
          ))}
        </div>
      )}

      {isDeleteModalOpen && (
        <Modal
          headerText="Delete Projects?"
          closeModal={() => setIsDeleteModalOpen(false)}
          closeDisabled={deleteProjects.isPending}
          firstButton={{
            label: 'Cancel',
            onClick: () => setIsDeleteModalOpen(false),
            disabled: deleteProjects.isPending,
          }}
          secondButton={{
            label: deleteProjects.isPending ? 'Deleting...' : 'Delete Projects',
            onClick: confirmDelete,
            disabled: deleteProjects.isPending,
          }}
        >
          <p className="mt-2">
            Are you sure you want to delete the following projects?
          </p>
          <ul className="my-4 list-disc space-y-1 pl-6">
            {[...selectedProjects.values()].map(({ project }) => (
              <li key={project.projectId}>{project.name}</li>
            ))}
          </ul>
          {deleteProjects.isError && (
            <p role="alert" className="mb-4 text-rose-500">
              Unable to delete the selected projects. Please try again.
            </p>
          )}
        </Modal>
      )}
    </div>
  )
}

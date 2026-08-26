import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  type ProjectFilterField,
  type ProjectSortField,
  projectFilterFields,
  projectSortFields,
} from '../../../hooks/useProjectsFilterSort'
import { useGetProjects } from '../../../services/projects/useGetProjects'
import { Button } from '../../atoms/Button/Button'
import { DashBorder } from '../../atoms/DashBorder/DashBorder'
import { FilterForm } from '../../form/FilterForm/FilterForm'
import { SortForm, type SortDirection } from '../../form/SortForm/SortForm'
import { ProjectCard } from '../../molecules/ProjectCard/ProjectCard'

let filterTimeout: number

export const Projects = () => {
  const [filterField, setFilterField] = useState<ProjectFilterField>('name')
  const [filterText, setFilterText] = useState('')
  const [debouncedFilterText, setDebouncedFilterText] = useState('')
  const [sortField, setSortField] = useState<ProjectSortField>('updatedAt')
  const [sortDirection, setSortDirection] =
    useState<SortDirection>('descending')

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
  } = useGetProjects({
    includePublic: true,
    filterField,
    filterText: debouncedFilterText,
    sortField,
    sortDirection,
  })
  const visibleProjects = projects ?? []
  const hasFilterText = filterText.trim().length > 0

  return (
    <div className="flex w-full max-w-6xl flex-col gap-5 md:self-center">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <div>
          <h1>Projects</h1>
          <h4>Add, Update or Delete Projects</h4>
        </div>
        <Link to="/projects/add">
          <Button variant="secondary">
            <FontAwesomeIcon icon={faAdd} />
            Add Project
          </Button>
        </Link>
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
            <ProjectCard details={details} key={details.project.projectId} />
          ))}
        </div>
      )}
    </div>
  )
}

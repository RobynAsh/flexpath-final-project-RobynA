import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import type { Project } from '../../../services/projects/types/projectTypes'
import { Button } from '../../atoms/Button/Button'
import { Chip } from '../../atoms/Chip/Chip'

const displayValue = (value: string | null) => value || 'Not provided'

const formatDate = (value: string | null) =>
  value ? new Date(`${value}T00:00:00`).toLocaleDateString() : 'Not provided'

const formatDateTime = (value: string) => new Date(value).toLocaleString()

export const ProjectCard = ({ project }: { project: Project }) => (
  <article className="bg-surface shadow-card border-border overflow-hidden rounded-xl border">
    <div className="bg-honey-50 flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3>
          <Link
            className="text-olive-600 underline decoration-2 underline-offset-4 hover:text-olive-400"
            to={`/projects/${project.projectId}`}
          >
            {project.name}
          </Link>
        </h3>
        <div className="mt-1 flex flex-wrap gap-2">
          <Chip label={project.status} />
          <Chip label={project.public ? 'Public' : 'Private'} />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="text-sm sm:text-right">
          <p>
            <strong>Created:</strong> {formatDateTime(project.createdAt)}
          </p>
          <p>
            <strong>Updated:</strong> {formatDateTime(project.updatedAt)}
          </p>
        </div>
        <Link
          to={`/projects/${project.projectId}/update`}
          aria-label={`Edit ${project.name}`}
        >
          <Button variant="tertiary">
            <FontAwesomeIcon icon={faPen} />
            <span className="sr-only">Edit {project.name}</span>
          </Button>
        </Link>
      </div>
    </div>

    <div className="grid gap-5 p-4 md:grid-cols-2">
      <div className="space-y-2">
        <h5 className="text-olive-600">Project details</h5>
        <div className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1">
          <p className="font-bold">Gauge</p>
          <p>{displayValue(project.gauge)}</p>
          <p className="font-bold">Care</p>
          <p>{displayValue(project.care)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h5 className="text-olive-600">Schedule</h5>
        <div className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1">
          <p className="font-bold">Started</p>
          <p>{formatDate(project.dateStarted)}</p>
          <p className="font-bold">Finished</p>
          <p>{formatDate(project.dateFinished)}</p>
          <p className="font-bold">Needed by</p>
          <p>{formatDate(project.dateNeededBy)}</p>
        </div>
      </div>
    </div>
  </article>
)

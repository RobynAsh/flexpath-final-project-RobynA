import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { useProfile } from '../../../providers/ProfileContext'
import type { ProjectSummary } from '../../../services/projects/types/projectTypes'
import { Button } from '../../atoms/Button/Button'
import { Chip } from '../../atoms/Chip/Chip'
import { Checkbox } from '../../form/Checkbox/Checkbox'

const displayValue = (value: string | null) => value || 'Not provided'

const formatDate = (value: string | null) =>
  value ? new Date(`${value}T00:00:00`).toLocaleDateString() : 'Not provided'

const formatDateTime = (value: string) => new Date(value).toLocaleString()

export const ProjectCard = ({
  details,
  selected = false,
  onSelectedChange,
  editPath,
  showUsername = true,
  linkTitle = true,
}: {
  details: ProjectSummary
  selected?: boolean
  onSelectedChange?: (_selected: boolean) => void
  editPath?: string
  showUsername?: boolean
  linkTitle?: boolean
}) => {
  const { project, tags } = details
  const { profile } = useProfile()
  const isOwner = profile?.username === project.username

  return (
    <article className="bg-surface shadow-card border-border overflow-hidden rounded-xl border">
      <div className="bg-honey-50 flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {onSelectedChange && (
            <Checkbox
              id={`select-project-${project.projectId}`}
              checked={selected}
              onChange={(event) => onSelectedChange(event.target.checked)}
            />
          )}
          <div>
            <h3>
              {linkTitle ? (
                <Link
                  className="text-olive-600 underline decoration-2 underline-offset-4 hover:text-olive-400"
                  to={`/projects/${project.projectId}`}
                >
                  {project.name}
                </Link>
              ) : (
                project.name
              )}
            </h3>
            {showUsername && (
              <p className="text-muted">Owned by {project.username}</p>
            )}
            <div className="mt-1 flex flex-wrap gap-2">
              <Chip label={project.status} />
              <Chip label={project.public ? 'Public' : 'Private'} />
            </div>
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
          {(editPath || isOwner) && (
            <Link
              to={editPath ?? `/projects/${project.projectId}/update`}
              aria-label={`Edit ${project.name}`}
            >
              <Button variant="tertiary">
                <FontAwesomeIcon icon={faPen} />
                <span className="sr-only">Edit {project.name}</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-5 p-4 md:grid-cols-2">
        <div className="space-y-2">
          <h5 className="text-olive-600">Project details</h5>
          <div className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1">
            <p className="font-bold">Tags</p>
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
}

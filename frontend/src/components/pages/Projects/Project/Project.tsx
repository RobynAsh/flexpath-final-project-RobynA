import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useParams } from 'react-router-dom'
import { useGetProject } from '../../../../services/projects/useGetProject'
import { Button } from '../../../atoms/Button/Button'
import { Chip } from '../../../atoms/Chip/Chip'

const displayValue = (value: string | null) => value || 'Not provided'

const formatDate = (value: string | null) =>
  value ? new Date(`${value}T00:00:00`).toLocaleDateString() : 'Not provided'

const formatDateTime = (value: string) => new Date(value).toLocaleString()

export const Project = () => {
  const { projectId: projectIdParam } = useParams()
  const projectId = Number(projectIdParam)
  const { data: details, isPending, isError } = useGetProject(projectId)

  if (isPending) {
    return <p role="status">Loading project...</p>
  }

  if (!Number.isInteger(projectId) || projectId <= 0 || isError || !details) {
    return (
      <div className="flex flex-col gap-3">
        <p role="alert">Unable to load the project. It may not exist.</p>
        <Link className="text-olive-600 underline" to="/projects">
          Return to Projects
        </Link>
      </div>
    )
  }

  const { project, tags, pattern, yarn, tools, materials } = details

  return (
    <div className="flex w-full max-w-5xl flex-col gap-6 md:self-center">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1>{project.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip label={project.status} />
            <Chip label={project.public ? 'Public' : 'Private'} />
          </div>
        </div>

        <Link to={`/projects/${project.projectId}/update`}>
          <Button variant="tertiary">
            <FontAwesomeIcon icon={faPen} />
            Edit Project
          </Button>
        </Link>
      </div>

      <div className="bg-surface border-border shadow-card grid gap-5 rounded-xl border p-5 md:grid-cols-2">
        <div className="space-y-3">
          <h2>Project Information</h2>
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
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2">
            <p className="font-bold">Gauge</p>
            <p>{displayValue(project.gauge)}</p>
            <p className="font-bold">Care</p>
            <p className="whitespace-pre-wrap">{displayValue(project.care)}</p>
          </div>
        </div>

        <div className="grid grid-cols-[max-content_1fr] content-start gap-x-4 gap-y-2 rounded-lg bg-olive-50 p-4">
          <p className="font-bold">Started</p>
          <p>{formatDate(project.dateStarted)}</p>
          <p className="font-bold">Finished</p>
          <p>{formatDate(project.dateFinished)}</p>
          <p className="font-bold">Needed by</p>
          <p>{formatDate(project.dateNeededBy)}</p>
          <p className="font-bold">Created</p>
          <p>{formatDateTime(project.createdAt)}</p>
          <p className="font-bold">Updated</p>
          <p>{formatDateTime(project.updatedAt)}</p>
        </div>
      </div>

      <div className="bg-surface border-border shadow-card grid gap-5 rounded-xl border p-5 md:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
        <div className="space-y-3">
          <div>
            <h2>Pattern Information</h2>
            <p className="text-muted text-lg">
              {pattern.name} by {pattern.designer}
            </p>
          </div>
          <p className="whitespace-pre-wrap">
            {displayValue(pattern.description)}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              className="text-olive-600 underline hover:text-olive-400"
              to={`/patterns/${pattern.patternId}`}
            >
              View pattern details
            </Link>
            {pattern.link && (
              <a
                className="text-olive-600 underline hover:text-olive-400"
                href={pattern.link}
                target="_blank"
                rel="noreferrer"
              >
                View pattern instructions
              </a>
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

        <div className="bg-honey-50 grid grid-cols-[max-content_1fr] content-start gap-x-4 gap-y-2 rounded-lg p-4">
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
    </div>
  )
}

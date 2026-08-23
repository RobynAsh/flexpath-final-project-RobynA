import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import type { AdminMilestoneDetails } from '../../../services/milestones/types/milestoneTypes'
import { Button } from '../../atoms/Button/Button'
import { Checkbox } from '../../form/Checkbox/Checkbox'

const formatDateTime = (value: string) => new Date(value).toLocaleString()

export const MilestoneCard = ({
  details,
  selected = false,
  onSelectedChange,
  editPath,
}: {
  details: AdminMilestoneDetails
  selected?: boolean
  onSelectedChange?: (_selected: boolean) => void
  editPath: string
}) => {
  const { milestone, projectName, username } = details

  return (
    <article className="bg-surface shadow-card border-border overflow-hidden rounded-xl border">
      <div className="flex flex-col gap-2 bg-olive-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {onSelectedChange && (
            <Checkbox
              id={`select-milestone-${milestone.milestoneId}`}
              ariaLabel={`Select milestone ${milestone.milestoneId}`}
              checked={selected}
              onChange={(event) => onSelectedChange(event.target.checked)}
            />
          )}
          <div>
            <h3>{projectName}</h3>
            <p className="text-muted">Owned by {username}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="text-sm sm:text-right">
            <p>
              <strong>Created:</strong> {formatDateTime(milestone.createdAt)}
            </p>
            <p>
              <strong>Updated:</strong> {formatDateTime(milestone.updatedAt)}
            </p>
          </div>
          <Link
            to={editPath}
            aria-label={`Edit milestone ${milestone.milestoneId}`}
          >
            <Button variant="tertiary">
              <FontAwesomeIcon icon={faPen} />
              <span className="sr-only">
                Edit milestone {milestone.milestoneId}
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-[1fr_auto]">
        <div>
          <h5 className="text-olive-600">Note</h5>
          <p className="whitespace-pre-wrap">{milestone.note}</p>
        </div>
        <div className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1">
          <p className="font-bold">Rows</p>
          <p>{milestone.rowCount}</p>
          <p className="font-bold">Repeats</p>
          <p>{milestone.repeatCount}</p>
        </div>
      </div>
    </article>
  )
}

import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { useGetAllPatterns } from '../../../../services/useGetAllPatterns'
import { Button } from '../../../atoms/Button/Button'
import { PatternCard } from '../../../molecules/PatternCard/PatternCard'

export const AdminManagePatterns = () => {
  const { data: patterns, isPending, isError } = useGetAllPatterns()

  return (
    <div className="flex w-full max-w-6xl flex-col gap-5 md:self-center">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div>
          <h1>Manage Patterns</h1>
          <h4>Add, Update or Delete Patterns</h4>
        </div>
        <Link to="add">
          <Button variant="secondary">
            <FontAwesomeIcon icon={faAdd} />
            Add Pattern
          </Button>
        </Link>
      </div>

      {isPending && <p role="status">Loading patterns...</p>}

      {isError && (
        <p role="alert" className="text-rose-500">
          Unable to load patterns. Please try again.
        </p>
      )}

      {!isPending && !isError && patterns?.length === 0 && (
        <p>No patterns have been added yet.</p>

      {!isPending && !isError && patterns && patterns.length > 0 && (
        <div className="flex flex-col gap-4">
          {patterns.map((details) => (
            <PatternCard details={details} key={details.pattern.patternId} />
          ))}
        </div>
      )}
    </div>
  )
}

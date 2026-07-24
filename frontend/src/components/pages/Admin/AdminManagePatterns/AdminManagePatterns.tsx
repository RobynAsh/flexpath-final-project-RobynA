import { Link } from 'react-router-dom'
import { Button } from '../../../atoms/Button/Button'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const AdminManagePatterns = () => {
  return (
    <div className="flex w-full max-w-4xl md:self-center">
      <div className="flex flex-col gap-3 sm:grow sm:flex-row sm:items-center sm:justify-between sm:gap-0">
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
    </div>
  )
}

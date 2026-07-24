import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '../../atoms/Button/Button'
import { faCompassDrafting } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

export const Admin = () => {
  return (
    <>
      <h1>Admin Portal</h1>
      <div className="flex gap-3">
        <Link to="/admin/patterns">
          <Button variant="primary">
            <FontAwesomeIcon icon={faCompassDrafting} />
            <span>Manage Patterns</span>
          </Button>
        </Link>
      </div>
    </>
  )
}

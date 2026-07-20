import { Navigate, Outlet } from 'react-router-dom'
import { useProfile } from '../../../providers/ProfileContext'

export const UnauthenticatedRoute = () => {
  const { profileStatus } = useProfile()

  if (profileStatus === 'checking') {
    return <p>Checking your session...</p>
  }

  if (profileStatus === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

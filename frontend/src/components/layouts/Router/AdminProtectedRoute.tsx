import { Navigate, Outlet } from 'react-router-dom'
import { useProfile } from '../../../providers/ProfileContext'

export const AdminProtectedRoute = () => {
  const { profile, profileStatus } = useProfile()

  if (profileStatus === 'checking') {
    return <p>Checking your permissions...</p>
  }

  if (profileStatus === 'unauthenticated' || profile?.isAdmin !== true) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

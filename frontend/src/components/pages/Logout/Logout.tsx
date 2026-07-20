import { useEffect, useState } from 'react'
import { clearStoredJWTToken } from '../../../helpers/loginHelpers'
import { Navigate } from 'react-router-dom'

export const Logout = () => {
  const [isLoggedOut, setIsLoggedOut] = useState(false)

  useEffect(() => {
    clearStoredJWTToken()
    setIsLoggedOut(true)
  }, [])

  if (isLoggedOut) {
    return <Navigate to="/login" replace />
  }

  return <p>Logging out...</p>
}

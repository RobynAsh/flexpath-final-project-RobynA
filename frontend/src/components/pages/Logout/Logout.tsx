import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { clearStoredJWTToken } from '../../../helpers/loginHelpers'
import { Navigate } from 'react-router-dom'

export const Logout = ({
  setIsAuthenticated,
}: {
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
}) => {
  const [isLoggedOut, setIsLoggedOut] = useState(false)

  useEffect(() => {
    clearStoredJWTToken()
    setIsAuthenticated(false)
    setIsLoggedOut(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoggedOut) {
    return <Navigate to="/login" replace />
  }

  return <p>Logging out...</p>
}

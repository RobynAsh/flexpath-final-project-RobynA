import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import {
  clearStoredJWTToken,
  getStoredJWTToken,
} from '../../../helpers/loginHelpers'

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

export const ProtectedRoute = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('checking')

  useEffect(() => {
    const validateToken = async () => {
      const token = getStoredJWTToken()

      if (!token) {
        setAuthStatus('unauthenticated')
        return
      }

      try {
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          setAuthStatus('unauthenticated')
          return
        }

        setAuthStatus('authenticated')
      } catch (error) {
        console.error('Error while fetching profile:', error)

        clearStoredJWTToken()
        setAuthStatus('unauthenticated')
      }
    }

    validateToken()
  }, [])

  if (authStatus === 'checking') {
    return <p>Checking your session...</p>
  }

  if (authStatus === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

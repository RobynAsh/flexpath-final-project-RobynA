import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { clearStoredJWTToken, getStoredJWTToken } from '../helpers/loginHelpers'
import { useGetProfile } from '../services/useGetProfile'
import { ProfileContext, ProfileStatus } from './ProfileContext'

type ProfileProviderProps = {
  children: ReactNode
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const [jwtToken, setJwtTokenState] = useState(getStoredJWTToken())
  const { data: profile, error, isError, isPending } = useGetProfile(jwtToken)

  const setJwtToken = useCallback((token: string, rememberMe = false) => {
    clearStoredJWTToken()

    if (token) {
      const tokenStorage = rememberMe ? localStorage : sessionStorage
      tokenStorage.setItem('token', token)
    }

    setJwtTokenState(token || '')
  }, [])

  useEffect(() => {
    if (isError) {
      console.error('Error while fetching profile:', error)
      setJwtToken('')
    }
  }, [error, isError, setJwtToken])

  const profileStatus: ProfileStatus = useMemo(() => {
    if (!jwtToken || isError) {
      return 'unauthenticated'
    }

    if (isPending) {
      return 'checking'
    }

    // User has a JWT and both isError && isPending are false, user is authenticated.
    return 'authenticated'
  }, [isPending, jwtToken, isError])

  return (
    <ProfileContext.Provider
      value={{ profile, profileStatus, jwtToken, setJwtToken }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

import { useEffect, useState, type ReactNode } from 'react'
import { clearStoredJWTToken, getStoredJWTToken } from '../helpers/loginHelpers'
import {
  ProfileContext,
  type Profile,
  type ProfileStatus,
} from './ProfileContext'

type ProfileProviderProps = {
  children: ReactNode
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>('checking')

  useEffect(() => {
    const getProfile = async () => {
      const token = getStoredJWTToken()

      if (!token) {
        setProfileStatus('unauthenticated')
        return
      }

      try {
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          setProfileStatus('unauthenticated')
          return
        }

        const profileData: Profile = await response.json()
        setProfile(profileData)
        setProfileStatus('authenticated')
      } catch (error) {
        console.error('Error while fetching profile:', error)

        clearStoredJWTToken()
        setProfileStatus('unauthenticated')
      }
    }

    setProfileStatus('checking')
    getProfile()
  }, [])

  return (
    <ProfileContext.Provider value={{ profile, profileStatus }}>
      {children}
    </ProfileContext.Provider>
  )
}

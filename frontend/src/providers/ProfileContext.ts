import { createContext, useContext } from 'react'

export type ProfileStatus = 'checking' | 'authenticated' | 'unauthenticated'

export type Profile = {
  username: string
  isAdmin: boolean
}

export type ProfileContextValue = {
  profile: Profile | null
  profileStatus: ProfileStatus
}

export const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined,
)

export const useProfile = () => {
  const context = useContext(ProfileContext)

  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }

  return context
}

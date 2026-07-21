import { createContext, useContext } from 'react'

export type ProfileStatus = 'checking' | 'authenticated' | 'unauthenticated'

export type Profile = {
  username: string
  isAdmin: boolean
}

export type ProfileContextValue = {
<<<<<<< HEAD
  profile?: Profile
  profileStatus: ProfileStatus
  jwtToken: string
  setJwtToken: (_token: string, _rememberMe?: boolean) => void
=======
  profile: Profile | null
  profileStatus: ProfileStatus
>>>>>>> origin/main
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

import { useQuery } from '@tanstack/react-query'
import type { Profile } from '../providers/ProfileContext'

const getProfile = async (token: string): Promise<Profile> => {
  const response = await fetch('/api/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Unable to get profile.')
  }

  return response.json() as Promise<Profile>
}

export const useGetProfile = (token: string) => {
  return useQuery({
    queryKey: ['profile', token],
    queryFn: () => getProfile(token),
    enabled: Boolean(token),
    retry: false,
  })
}

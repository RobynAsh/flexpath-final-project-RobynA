import { useQuery } from '@tanstack/react-query'
import { useProfile } from '../../providers/ProfileContext'
import type { RecentMilestone } from './types/milestoneTypes'

export const recentMilestonesQueryKey = ['milestones', 'recent'] as const

const getRecentMilestones = async (
  token: string,
): Promise<RecentMilestone[]> => {
  const response = await fetch('/api/milestones/recent', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Unable to get recent milestones.')
  }

  return response.json() as Promise<RecentMilestone[]>
}

export const useGetRecentMilestones = () => {
  const { jwtToken } = useProfile()

  return useQuery({
    queryKey: [...recentMilestonesQueryKey, jwtToken],
    queryFn: () => getRecentMilestones(jwtToken),
    enabled: Boolean(jwtToken),
    retry: false,
  })
}

import { useQuery } from '@tanstack/react-query'
import { useProfile } from '../../../providers/ProfileContext'
import type { AdminMilestoneDetails } from '../types/milestoneTypes'

export const adminMilestonesQueryKey = ['admin', 'milestones', 'all'] as const

const getAllAdminMilestones = async (
  token: string,
): Promise<AdminMilestoneDetails[]> => {
  const response = await fetch('/api/admin/milestones/all', {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error('Unable to get milestones.')
  }

  return response.json() as Promise<AdminMilestoneDetails[]>
}

export const useAdminGetAllMilestones = () => {
  const { jwtToken } = useProfile()

  return useQuery({
    queryKey: [...adminMilestonesQueryKey, jwtToken],
    queryFn: () => getAllAdminMilestones(jwtToken),
    enabled: Boolean(jwtToken),
    retry: false,
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../../providers/ProfileContext'
import type { AdminMilestoneRequest } from '../types/milestoneTypes'
import { adminMilestonesQueryKey } from './useAdminGetAllMilestones'

const addAdminMilestone = async (
  milestone: AdminMilestoneRequest,
  token: string,
): Promise<void> => {
  const response = await fetch('/api/admin/milestones', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(milestone),
  })

  if (!response.ok) {
    throw new Error('There was an error adding the milestone.')
  }
}

export const useAdminAddMilestone = () => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (milestone: AdminMilestoneRequest) =>
      addAdminMilestone(milestone, jwtToken),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminMilestonesQueryKey }),
  })
}

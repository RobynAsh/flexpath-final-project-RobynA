import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../../providers/ProfileContext'
import type { AdminMilestoneRequest } from '../types/milestoneTypes'
import { adminMilestonesQueryKey } from './useAdminGetAllMilestones'

const updateAdminMilestone = async (
  milestoneId: number,
  milestone: AdminMilestoneRequest,
  token: string,
): Promise<void> => {
  const response = await fetch(`/api/admin/milestones/${milestoneId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(milestone),
  })

  if (!response.ok) {
    throw new Error('There was an error updating the milestone.')
  }
}

export const useAdminUpdateMilestone = (milestoneId: number) => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (milestone: AdminMilestoneRequest) =>
      updateAdminMilestone(milestoneId, milestone, jwtToken),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminMilestonesQueryKey }),
  })
}

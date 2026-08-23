import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../../providers/ProfileContext'
import { adminMilestonesQueryKey } from './useAdminGetAllMilestones'

const deleteAdminMilestone = async (milestoneId: number, token: string) => {
  const response = await fetch(`/api/admin/milestones/${milestoneId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error('There was an error deleting the selected milestones.')
  }
}

export const useAdminDeleteMilestones = () => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (milestoneIds: number[]) =>
      Promise.all(
        milestoneIds.map((milestoneId) =>
          deleteAdminMilestone(milestoneId, jwtToken),
        ),
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminMilestonesQueryKey }),
  })
}

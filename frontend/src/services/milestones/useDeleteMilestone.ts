import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../providers/ProfileContext'
import { projectQueryKey } from '../projects/useGetProject'
import { recentMilestonesQueryKey } from './useGetRecentMilestones'

const deleteMilestone = async (milestoneId: number, token: string) => {
  const response = await fetch(`/api/milestones/${milestoneId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('There was an error deleting the milestone.')
  }
}

export const useDeleteMilestone = (projectId: number) => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (milestoneId: number) => deleteMilestone(milestoneId, jwtToken),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...projectQueryKey, projectId],
      })
      queryClient.invalidateQueries({ queryKey: recentMilestonesQueryKey })
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../providers/ProfileContext'
import { projectQueryKey } from '../projects/useGetProject'
import type { AddMilestoneRequest, Milestone } from './types/milestoneTypes'

const addMilestone = async (
  projectId: number,
  milestone: AddMilestoneRequest,
  token: string,
): Promise<Milestone> => {
  const response = await fetch('/api/milestones', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectId, ...milestone }),
  })

  if (!response.ok) {
    throw new Error('There was an error adding the milestone.')
  }

  return response.json() as Promise<Milestone>
}

export const useAddMilestone = (projectId: number) => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (milestone: AddMilestoneRequest) =>
      addMilestone(projectId, milestone, jwtToken),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [...projectQueryKey, projectId],
      }),
  })
}

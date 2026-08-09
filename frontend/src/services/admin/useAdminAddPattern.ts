import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../providers/ProfileContext'
import { adminPatternsQueryKey } from './useAdminGetAllPatterns'

export type PatternYarn = {
  weight: number
  yardage: number
  grams: number
  description: string
}

export type PatternTool = {
  toolType: string
  sizeMm: number
}

export type PatternMaterial = {
  name: string
  description: string
  quantity: number
}

export type AddPatternRequest = {
  username: string
  name: string
  designer: string
  category: string
  technique: string
  difficulty: string
  description: string
  link: string
  imageUrl: string
  tags: string[]
  yarn: PatternYarn[]
  tools: PatternTool[]
  materials: PatternMaterial[]
}

const addAdminPattern = async (
  pattern: AddPatternRequest,
  token: string,
): Promise<void> => {
  const response = await fetch('/api/admin/patterns', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pattern),
  })

  if (!response.ok) {
    throw new Error('There was an error adding the pattern.')
  }
}

export const useAdminAddPattern = () => {
  const { jwtToken } = useProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pattern: AddPatternRequest) =>
      addAdminPattern(pattern, jwtToken),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminPatternsQueryKey }),
  })
}

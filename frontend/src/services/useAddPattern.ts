import { useMutation } from '@tanstack/react-query'
import { useProfile } from '../providers/ProfileContext'

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
}

const addPattern = async (
  pattern: AddPatternRequest,
  token: string,
): Promise<void> => {
  const response = await fetch('/api/patterns', {
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

export const useAddPattern = () => {
  const { jwtToken } = useProfile()

  return useMutation({
    mutationFn: (pattern: AddPatternRequest) => addPattern(pattern, jwtToken),
  })
}

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../../providers/ProfileContext'

export const Logout = () => {
  const queryClient = useQueryClient()
  const { jwtToken, setJwtToken } = useProfile()

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['profile', jwtToken],
      refetchType: 'none',
    })
    setJwtToken('')
  }, [queryClient, jwtToken, setJwtToken])

  return <p>Logging out...</p>
}

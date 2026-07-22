import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProfileContext } from '../../../providers/ProfileContext'
import { Logout } from './Logout'

describe('Logout', () => {
  test('invalidates the current profile query and clears the token', async () => {
    const queryClient = new QueryClient()
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries')
    const setJwtToken = jest.fn()

    render(
      <QueryClientProvider client={queryClient}>
        <ProfileContext.Provider
          value={{
            profileStatus: 'authenticated',
            jwtToken: 'old-token',
            setJwtToken,
          }}
        >
          <Logout />
        </ProfileContext.Provider>
      </QueryClientProvider>,
    )

    expect(screen.getByText('Logging out...')).toBeInTheDocument()
    await waitFor(() =>
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['profile', 'old-token'],
        refetchType: 'none',
      }),
    )
    expect(setJwtToken).toHaveBeenCalledWith('')
  })
})

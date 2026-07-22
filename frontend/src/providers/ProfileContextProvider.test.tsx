import { fireEvent, render, screen } from '@testing-library/react'
import { useProfile } from './ProfileContext'
import { ProfileProvider } from './ProfileContextProvider'

type MockProfileQuery = {
  data?: { username: string; isAdmin: boolean }
  error: Error | null
  isError: boolean
  isPending: boolean
}

const mockUseGetProfile = jest.fn((_token: string): MockProfileQuery => ({
  data: undefined,
  error: null,
  isError: false,
  isPending: false,
}))

jest.mock('../services/useGetProfile', () => ({
  useGetProfile: (token: string) => mockUseGetProfile(token),
}))

const Consumer = () => {
  const { jwtToken, profile, profileStatus, setJwtToken } = useProfile()

  return (
    <>
      <p>Token: {jwtToken || 'none'}</p>
      <p>Status: {profileStatus}</p>
      <p>Username: {profile?.username || 'none'}</p>
      <button onClick={() => setJwtToken('session-token')}>Use session</button>
      <button onClick={() => setJwtToken('local-token', true)}>
        Remember token
      </button>
      <button onClick={() => setJwtToken('')}>Clear token</button>
    </>
  )
}

const renderProvider = () =>
  render(
    <ProfileProvider>
      <Consumer />
    </ProfileProvider>,
  )

describe('ProfileProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    mockUseGetProfile.mockReset()
    mockUseGetProfile.mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isPending: false,
    })
  })

  test('is unauthenticated when no stored token exists', () => {
    renderProvider()

    expect(screen.getByText('Token: none')).toBeInTheDocument()
    expect(screen.getByText('Status: unauthenticated')).toBeInTheDocument()
    expect(mockUseGetProfile).toHaveBeenCalledWith('')
  })

  test('checks the profile while a stored token request is pending', () => {
    sessionStorage.setItem('token', 'stored-token')
    mockUseGetProfile.mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isPending: true,
    })

    renderProvider()

    expect(screen.getByText('Token: stored-token')).toBeInTheDocument()
    expect(screen.getByText('Status: checking')).toBeInTheDocument()
  })

  test('exposes an authenticated profile after it loads', () => {
    localStorage.setItem('token', 'stored-token')
    mockUseGetProfile.mockReturnValue({
      data: { username: 'froggy', isAdmin: false },
      error: null,
      isError: false,
      isPending: false,
    })

    renderProvider()

    expect(screen.getByText('Status: authenticated')).toBeInTheDocument()
    expect(screen.getByText('Username: froggy')).toBeInTheDocument()
  })

  test('stores tokens according to the remember-me preference and clears them', () => {
    renderProvider()

    fireEvent.click(screen.getByRole('button', { name: 'Use session' }))
    expect(sessionStorage.getItem('token')).toBe('session-token')
    expect(localStorage.getItem('token')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Remember token' }))
    expect(sessionStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('token')).toBe('local-token')

    fireEvent.click(screen.getByRole('button', { name: 'Clear token' }))
    expect(sessionStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
    expect(screen.getByText('Token: none')).toBeInTheDocument()
  })
})

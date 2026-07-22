import { renderHook } from '@testing-library/react'
import { ProfileContext, useProfile } from './ProfileContext'

describe('useProfile', () => {
  test('returns the current profile context', () => {
    const value = {
      profileStatus: 'authenticated' as const,
      profile: { username: 'froggy', isAdmin: false },
      jwtToken: 'token',
      setJwtToken: jest.fn(),
    }

    const { result } = renderHook(() => useProfile(), {
      wrapper: ({ children }) => (
        <ProfileContext.Provider value={value}>
          {children}
        </ProfileContext.Provider>
      ),
    })

    expect(result.current).toBe(value)
  })

  test('throws when used outside a ProfileProvider', () => {
    expect(() => renderHook(() => useProfile())).toThrow(
      'useProfile must be used within a ProfileProvider',
    )
  })
})

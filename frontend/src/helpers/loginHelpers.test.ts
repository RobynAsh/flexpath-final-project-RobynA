import { clearStoredJWTToken, getStoredJWTToken } from './loginHelpers'

describe('loginHelpers', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  test('prefers the session token over the local token', () => {
    sessionStorage.setItem('token', 'session-token')
    localStorage.setItem('token', 'local-token')

    expect(getStoredJWTToken()).toBe('session-token')
  })

  test('falls back to the local token and then an empty string', () => {
    localStorage.setItem('token', 'local-token')
    expect(getStoredJWTToken()).toBe('local-token')

    localStorage.clear()
    expect(getStoredJWTToken()).toBe('')
  })

  test('clears tokens from both storage locations', () => {
    sessionStorage.setItem('token', 'session-token')
    localStorage.setItem('token', 'local-token')

    clearStoredJWTToken()

    expect(sessionStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })
})

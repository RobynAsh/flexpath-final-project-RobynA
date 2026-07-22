import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  ProfileContext,
  type ProfileContextValue,
} from '../../../providers/ProfileContext'
import { Login } from './Login'

const mockLogin = jest.fn(
  async (_credentials: { username: string; password: string }) => ({
    accessToken: { token: 'new-token' },
  }),
)

jest.mock('../../../services/useLogin', () => ({
  useLogin: () => ({ mutateAsync: mockLogin }),
}))

const setJwtToken = jest.fn()
const profileValue: ProfileContextValue = {
  profileStatus: 'unauthenticated',
  jwtToken: '',
  setJwtToken,
}

const renderLogin = (
  initialEntry: string | Record<string, unknown> = '/login-form',
) =>
  render(
    <ProfileContext.Provider value={profileValue}>
      <MemoryRouter
        initialEntries={[initialEntry as string]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="*" element={<Login />} />
          <Route path="/" element={<p>Home destination</p>} />
          <Route
            path="/create-account"
            element={<p>Create account destination</p>}
          />
        </Routes>
      </MemoryRouter>
    </ProfileContext.Provider>,
  )

beforeEach(() => {
  mockLogin.mockClear()
  mockLogin.mockResolvedValue({ accessToken: { token: 'new-token' } })
  setJwtToken.mockClear()
})

describe('Login', () => {
  test('validates required credentials before submitting', async () => {
    renderLogin()

    fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

    expect(await screen.findByText('Username is required.')).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()
    expect(mockLogin).not.toHaveBeenCalled()
  })

  test('submits credentials, persists the token preference, and navigates home', async () => {
    renderLogin()

    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'froggy' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'secret' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: 'Remember Me' }))
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'froggy',
        password: 'secret',
      }),
    )
    expect(setJwtToken).toHaveBeenCalledWith('new-token', true)
    expect(screen.getByText('Home destination')).toBeInTheDocument()
  })

  test('shows authentication failures', async () => {
    mockLogin.mockRejectedValueOnce(
      new Error('Incorrect username or password.'),
    )
    renderLogin()

    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'froggy' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Incorrect username or password.',
    )
  })

  test('shows the account-created confirmation from location state', () => {
    renderLogin({
      pathname: '/login-form',
      state: { createdAccount: true },
    })

    expect(screen.getByText(/Account created successfully/)).toBeInTheDocument()
  })

  test('navigates to account creation', () => {
    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: 'Create an Account' }))
    expect(screen.getByText('Create account destination')).toBeInTheDocument()
  })
})

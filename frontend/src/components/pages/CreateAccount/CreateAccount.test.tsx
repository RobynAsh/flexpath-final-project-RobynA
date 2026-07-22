import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { CreateAccount } from './CreateAccount'

const mockCreateAccount = jest.fn(
  async (_credentials: { username: string; password: string }) => undefined,
)

jest.mock('../../../services/useCreateAccount', () => ({
  useCreateAccount: () => ({ mutateAsync: mockCreateAccount }),
}))

const renderCreateAccount = () =>
  render(
    <MemoryRouter
      initialEntries={['/signup-form']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="*" element={<CreateAccount />} />
        <Route path="/login" element={<p>Login destination</p>} />
      </Routes>
    </MemoryRouter>,
  )

const completeForm = (confirmPassword = 'secret') => {
  fireEvent.change(screen.getByLabelText('Username'), {
    target: { value: 'froggy' },
  })
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'secret' },
  })
  fireEvent.change(screen.getByLabelText('Confirm Password'), {
    target: { value: confirmPassword },
  })
}

beforeEach(() => {
  mockCreateAccount.mockClear()
  mockCreateAccount.mockResolvedValue(undefined)
})

describe('CreateAccount', () => {
  test('validates required fields and matching passwords', async () => {
    renderCreateAccount()
    completeForm('different')

    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(await screen.findAllByText('Passwords do not match.')).toHaveLength(
      2,
    )
    expect(mockCreateAccount).not.toHaveBeenCalled()
  })

  test('creates an account and navigates to login', async () => {
    renderCreateAccount()
    completeForm()

    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    await waitFor(() =>
      expect(mockCreateAccount).toHaveBeenCalledWith({
        username: 'froggy',
        password: 'secret',
      }),
    )
    expect(screen.getByText('Login destination')).toBeInTheDocument()
  })

  test('places a duplicate-username error on the username field', async () => {
    mockCreateAccount.mockRejectedValueOnce(
      new Error('Username is already taken.'),
    )
    renderCreateAccount()
    completeForm()

    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(
      await screen.findByText('Username is already taken.'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Username')).toHaveFocus()
  })

  test('navigates back to login', () => {
    renderCreateAccount()
    fireEvent.click(screen.getByRole('button', { name: 'Log-in' }))
    expect(screen.getByText('Login destination')).toBeInTheDocument()
  })
})

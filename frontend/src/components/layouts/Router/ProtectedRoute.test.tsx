import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  ProfileContext,
  type ProfileStatus,
} from '../../../providers/ProfileContext'
import { ProtectedRoute } from './ProtectedRoute'

const renderRoute = (profileStatus: ProfileStatus) =>
  render(
    <ProfileContext.Provider
      value={{ profileStatus, jwtToken: '', setJwtToken: jest.fn() }}
    >
      <MemoryRouter
        initialEntries={['/private']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/private" element={<p>Private content</p>} />
          </Route>
          <Route path="/login" element={<p>Login destination</p>} />
        </Routes>
      </MemoryRouter>
    </ProfileContext.Provider>,
  )

describe('ProtectedRoute', () => {
  test('shows session progress while checking', () => {
    renderRoute('checking')
    expect(screen.getByText('Checking your session...')).toBeInTheDocument()
  })

  test('redirects signed-out users to login', () => {
    renderRoute('unauthenticated')
    expect(screen.getByText('Login destination')).toBeInTheDocument()
  })

  test('renders protected content for an authenticated user', () => {
    renderRoute('authenticated')
    expect(screen.getByText('Private content')).toBeInTheDocument()
  })
})

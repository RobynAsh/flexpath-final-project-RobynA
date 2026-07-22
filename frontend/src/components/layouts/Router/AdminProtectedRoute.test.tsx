import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  ProfileContext,
  type ProfileStatus,
} from '../../../providers/ProfileContext'
import { AdminProtectedRoute } from './AdminProtectedRoute'

const renderRoute = (profileStatus: ProfileStatus, isAdmin = false) =>
  render(
    <ProfileContext.Provider
      value={{
        profile:
          profileStatus === 'authenticated'
            ? { username: 'user', isAdmin }
            : undefined,
        profileStatus,
        jwtToken: '',
        setJwtToken: jest.fn(),
      }}
    >
      <MemoryRouter
        initialEntries={['/admin']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<p>Admin content</p>} />
          </Route>
          <Route path="/" element={<p>Home destination</p>} />
        </Routes>
      </MemoryRouter>
    </ProfileContext.Provider>,
  )

describe('AdminProtectedRoute', () => {
  test('shows permission progress while checking', () => {
    renderRoute('checking')
    expect(screen.getByText('Checking your permissions...')).toBeInTheDocument()
  })

  test('rejects authenticated non-admin users', () => {
    renderRoute('authenticated')
    expect(screen.getByText('Home destination')).toBeInTheDocument()
  })

  test('renders content for admins', () => {
    renderRoute('authenticated', true)
    expect(screen.getByText('Admin content')).toBeInTheDocument()
  })
})

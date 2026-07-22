import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  ProfileContext,
  type ProfileContextValue,
} from '../../../providers/ProfileContext'
import { Header } from './Header'

const defaultProfile: ProfileContextValue = {
  profileStatus: 'unauthenticated',
  jwtToken: '',
  setJwtToken: jest.fn(),
}

const renderHeader = (value: ProfileContextValue = defaultProfile) =>
  render(
    <ProfileContext.Provider value={value}>
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Header />
      </MemoryRouter>
    </ProfileContext.Provider>,
  )

describe('Header', () => {
  test('always renders branding and hides navigation when signed out', () => {
    renderHeader()

    expect(screen.getByRole('img', { name: 'Frog Log Logo' })).toBeVisible()
    expect(screen.queryByText('Logout')).not.toBeInTheDocument()
  })

  test('renders authenticated navigation and navigates an admin', () => {
    render(
      <ProfileContext.Provider
        value={{
          ...defaultProfile,
          profileStatus: 'authenticated',
          profile: { username: 'admin', isAdmin: true },
        }}
      >
        <MemoryRouter
          initialEntries={['/']}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/admin" element={<p>Admin destination</p>} />
            <Route path="/logout" element={<p>Logout destination</p>} />
          </Routes>
        </MemoryRouter>
      </ProfileContext.Provider>,
    )

    fireEvent.click(screen.getByText('Admin'))
    expect(screen.getByText('Admin destination')).toBeInTheDocument()
  })

  test('omits the admin link for a regular user', () => {
    renderHeader({
      ...defaultProfile,
      profileStatus: 'authenticated',
      profile: { username: 'member', isAdmin: false },
    })

    expect(screen.getByText('Logout')).toBeInTheDocument()
    expect(screen.queryByText('Admin')).not.toBeInTheDocument()
  })
})

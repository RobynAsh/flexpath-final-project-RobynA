import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  ProfileContext,
  type ProfileStatus,
} from '../../../providers/ProfileContext'
import { UnauthenticatedRoute } from './UnauthenticatedRoute'

const renderRoute = (profileStatus: ProfileStatus) =>
  render(
    <ProfileContext.Provider
      value={{ profileStatus, jwtToken: '', setJwtToken: jest.fn() }}
    >
      <MemoryRouter
        initialEntries={['/public']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route element={<UnauthenticatedRoute />}>
            <Route path="/public" element={<p>Public content</p>} />
          </Route>
          <Route path="/" element={<p>Home destination</p>} />
        </Routes>
      </MemoryRouter>
    </ProfileContext.Provider>,
  )

describe('UnauthenticatedRoute', () => {
  test('shows session progress while checking', () => {
    renderRoute('checking')
    expect(screen.getByText('Checking your session...')).toBeInTheDocument()
  })

  test('redirects signed-in users home', () => {
    renderRoute('authenticated')
    expect(screen.getByText('Home destination')).toBeInTheDocument()
  })

  test('renders content for signed-out users', () => {
    renderRoute('unauthenticated')
    expect(screen.getByText('Public content')).toBeInTheDocument()
  })
})

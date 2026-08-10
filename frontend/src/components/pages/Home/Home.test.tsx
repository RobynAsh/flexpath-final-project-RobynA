import { render, screen } from '@testing-library/react'
import { Home } from './Home'
import {
  ProfileContext,
  type ProfileContextValue,
} from '../../../providers/ProfileContext'
import { MemoryRouter } from 'react-router-dom'

const setJwtToken = jest.fn()
export const profileValue: ProfileContextValue = {
  profileStatus: 'authenticated',
  jwtToken: '1234advdsf',
  setJwtToken,
}

describe('Home', () => {
  test('renders its page label', () => {
    render(
      <MemoryRouter
        initialEntries={['/']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ProfileContext.Provider value={profileValue}>
          <Home />
        </ProfileContext.Provider>
      </MemoryRouter>,
    )
    expect(screen.getByText('Welcome back,')).toBeInTheDocument()
  })
})

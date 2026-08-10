import { render, screen } from '@testing-library/react'
import { Home } from './Home'
import {
  ProfileContext,
  type ProfileContextValue,
} from '../../../providers/ProfileContext'

const setJwtToken = jest.fn()
export const profileValue: ProfileContextValue = {
  profileStatus: 'authenticated',
  jwtToken: '1234advdsf',
  setJwtToken,
}

describe('Home', () => {
  test('renders its page label', () => {
    render(
      <ProfileContext.Provider value={profileValue}>
        <Home />
      </ProfileContext.Provider>,
    )
    expect(screen.getByText('Welcome back,')).toBeInTheDocument()
  })
})

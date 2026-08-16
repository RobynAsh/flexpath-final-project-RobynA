import { render, screen } from '@testing-library/react'
import { Home } from './Home'
import {
  ProfileContext,
  type ProfileContextValue,
} from '../../../providers/ProfileContext'
import { MemoryRouter } from 'react-router-dom'

jest.mock('../../../services/projects/useGetProjects', () => ({
  useGetProjects: () => ({
    data: [
      { projectId: 1, status: 'Not Started' },
      { projectId: 2, status: 'In Progress' },
      { projectId: 3, status: 'In Progress' },
      { projectId: 4, status: 'Completed' },
    ],
  }),
}))

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
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getAllByText('1')).toHaveLength(2)
  })
})
